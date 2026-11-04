import { useMemo, useState } from "react"
import Hero from "./Hero.jsx"
import Button from "./Button.jsx"
import BannerCatalogueCard from "./BannerCatalogueCard.jsx"
import { BANNERS, BANNER_RARITY_PULL_CHANCES, FEATURED_HERO_PULL_CHANCE, STARRED_HERO_PULL_WEIGHT } from "../js/bannerCatalogueUtils.jsx"
import { RARITY_DEFINITIONS } from "../database/enums.jsx"
import "../css/magic-toilet.scss"

const EPIC = RARITY_DEFINITIONS.EPIC.id
const LEGENDARY = RARITY_DEFINITIONS.LEGENDARY.id
const MAX_PULLS = 9999

function clamp(value, min = 1, max = MAX_PULLS) {
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
    if (!pool.length) return weightedPick(heroes)
    const featured = pool.find(hero => hero.id === banner.featuredHeroId)
    const chance = BANNER_RARITY_PULL_CHANCES[rarity]
    if (featured && chance && Math.random() < Math.min(1, FEATURED_HERO_PULL_CHANCE / chance)) return featured
    return weightedPick(pool.filter(hero => hero.id !== featured?.id).length
        ? pool.filter(hero => hero.id !== featured?.id)
        : pool)
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
                const chance = BANNER_RARITY_PULL_CHANCES[LEGENDARY]
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

export default function SubPageMagicToilet({ heroesRef = [] }) {
    const [bannerId, setBannerId] = useState("everyday_heroes")
    const [epicLimit, setEpicLimit] = useState(10)
    const [legendaryLimit, setLegendaryLimit] = useState(90)
    const [epicPity, setEpicPity] = useState(10)
    const [legendaryPity, setLegendaryPity] = useState(90)
    const [customCount, setCustomCount] = useState(25)
    const [results, setResults] = useState([])
    const [totalPulls, setTotalPulls] = useState(0)

    const heroesById = useMemo(() => new Map(heroesRef.map(hero => [hero.id, hero])), [heroesRef])
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
    const legendaryCount = results.filter(result => result.rarity === LEGENDARY).length
    const epicCount = results.filter(result => result.rarity === EPIC).length
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
        if (!banner || !heroes.length) return
        let epic = epicPity
        let legendary = legendaryPity
        const added = []
        const limit = stopAtLegendary ? Math.min(MAX_PULLS, legendaryPity) : clamp(requested)

        for (let index = 0; index < limit; index += 1) {
            let targetRarity = null
            if (legendary <= 1) targetRarity = LEGENDARY
            else if (epic <= 1) targetRarity = EPIC
            else {
                const roll = Math.random()
                if (roll < BANNER_RARITY_PULL_CHANCES[LEGENDARY]) targetRarity = LEGENDARY
                else if (roll < BANNER_RARITY_PULL_CHANCES[LEGENDARY] + BANNER_RARITY_PULL_CHANCES[EPIC]) targetRarity = EPIC
            }

            const lowerPool = heroes.filter(hero => Number(hero.rarity) !== EPIC && Number(hero.rarity) !== LEGENDARY)
            const hero = targetRarity === null
                ? weightedPick(lowerPool) ?? weightedPick(heroes)
                : pickHero(heroes, banner, targetRarity)
            if (!hero) break

            const rarity = Number(hero.rarity)
            legendary = rarity === LEGENDARY ? legendaryLimit : Math.max(1, legendary - 1)
            epic = rarity === EPIC ? epicLimit : Math.max(1, epic - 1)
            added.push({
                id: `${totalPulls + index}-${Date.now()}-${Math.random()}`,
                pullNumber: totalPulls + index + 1,
                hero,
                rarity,
            })
            if (stopAtLegendary && rarity === LEGENDARY) break
        }

        setEpicPity(epic)
        setLegendaryPity(legendary)
        setResults(previous => [...previous, ...added])
        setTotalPulls(previous => previous + added.length)
    }

    const reset = () => {
        setResults([])
        setTotalPulls(0)
        setEpicPity(epicLimit)
        setLegendaryPity(legendaryLimit)
    }

    return (
        <main className="magic-toilet page flex-col w-100">
            <header className="card magic-toilet-header">
                <h1 className="header-big">Magic Toilet</h1>
                <p className="text">Simulate banner flushes, track epic and legendary pity, and compare your legendary results with the expected average.</p>
            </header>

            <section className="card magic-toilet-controls">
                <div className="magic-toilet-control-grid">
                    <label className="magic-toilet-field">
                        <span className="text">Banner</span>
                        <select className="magic-toilet-input" value={bannerId} onChange={event => setBannerId(event.target.value)}>
                            {BANNERS.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                        </select>
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Pity to next Epic</span>
                        <input className="magic-toilet-input" type="number" min="1" max={MAX_PULLS} value={epicLimit} onChange={event => updateEpicLimit(event.target.value)} />
                    </label>
                    <label className="magic-toilet-field">
                        <span className="text">Pity to next Legendary</span>
                        <input className="magic-toilet-input" type="number" min="1" max={MAX_PULLS} value={legendaryLimit} onChange={event => updateLegendaryLimit(event.target.value)} />
                    </label>
                </div>
                <div className="magic-toilet-pity-status">
                    <span className="catalogue-chip text">Epic pity: {epicPity}</span>
                    <span className="catalogue-chip text">Legendary pity: {legendaryPity}</span>
                </div>
                <div className="magic-toilet-actions">
                    <Button text="Flush 1" color="magic-toilet" onClick={() => runPulls(false, 1)} />
                    <Button text="Flush 10" color="magic-toilet" onClick={() => runPulls(false, 10)} />
                    <label className="magic-toilet-custom-count">
                        <span className="text">Custom flushes</span>
                        <input className="magic-toilet-input" type="number" min="1" max={MAX_PULLS} value={customCount} onChange={event => setCustomCount(clamp(event.target.value))} />
                    </label>
                    <Button text={`Flush ${clamp(customCount)}`} color="magic-toilet" onClick={() => runPulls(false, customCount)} />
                    <Button text="Flush until Legendary" color="magic-toilet" onClick={() => runPulls(true)} />
                    <Button text="Reset Results" color={6} onClick={reset} />
                </div>
            </section>

            {selected && <details className="card magic-toilet-banner-details">
                <summary className="text">View selected banner catalogue card</summary>
                <BannerCatalogueCard result={selected} heroesById={heroesById} />
            </details>}

            <section className="magic-toilet-summary">
                <div className="card magic-toilet-stat"><span className="text">Souls used</span><strong className="header-big">{totalPulls.toLocaleString()}</strong></div>
                <div className="card magic-toilet-stat"><span className="text">Flushes</span><strong className="header-big">{totalPulls.toLocaleString()}</strong></div>
                <div className="card magic-toilet-stat"><span className="text">Epics</span><strong className="header-big">{epicCount.toLocaleString()}</strong></div>
                <div className="card magic-toilet-stat"><span className="text">Legendaries</span><strong className="header-big">{legendaryCount.toLocaleString()}</strong></div>
                <div className="card magic-toilet-stat"><span className="text">Expected Legendaries</span><strong className="header-big">{expected.toFixed(2)}</strong></div>
                <div className="card magic-toilet-stat magic-toilet-luck"><span className="text">Luck</span><strong className="header-big">{luckLabel(legendaryCount, expected)}</strong></div>
            </section>

            <section className="card magic-toilet-results">
                <header className="magic-toilet-results-header">
                    <h2 className="header">Pull Results ({results.length})</h2>
                    <span className="text">One soul per flush</span>
                </header>
                {results.length === 0 ? <p className="text magic-toilet-empty">No flushes yet. Pick a banner and start pulling!</p> : (
                    <div className="magic-toilet-result-grid">
                        {results.map(result => <article className="magic-toilet-result" key={result.id} data-rarity={result.rarity}>
                            <span className="magic-toilet-pull-number text">#{result.pullNumber}</span>
                            <Hero heroObj={result.hero} selected={false} level={null} onClick={() => {}} className="hero-static" />
                            <span className="catalogue-chip text">{result.rarity === LEGENDARY ? "Legendary" : result.rarity === EPIC ? "Epic" : "Other"}</span>
                        </article>)}
                    </div>
                )}
            </section>
        </main>
    )
}
