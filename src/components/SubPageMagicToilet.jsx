import { useMemo, useState } from "react"
import Hero from "./Hero.jsx"
import Button from "./Button.jsx"
import BannerCatalogueCard from "./BannerCatalogueCard.jsx"
import VirtualizedHorizontalList from "./VirtualizedHorizontalList.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { BANNERS, BANNER_RARITY_PULL_CHANCES, FEATURED_HERO_PULL_CHANCE, STARRED_HERO_PULL_WEIGHT } from "../js/bannerCatalogueUtils.jsx"
import { RARITY_DEFINITIONS } from "../database/enums.jsx"
import { resourceSprites } from "../database/db_sprites.jsx"
import "../css/hero.scss"
import "../css/magic-toilet.scss"

const UNCOMMON = RARITY_DEFINITIONS.UNCOMMON.id
const RARE = RARITY_DEFINITIONS.RARE.id
const EPIC = RARITY_DEFINITIONS.EPIC.id
const LEGENDARY = RARITY_DEFINITIONS.LEGENDARY.id
const MAX_FLUSHES_PER_ACTION = 1000
const MAX_PITY = 9999
const EPIC_PITY_RESET = 10
const LEGENDARY_PITY_RESET = 90
const EVERYDAY_HEROES_BANNER_ID = "everyday_heroes"
const LEGENDARY_BOOSTER_PULL_CHANCE = FEATURED_HERO_PULL_CHANCE / 4
const REGULAR_LEGENDARY_BOOSTER_PULL_CHANCE = FEATURED_HERO_PULL_CHANCE / 2
const EVERYDAY_LEGENDARY_BOOSTER_PULL_CHANCE = 0.005
const EPIC_BOOSTER_PULL_CHANCE = BANNER_RARITY_PULL_CHANCES[EPIC] / 2

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

function pickHero(heroes, banner, rarity, boostedHeroId = null) {
    const pool = heroes.filter(hero => Number(hero.rarity) === rarity)
    // Never fall back to another rarity: the rolled result must remain the rarity that its odds selected.
    if (!pool.length) return null

    const featured = pool.find(hero => hero.id === banner.featuredHeroId)
    const boosted = pool.find(hero => hero.id === boostedHeroId && hero.id !== featured?.id)
    const rarityChance = MAGIC_TOILET_PULL_CHANCES[rarity]
    const featuredChance = featured
        ? FEATURED_HERO_PULL_CHANCE - (rarity === LEGENDARY && boosted ? LEGENDARY_BOOSTER_PULL_CHANCE : 0)
        : 0
    const boosterChance = boosted
        ? rarity === LEGENDARY
            ? banner.id === EVERYDAY_HEROES_BANNER_ID
                ? EVERYDAY_LEGENDARY_BOOSTER_PULL_CHANCE
                : boosted.isStarred === true
                    ? LEGENDARY_BOOSTER_PULL_CHANCE
                    : REGULAR_LEGENDARY_BOOSTER_PULL_CHANCE
            : EPIC_BOOSTER_PULL_CHANCE
        : 0

    // Hero-level odds are absolute pull chances within the selected rarity, not equal hero weights.
    // Any chance left after featured / boosted heroes is distributed using the existing starred weighting.
    let roll = Math.random() * rarityChance
    if (featured && roll < featuredChance) return featured
    roll -= featuredChance

    if (boosted && roll < boosterChance) return boosted
    const regularPool = pool.filter(hero => hero.id !== featured?.id && hero.id !== boosted?.id)
    if (!regularPool.length) return featured ?? boosted ?? pool[0]

    return weightedPick(regularPool)
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
    const [epicPity, setEpicPity] = useState(EPIC_PITY_RESET)
    const [legendaryPity, setLegendaryPity] = useState(LEGENDARY_PITY_RESET)
    const [startingLegendaryPity, setStartingLegendaryPity] = useState(LEGENDARY_PITY_RESET)
    const [legendaryBoosterEnabled, setLegendaryBoosterEnabled] = useState(false)
    const [legendaryBoosterHeroId, setLegendaryBoosterHeroId] = useState("")
    const [epicBoosterEnabled, setEpicBoosterEnabled] = useState(false)
    const [epicBoosterHeroId, setEpicBoosterHeroId] = useState("")
    const [flushAmount, setFlushAmount] = useState("10")
    const [heroResults, setHeroResults] = useState([])
    const [pullCounts, setPullCounts] = useState(EMPTY_PULL_COUNTS)
    const [totalPulls, setTotalPulls] = useState(0)

    const legendaryList = useDynamicList(0, true)
    const epicList = useDynamicList(0, true)

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
    const epicResults = useMemo(() => heroResults.filter(result => result.rarity === EPIC), [heroResults])
    const legendaryResults = useMemo(() => heroResults.filter(result => result.rarity === LEGENDARY), [heroResults])
    const soulSprite = bannerId === "everyday_heroes" ? resourceSprites.soul : resourceSprites.shimmering_soul
    const soulLabel = bannerId === "everyday_heroes" ? "Souls used" : "Shimmering Souls used"
    const legendaryBoosterHeroes = heroes.filter(hero =>
        Number(hero.rarity) === LEGENDARY && hero.id !== banner?.featuredHeroId
    )
    const epicBoosterHeroes = heroes.filter(hero => Number(hero.rarity) === EPIC)
    const boostersReady = (!legendaryBoosterEnabled || Boolean(legendaryBoosterHeroId))
        && (!epicBoosterEnabled || Boolean(epicBoosterHeroId))
    const expected = expectedLegendaries(totalPulls, startingLegendaryPity, LEGENDARY_PITY_RESET)

    const updateEpicPity = value => setEpicPity(clamp(value))
    const updateLegendaryPity = value => {
        const next = clamp(value)
        setLegendaryPity(next)
        setStartingLegendaryPity(next)
    }

    const runPulls = (stopAtLegendary = false, requested = 1) => {
        if (!banner || !boostersReady) return

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

            const selectedBoosterId = rarity === LEGENDARY && legendaryBoosterEnabled
                ? legendaryBoosterHeroId
                : rarity === EPIC && epicBoosterEnabled
                    ? epicBoosterHeroId
                    : null
            const hero = rarity === EPIC || rarity === LEGENDARY
                ? pickHero(heroes, banner, rarity, selectedBoosterId)
                : null

            // Low-rarity pulls contribute to the counts, but only defined Epic and Legendary heroes get result cards.
            if (hero) {
                const pullNumber = totalPulls + index + 1
                addedHeroes.push({
                    id: pullNumber,
                    pullNumber,
                    hero,
                    rarity,
                    boosterRarity: selectedBoosterId && hero.id === selectedBoosterId ? rarity : null,
                })
            }

            legendary = rarity === LEGENDARY ? LEGENDARY_PITY_RESET : Math.max(1, legendary - 1)
            epic = rarity === EPIC ? EPIC_PITY_RESET : Math.max(1, epic - 1)

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

    const resetResults = () => {
        setHeroResults([])
        setPullCounts(EMPTY_PULL_COUNTS)
        setTotalPulls(0)
        setEpicPity(EPIC_PITY_RESET)
        setLegendaryPity(LEGENDARY_PITY_RESET)
        setStartingLegendaryPity(LEGENDARY_PITY_RESET)
        if (legendaryList.listRef.current) legendaryList.listRef.current.scrollLeft = 0
        if (epicList.listRef.current) epicList.listRef.current.scrollLeft = 0
    }

    const handleBannerChange = event => {
        setBannerId(event.target.value)
        setLegendaryBoosterHeroId("")
        setEpicBoosterHeroId("")
        resetResults()
    }

    const renderHeroResult = result => (
        <article className="magic-toilet-result" key={result.id} data-rarity={result.rarity}>
            <span className="magic-toilet-pull-number text">
                Pull #{result.pullNumber}
                {result.boosterRarity === LEGENDARY && (
                    <img className="magic-toilet-pull-booster-icon" src={resourceSprites.legendary_banner_booster} alt="Legendary Banner Booster" />
                )}
                {result.boosterRarity === EPIC && (
                    <img className="magic-toilet-pull-booster-icon" src={resourceSprites.epic_banner_booster} alt="Epic Banner Booster" />
                )}
            </span>
            <Hero heroObj={result.hero} selected={false} level={null} onClick={() => {}} className="hero-static" />
            <span className="catalogue-chip text magic-toilet-hero-name">{result.hero.name}</span>
        </article>
    )

    return (
        <main className="magic-toilet page card flex-col w-100">
            <header className="card magic-toilet-header">
                <div className="header-big">Magic Toilet</div>
                <p className="text">Simulate banner flushes, track Epic and Legendary pity, and compare your Legendary results with the expected average.</p>
            </header>

            <section className="card magic-toilet-controls">
                <div className="magic-toilet-control-grid">
                    <label className="magic-toilet-field">
                        <span className="text">Banner</span>
                        <select value={bannerId} onChange={handleBannerChange}>
                            {BANNERS.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                        </select>
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Current Epic Pity</span>
                        <input type="number" min="1" max={MAX_PITY} value={epicPity} onChange={event => updateEpicPity(event.target.value)} />
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Current Legendary Pity</span>
                        <input type="number" min="1" max={MAX_PITY} value={legendaryPity} onChange={event => updateLegendaryPity(event.target.value)} />
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
                </div>
                <div className="magic-toilet-booster-row">
                    <div className="magic-toilet-booster-option">
                        <label className="magic-toilet-booster-toggle">
                            <input
                                type="checkbox"
                                aria-label="Enable Legendary Banner Booster"
                                checked={legendaryBoosterEnabled}
                                onChange={event => setLegendaryBoosterEnabled(event.target.checked)}
                            />
                            <img src={resourceSprites.legendary_banner_booster} alt="" />
                            {!legendaryBoosterEnabled && <span className="text">Legendary Banner Booster</span>}
                        </label>
                        {legendaryBoosterEnabled && (
                            <select
                                aria-label="Legendary Banner Booster hero"
                                value={legendaryBoosterHeroId}
                                onChange={event => setLegendaryBoosterHeroId(event.target.value)}
                            >
                                <option value="">Select a Hero</option>
                                {legendaryBoosterHeroes.map(hero => (
                                    <option key={hero.id} value={hero.id}>{hero.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="magic-toilet-booster-option">
                        <label className="magic-toilet-booster-toggle">
                            <input
                                type="checkbox"
                                aria-label="Enable Epic Banner Booster"
                                checked={epicBoosterEnabled}
                                onChange={event => setEpicBoosterEnabled(event.target.checked)}
                            />
                            <img src={resourceSprites.epic_banner_booster} alt="" />
                            {!epicBoosterEnabled && <span className="text">Epic Banner Booster</span>}
                        </label>
                        {epicBoosterEnabled && (
                            <select
                                aria-label="Epic Banner Booster hero"
                                value={epicBoosterHeroId}
                                onChange={event => setEpicBoosterHeroId(event.target.value)}
                            >
                                <option value="">Select a Hero</option>
                                {epicBoosterHeroes.map(hero => (
                                    <option key={hero.id} value={hero.id}>{hero.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
                <div className="magic-toilet-actions">
                    <Button text="Flush 1" color="magic-toilet" disabled={!boostersReady} onClick={() => runPulls(false, 1)} />
                    <Button text={`Flush ${Number(flushAmount).toLocaleString()}`} color="magic-toilet" disabled={!boostersReady} onClick={() => runPulls(false, Number(flushAmount))} />
                    <Button text="Flush until Legendary" color="magic-toilet" disabled={!boostersReady} onClick={() => runPulls(true)} />
                </div>
                {!boostersReady && (
                    <span className="text magic-toilet-booster-warning">Select your boosted hero to enable flushing.</span>
                )}
            </section>

            {selected && <details className="card magic-toilet-banner-details">
                <summary className="text">View selected banner catalogue card</summary>
                <BannerCatalogueCard result={selected} heroesById={heroesById} />
            </details>}

            <section className="card magic-toilet-results">
                <div className="magic-toilet-stats" aria-label="Magic Toilet pull statistics">
                    <span className="catalogue-chip text magic-toilet-stat-chip magic-toilet-souls-chip">
                        <img className="catalogue-chip-icon" src={soulSprite} alt="" />
                        {soulLabel}: {totalPulls.toLocaleString()}
                    </span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Uncommon (55%): {pullCounts[UNCOMMON].toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Rare (35%): {pullCounts[RARE].toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip" data-rarity={EPIC}>Epic (9%): {epicCount.toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip" data-rarity={LEGENDARY}>Legendary (1%): {legendaryCount.toLocaleString()}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Expected Legendaries: {expected.toFixed(2)}</span>
                    <span className="catalogue-chip text magic-toilet-stat-chip">Luck: {luckLabel(legendaryCount, expected)}</span>
                </div>

                <header className="magic-toilet-results-header">
                    <h2 className="header">Pulled Heroes ({heroResults.length})</h2>
                    <div className="magic-toilet-results-note-actions">
                        <span className="text magic-toilet-results-note">Only defined Epic and Legendary heroes are shown.</span>
                        <Button text="Reset Results" color={6} onClick={resetResults} />
                    </div>
                </header>

                <section className="magic-toilet-hero-row">
                    <header className="magic-toilet-hero-row-header">
                        <h3 className="header">Legendary Heroes ({legendaryResults.length})</h3>
                    </header>
                    <div
                        ref={legendaryList.listRef}
                        {...legendaryList.events}
                        className="magic-toilet-horizontal-list"
                        aria-label="Pulled Legendary heroes"
                    >
                        {legendaryResults.length === 0 ? (
                            <p className="text magic-toilet-empty">No Legendary heroes pulled yet.</p>
                        ) : (
                            <VirtualizedHorizontalList
                                items={legendaryResults}
                                scrollElementRef={legendaryList.listRef}
                                renderItem={renderHeroResult}
                                itemWidth={116}
                                gap={8}
                            />
                        )}
                    </div>
                </section>

                <section className="magic-toilet-hero-row">
                    <header className="magic-toilet-hero-row-header">
                        <h3 className="header">Epic Heroes ({epicResults.length})</h3>
                    </header>
                    <div
                        ref={epicList.listRef}
                        {...epicList.events}
                        className="magic-toilet-horizontal-list"
                        aria-label="Pulled Epic heroes"
                    >
                        {epicResults.length === 0 ? (
                            <p className="text magic-toilet-empty">No Epic heroes pulled yet.</p>
                        ) : (
                            <VirtualizedHorizontalList
                                items={epicResults}
                                scrollElementRef={epicList.listRef}
                                renderItem={renderHeroResult}
                                itemWidth={116}
                                gap={8}
                            />
                        )}
                    </div>
                </section>
            </section>
        </main>
    )
}
