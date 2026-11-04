import { useMemo, useState } from "react"
import Hero from "./Hero.jsx"
import Button from "./Button.jsx"
import BannerCatalogueCard from "./BannerCatalogueCard.jsx"
import VirtualizedGrid from "./VirtualizedGrid.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { BANNERS, BANNER_RARITY_PULL_CHANCES, FEATURED_HERO_PULL_CHANCE, STARRED_HERO_PULL_WEIGHT } from "../js/bannerCatalogueUtils.jsx"
import { RARITY_DEFINITIONS } from "../database/enums.jsx"
import "../css/hero.scss"
import "../css/magic-toilet.scss"

const UNCOMMON = RARITY_DEFINITIONS.UNCOMMON.id
const RARE = RARITY_DEFINITIONS.RARE.id
const EPIC = RARITY_DEFINITIONS.EPIC.id
const LEGENDARY = RARITY_DEFINITIONS.LEGENDARY.id
const MAX_FLUSHES_PER_ACTION = 1000
const MAX_PITY = 9999

// These are full-pool chances; the tracked banner hero list only defines the Epic and Legendary hero identities.
const MAGIC_TOILET_RARITY_DISTRIBUTION = [
    [UNCOMMON, 0.55],
    [RARE, 0.35],
    [EPIC, BANNER_RARITY_PULL_CHANCES[EPIC]],
    [LEGENDARY, BANNER_RARITY_PULL_CHANCES[LEGENDARY]],
]
const MAGIC_TOILET_PULL_CHANCES = Object.fromEntries(MAGIC_TOILET_RARITY_DISTRIBUTION)

const FLUSH_AMOUNT_OPTIONS = [1, 10, 25, 50, 100, 250, 500, 1000]

function clamp(value, min = 1, max = MAX_PITY) {
    const number = Number.parseInt(value, 10)
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : min
}

function weightedPick(heroes) {
    if (!heroes.length) return null
    const weight = hero => hero.isStarred === true ? STARRED_HERO_PULL_WEIGHT : 1
    let roll = Math.random() * heroes.reduce((sum, hero) => sum + weight(hero), 0)
    for (const hero of heroes) {
        roll -= weight(hero)
        if (roll < 0) return hero
    }
    return heroes[heroes.length - 1]
}

function pickHero(heroes, banner, rarity) {
    const pool = heroes.filter(hero => Number(hero.rarity) === rarity)
    // Never fall back to another rarity: the rolled result must remain the rarity that its odds selected.
    if (!pool.length) return null

    const featured = pool.find(hero => hero.id === banner.featuredHeroId)
    const chance = MAGIC_TOILET_PULL_CHANCES[rarity]
    if (featured && chance && Math.random() < Math.min(1, FEATURED_HERO_PULL_CHANCE / chance)) return featured

    const regularPool = pool.filter(hero => hero.id !== featured?.id)
    return weightedPick(regularPool.length ? regularPool : pool)
}

function rollRarity(epicPity, legendaryPity) {
    if (legendaryPity <= 1) return LEGENDARY
    if (epicPity <= 1) return EPIC

    const roll = Math.random()
    let cumulativeChance = 0
    for (const [rarity, chance] of MAGIC_TOILET_RARITY_DISTRIBUTION) {
        cumulativeChance += chance
        if (roll < cumulativeChance) return rarity
    }
    return UNCOMMON
}

function expectedLegendaries(pulls, startingPity, pityLimit) {
    let states = new Map([[startingPity, 1]])
    let expected = 0
    for (let index = 0; index < pulls; index += 1) {
        const next = new Map()
        const add = (pity, probability) => next.set(pity, (next.get(pity) ?? 0) + probability)
        for (const [pity, probability] of states) {
            if (pity <= 1) {
                expected += probability
                add(pityLimit, probability)
            } else {
                const chance = MAGIC_TOILET_PULL_CHANCES[LEGENDARY]
                expected += probability * chance
                add(pityLimit, probability * chance)
                add(pity - 1, probability * (1 - chance))
            }
        }
        states = next
    }
    return expected
}

function luckLabel(actual, expected) {
    if (expected <= 0) return "Not enough pulls yet"
    const ratio = actual / expected
    if (ratio >= 1.5) return "Extremely lucky"
    if (ratio >= 1.15) return "Lucky"
    if (ratio >= 0.85) return "Around average"
    if (ratio >= 0.6) return "Unlucky"
    return "Very unlucky"
}

const EMPTY_PULL_COUNTS = {
    [UNCOMMON]: 0,
    [RARE]: 0,
    [EPIC]: 0,
    [LEGENDARY]: 0,
}

export default function SubPageMagicToilet({ heroesRef = [] }) {
    const [bannerId, setBannerId] = useState("everyday_heroes")
    const [epicLimit, setEpicLimit] = useState(10)
    const [legendaryLimit, setLegendaryLimit] = useState(90)
    const [epicPity, setEpicPity] = useState(10)
    const [legendaryPity, setLegendaryPity] = useState(90)
    const [flushAmount, setFlushAmount] = useState("10")
    const [heroResults, setHeroResults] = useState([])
    const [pullCounts, setPullCounts] = useState(EMPTY_PULL_COUNTS)
    const [totalPulls, setTotalPulls] = useState(0)

    const { listHeight, listRef, events } = useDynamicList(0, true)

    const heroData = Array.isArray(heroesRef)
        ? heroesRef
        : Array.isArray(heroesRef?.current)
            ? heroesRef.current
            : []
    const heroesById = useMemo(() => new Map(heroData.map(hero => [hero.id, hero])), [heroData])
    const bannerResults = useMemo(() => BANNERS.map((banner, sourceIndex) => {
        const heroes = banner.heroIds.map(id => heroesById.get(id)).filter(Boolean)
        const conditionalHeroes = (banner.conditionalHeroIDs ?? []).map(id => heroesById.get(id)).filter(Boolean)
        return {
            banner, sourceIndex, heroes, allHeroes: heroes, conditionalHeroes,
            missingHeroCount: banner.heroIds.length - heroes.length
                + (banner.conditionalHeroIDs ?? []).length - conditionalHeroes.length,
        }
    }), [heroesById])
    const selected = bannerResults.find(result => result.banner.id === bannerId) ?? bannerResults[0]
    const banner = selected?.banner
    const heroes = selected?.allHeroes ?? []
    const epicCount = pullCounts[EPIC]
    const legendaryCount = pullCounts[LEGENDARY]
    const expected = expectedLegendaries(totalPulls, legendaryLimit, legendaryLimit)

    const updateEpicLimit = value => {
        const next = clamp(value)
        setEpicLimit(next)
        setEpicPity(next)
    }
    const updateLegendaryLimit = value => {
        const next = clamp(value)
        setLegendaryLimit(next)
        setLegendaryPity(next)
    }

    const runPulls = (stopAtLegendary = false, requested = 1) => {
        if (!banner) return

        let epic = epicPity
        let legendary = legendaryPity
        const addedHeroes = []
        const addedCounts = { ...EMPTY_PULL_COUNTS }
        const limit = stopAtLegendary
            ? MAX_FLUSHES_PER_ACTION
            : Math.min(MAX_FLUSHES_PER_ACTION, clamp(requested))

        for (let index = 0; index < limit; index += 1) {
            const rarity = rollRarity(epic, legendary)
            addedCounts[rarity] += 1

            const hero = rarity === EPIC || rarity === LEGENDARY
                ? pickHero(heroes, banner, rarity)
                : null

            // Low-rarity pulls contribute to the counts, but only defined Epic and Legendary heroes get result cards.
            if (hero) {
                const pullNumber = totalPulls + index + 1
                addedHeroes.push({
                    id: pullNumber,
                    pullNumber,
                    hero,
                    rarity,
                })
            }

            legendary = rarity === LEGENDARY ? legendaryLimit : Math.max(1, legendary - 1)
            epic = rarity === EPIC ? epicLimit : Math.max(1, epic - 1)

            if (stopAtLegendary && rarity === LEGENDARY) break
        }

        const pullsThisFlush = Object.values(addedCounts).reduce((total, count) => total + count, 0)
        setEpicPity(epic)
        setLegendaryPity(legendary)
        setHeroResults(previous => [...previous, ...addedHeroes])
        setPullCounts(previous => ({
            [UNCOMMON]: previous[UNCOMMON] + addedCounts[UNCOMMON],
            [RARE]: previous[RARE] + addedCounts[RARE],
            [EPIC]: previous[EPIC] + addedCounts[EPIC],
            [LEGENDARY]: previous[LEGENDARY] + addedCounts[LEGENDARY],
        }))
        setTotalPulls(previous => previous + pullsThisFlush)
    }

    const reset = () => {
        setHeroResults([])
        setPullCounts(EMPTY_PULL_COUNTS)
        setTotalPulls(0)
        setEpicPity(epicLimit)
        setLegendaryPity(legendaryLimit)
    }

    const renderHeroResult = result => (
        <article className="magic-toilet-result" key={result.id} data-rarity={result.rarity}>
            <span className="magic-toilet-pull-number text">Pull #{result.pullNumber}</span>
            <Hero heroObj={result.hero} selected={false} level={null} onClick={() => {}} className="hero-static" />
            <span className="catalogue-chip text magic-toilet-hero-name">{result.hero.name}</span>
            <span className="catalogue-chip text">{result.rarity === LEGENDARY ? "Legendary" : "Epic"}</span>
        </article>
    )

    return (
        <main className="magic-toilet page card flex-col w-100">
            <header className="card magic-toilet-header">
                <h1 className="header-big">Magic Toilet</h1>
                <p className="text">Simulate banner flushes, track Epic and Legendary pity, and compare your Legendary results with the expected average.</p>
            </header>

            <section className="card magic-toilet-controls">
                <div className="magic-toilet-control-grid">
                    <label className="magic-toilet-field">
                        <span className="text">Banner</span>
                        <select value={bannerId} onChange={event => setBannerId(event.target.value)}>
                            {BANNERS.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                        </select>
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Pity to next Epic</span>
                        <input type="number" min="1" max={MAX_PITY} value={epicLimit} onChange={event => updateEpicLimit(event.target.value)} />
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Pity to next Legendary</span>
                        <input type="number" min="1" max={MAX_PITY} value={legendaryLimit} onChange={event => updateLegendaryLimit(event.target.value)} />
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Flush amount</span>
                        <select value={flushAmount} onChange={event => setFlushAmount(event.target.value)}>
                            {FLUSH_AMOUNT_OPTIONS.map(amount => <option key={amount} value={String(amount)}>{amount.toLocaleString()}</option>)}
                        </select>
                    </label>
                </div>
                <div className="magic-toilet-pity-status">
                    <span className="catalogue-chip text">Epic pity: {epicPity}</span>
                    <span className="catalogue-chip text">Legendary pity: {legendaryPity}</span>
                    <span className="catalogue-chip text">Max flushes per action: {MAX_FLUSHES_PER_ACTION.toLocaleString()}</span>
                </div>
                <div className="magic-toilet-actions">
                    <Button text={`Flush ${Number(flushAmount).toLocaleString()}`} color="magic-toilet" onClick={() => runPulls(false, Number(flushAmount))} />
                    <Button text="Flush until Legendary" color="magic-toilet" onClick={() => runPulls(true)} />
                    <Button text="Reset Results" color={6} onClick={reset} />
                </div>
            </section>

            {selected && <details className="card magic-toilet-banner-details">
                <summary className="text">View selected banner catalogue card</summary>
                <BannerCatalogueCard result={selected} heroesById={heroesById} />
            </details>}

            <section className="card magic-toilet-results">
                <div className="magic-toilet-stats" aria-label="Magic Toilet pull statistics">
                    <span className="catalogue-chip text magic-toilet-stat-chip">Souls used: {totalPulls.toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Flushes: {totalPulls.toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Uncommon (55%): {pullCounts[UNCOMMON].toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Rare (35%): {pullCounts[RARE].toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip" data-rarity={EPIC}>Epic (9%): {epicCount.toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip" data-rarity={LEGENDARY}>Legendary (1%): {legendaryCount.toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Expected Legendaries: {expected.toFixed(2)}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Luck: {luckLabel(legendaryCount, expected)}</span>
                </div>

                <header className="magic-toilet-results-header">
                    <h2 className="header">Pulled Heroes ({heroResults.length})</h2>
                    <span className="text">Only defined Epic and Legendary heroes are shown.</span>
                </header>

                <div
                    ref={listRef}
                    {...events}
                    className="magic-toilet-pulls-list virtualized-list-scroll"
                    style={{ height: Math.max(140, listHeight) }}
                >
                    {heroResults.length === 0 ? (
                        <p className="text magic-toilet-empty">No Epic or Legendary heroes pulled yet. Uncommon and Rare pulls are counted above.</p>
                    ) : (
                        <VirtualizedGrid
                            items={heroResults}
                            scrollElementRef={listRef}
                            renderItem={renderHeroResult}
                            minColumnWidth={112}
                            columnGap={8}
                            rowGap={8}
                            estimatedRowHeight={190}
                            overscan={3}
                        />
                    )}
                </div>
            </section>
        </main>
    )
}
