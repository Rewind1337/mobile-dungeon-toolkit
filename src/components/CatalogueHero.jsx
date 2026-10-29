import { useMemo, useState } from "react"
import {
    ATTRIBUTE_DEFINITIONS,
    ELEMENT_DEFINITIONS,
    RARITY_DEFINITIONS,
    ROLE_DEFINITIONS,
    getEnumNameById
} from "../database/enums.jsx"
import Button from "./Button.jsx"
import Hero from "./Hero.jsx"
import { init_banner_db } from "../database/db_banners.jsx"
import { getBannerLastLiveLabel } from "../database/bannerUtils.jsx"
import { attributeSprites, roleSprites, resourceSprites } from "../database/db_sprites.jsx"
import { isSearchAssetField, matchesSearchQuery, useUrlSearch } from "../js/search.jsx"

const HERO_CATALOGUE_RARITIES = Object.values(RARITY_DEFINITIONS).filter(
    rarity => rarity.id >= RARITY_DEFINITIONS.UNCOMMON.id && rarity.id <= RARITY_DEFINITIONS.LEGENDARY.id
)

const BANNERS = init_banner_db()
const BANNER_RARITY_PULL_CHANCES = {
    [RARITY_DEFINITIONS.LEGENDARY.id]: 0.01,
    [RARITY_DEFINITIONS.EPIC.id]: 0.09,
}
const STARRED_HERO_PULL_WEIGHT = 1 / 3
const FEATURED_HERO_PULL_CHANCE = 0.005
const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

function parseBannerDate(dateString) {
    if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null

    const [year, month, day] = dateString.split("-").map(Number)
    const timestamp = Date.UTC(year, month - 1, day)
    const parsed = new Date(timestamp)
    if (
        parsed.getUTCFullYear() !== year
        || parsed.getUTCMonth() !== month - 1
        || parsed.getUTCDate() !== day
    ) return null

    return timestamp
}

// Prefer a recorded date. If it is missing, estimate it from the previous and next
// banners only when both adjacent dates exist; until then the UI displays N/A.
function getBannerLiveDateInfo(banners, index) {
    const currentBanner = banners[index]
    const currentTimestamp = parseBannerDate(currentBanner?.lastLiveDate)
    if (currentTimestamp !== null) {
        return { date: currentBanner.lastLiveDate, estimated: false }
    }

    const previousTimestamp = parseBannerDate(banners[index - 1]?.lastLiveDate)
    const nextTimestamp = parseBannerDate(banners[index + 1]?.lastLiveDate)
    if (previousTimestamp !== null && nextTimestamp !== null && nextTimestamp >= previousTimestamp) {
        const estimatedTimestamp = Math.round((previousTimestamp + nextTimestamp) / 2)
        return { date: new Date(estimatedTimestamp).toISOString().slice(0, 10), estimated: true }
    }

    return { date: null, estimated: false }
}

function hasValidBannerDate(banner) {
    return parseBannerDate(banner?.lastLiveDate) !== null
}

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return [String(value)]
    if (typeof value !== "object" || seen.has(value)) return []
    seen.add(value)
    return Object.entries(value).flatMap(([key, child]) => isSearchAssetField(key) ? [] : getSearchableValues(child, seen))
}

function formatEffect(effect) {
    if (effect === null || effect === undefined) return ""
    if (typeof effect === "string") return effect
    try {
        return JSON.stringify(effect, null, 2)
    } catch {
        return String(effect)
    }
}

function formatTalentEffects(effect) {
    if (effect === null || effect === undefined) return []
    const effects = Array.isArray(effect) ? effect : [effect]
    return effects.flatMap(entry => {
        if (!entry || typeof entry !== "object") return [String(entry)]
        return Object.entries(entry).map(([key, value]) => {
            const displayValue = typeof value === "number" ? Number(value.toPrecision(12)) : value
            return `${key} : x${displayValue}`
        })
    })
}

function HeroCatalogueCard({ hero }) {
    const rarity = getEnumNameById(RARITY_DEFINITIONS, Number(hero.rarity)) ?? "Unknown rarity"
    const attribute = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? "Unknown attribute"
    const role = getEnumNameById(ROLE_DEFINITIONS, Number(hero.role)) ?? "Unknown role"

    const skills = Array.isArray(hero.skills) ? hero.skills : []
    const talents = hero.talents && typeof hero.talents === "object"
        ? Object.entries(hero.talents)
        : []

    return (
        <article className="hero-catalogue-card card">
            <header className="hero-catalogue-identity">
                <div className="hero-catalogue-portrait">
                    <Hero heroObj={hero} selected={false} level={null} onClick={() => {}} />
                </div>
                <div className="hero-catalogue-heading">
                    <div className="hero-catalogue-name catalogue-chip header text" data-rarity={hero.rarity}>{hero.name}</div>
                    <div className="hero-catalogue-meta-row">
                        <span className="catalogue-chip catalogue-chip-rarity text" data-rarity={hero.rarity}>{humanize(rarity)}</span>
                        <span className={`catalogue-chip catalogue-chip-attribute catalogue-chip-attribute-${String(attribute).toLowerCase()} text`}>
                            {typeof attributeSprites[Number(hero.mainAttribute)] === "string" && <img className="catalogue-chip-icon" src={attributeSprites[Number(hero.mainAttribute)]} alt="" />}
                            {humanize(attribute)}
                        </span>
                        <span className={`catalogue-chip catalogue-chip-role catalogue-chip-role-${String(role).toLowerCase()} text`}>
                            <img className="catalogue-chip-icon" src={roleSprites[Number(hero.role)]} alt="" />
                            {humanize(role)}
                        </span>
                    </div>
                    {hero.variant && <p className="hero-catalogue-variant text">Variant: {hero.variant}</p>}
                </div>
            </header>

            {skills.length > 0 && (
                <section className="hero-catalogue-section card">
                    <div className="catalogue-section-label text">Skills ({skills.length})</div>
                    <div className="hero-catalogue-skills">
                        {skills.map((skill, index) => (
                            <article className="hero-catalogue-skill" key={skill.name ?? index}>
                                <div className="hero-catalogue-skill-heading">
                                    <strong className="text">{skill.name ?? `Skill ${index + 1}`}</strong>
                                    <span className="hero-catalogue-skill-meta text">
                                        {skill.level !== undefined && `Lv. ${skill.level}`}
                                        {skill.cooldown !== undefined && ` · Cooldown ${skill.cooldown}`}
                                    </span>
                                </div>
                                {skill.description && <p className="hero-catalogue-description text">{skill.description}</p>}
                                {skill.effect && (
                                    <details className="hero-catalogue-details">
                                        <summary className="text">Effect data</summary>
                                        <pre className="hero-catalogue-code text">{formatEffect(skill.effect)}</pre>
                                    </details>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {talents.length > 0 && (
                <section className="hero-catalogue-section card">
                    <div className="catalogue-section-label text">Talents ({talents.length})</div>
                    <div className="hero-catalogue-talents">
                        {talents.map(([key, talent]) => (
                            <article className="hero-catalogue-talent" key={key}>
                                <strong className="text">{talent?.name ?? `Talent ${key}`}</strong>
                                {talent?.effect !== undefined && (
                                    <ul className="hero-catalogue-talent-effects">
                                        {formatTalentEffects(talent.effect).map((effectLine, index) => (
                                            <li className="text" key={`${key}-effect-${index}`}>{effectLine}</li>
                                        ))}
                                    </ul>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </article>
    )
}


function matchesBannerHeroQuery(hero, query) {
    const rarity = getEnumNameById(RARITY_DEFINITIONS, Number(hero.rarity)) ?? ""
    const attribute = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? ""
    const element = getEnumNameById(ELEMENT_DEFINITIONS, Number(hero.element)) ?? ""
    const role = getEnumNameById(ROLE_DEFINITIONS, Number(hero.role)) ?? ""
    return matchesSearchQuery([
        ...getSearchableValues(hero),
        rarity,
        attribute,
        element,
        role,
    ], query, term => {
        if (term === "starred") return hero.isStarred === true
        if (term === "not starred") return hero.isStarred !== true
        return undefined
    })
}

function BannerHeroGroup({ title, heroes, oddsPool = [], rarityChance = null, featuredHero = null }) {
    if (heroes.length === 0) return null
    const regularPool = oddsPool.filter(hero => hero.id !== featuredHero?.id)
    const totalPoolWeight = regularPool.reduce(
        (total, hero) => total + (hero.isStarred === true ? STARRED_HERO_PULL_WEIGHT : 1),
        0
    )

    return (
        <section className="banner-catalogue-rarity-group">
            <h3 className="banner-catalogue-group-title text">{title} <span>({heroes.length})</span></h3>
            <div className="banner-catalogue-hero-grid">
                {heroes.map((hero, index) => {
                    const isFeaturedHero = featuredHero?.id === hero.id
                    const heroWeight = hero.isStarred === true ? STARRED_HERO_PULL_WEIGHT : 1
                    const remainingRarityChance = featuredHero && Number(featuredHero.rarity) === Number(hero.rarity)
                        ? Math.max(0, (rarityChance ?? 0) - FEATURED_HERO_PULL_CHANCE)
                        : rarityChance
                    const odds = isFeaturedHero
                        ? FEATURED_HERO_PULL_CHANCE
                        : remainingRarityChance !== null && remainingRarityChance !== undefined && totalPoolWeight > 0
                            ? remainingRarityChance * heroWeight / totalPoolWeight
                            : null

                    return (
                        <div className="banner-catalogue-hero card" key={`${hero.id}-${index}`} title={hero.name}>
                            <Hero className="hero-static" heroObj={hero} selected={false} level={null} onClick={() => {}} />
                            {odds !== null && (
                                <span className={`banner-catalogue-hero-odds catalogue-chip text${isFeaturedHero ? " banner-catalogue-hero-odds--featured" : ""}`}>
                                    {isFeaturedHero && <img className="banner-catalogue-booster" src={resourceSprites.neutral_banner_booster} alt="" loading="lazy" decoding="async" />}
                                    {(odds * 100).toFixed(3)}% chance{isFeaturedHero ? " · Featured" : ""}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

function BannerCatalogueCard({ result, heroesById }) {
    const { banner, heroes, allHeroes = heroes, conditionalHeroes, missingHeroCount, sourceIndex } = result
    const isEverydayBanner = banner.id === "everyday_heroes"
    const featuredHero = banner.featuredHeroId
        ? (heroesById.get(banner.featuredHeroId) ?? null)
        : null
    const liveDateInfo = getBannerLiveDateInfo(BANNERS, sourceIndex)
    const lastLiveLabel = liveDateInfo.date ? getBannerLastLiveLabel(liveDateInfo.date) : ""
    const liveDateText = liveDateInfo.date
        ? `${liveDateInfo.estimated ? "~" : ""}${liveDateInfo.date}${lastLiveLabel}`
        : "N/A"
    const rarityGroups = [
        {
            title: "Legendary Heroes",
            heroes: [
                ...heroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.LEGENDARY.id),
                ...(featuredHero
                    && Number(featuredHero.rarity) === RARITY_DEFINITIONS.LEGENDARY.id
                    && !heroes.some(hero => hero.id === featuredHero.id)
                    ? [featuredHero]
                    : []),
            ],
            oddsPool: allHeroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.LEGENDARY.id),
            rarityChance: BANNER_RARITY_PULL_CHANCES[RARITY_DEFINITIONS.LEGENDARY.id],
        },
        {
            title: "Epic Heroes",
            heroes: [
                ...heroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.EPIC.id),
                ...(featuredHero
                    && Number(featuredHero.rarity) === RARITY_DEFINITIONS.EPIC.id
                    && !heroes.some(hero => hero.id === featuredHero.id)
                    ? [featuredHero]
                    : []),
            ],
            oddsPool: allHeroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.EPIC.id),
            rarityChance: BANNER_RARITY_PULL_CHANCES[RARITY_DEFINITIONS.EPIC.id],
        },
        {
            title: "Other Heroes",
            heroes: heroes.filter(hero => Number(hero.rarity) !== RARITY_DEFINITIONS.LEGENDARY.id && Number(hero.rarity) !== RARITY_DEFINITIONS.EPIC.id),
            oddsPool: [],
            rarityChance: null,
        },
    ]

    return (
        <article className={`banner-catalogue-card card${isEverydayBanner ? " card-dark" : ""}`}>
            <header className="banner-catalogue-card-header">
                <h2 className="banner-catalogue-name header-big">{banner.name}</h2>
                <div className="banner-catalogue-meta">
                    <span className="catalogue-chip text">{banner.heroIds.length} listed heroes</span>
                    {banner.standardBanner && <span className="catalogue-chip text">Standard banner</span>}
                    {featuredHero && <span className="catalogue-chip text">Featured: {featuredHero.name}</span>}
                    {!isEverydayBanner &&  <span
                        className="catalogue-chip banner-catalogue-live-date text"
                        title={liveDateInfo.estimated ? "Estimated from the previous and next banner dates" : "Recorded last-live date"}
                    >
                        Last live: {liveDateText}
                    </span>}
                    {isEverydayBanner && <span className="catalogue-chip banner-catalogue-chip-permanent text">Always available</span>}
                </div>
            </header>

            <div className="banner-catalogue-groups">
                {rarityGroups.map(({ title, heroes: groupHeroes, oddsPool, rarityChance }) => (
                    <BannerHeroGroup
                        key={title}
                        title={title}
                        heroes={groupHeroes}
                        oddsPool={oddsPool}
                        rarityChance={rarityChance}
                        featuredHero={featuredHero}
                    />
                ))}
            </div>

            {conditionalHeroes.length > 0 && (
                <section className="banner-catalogue-conditional">
                    <h3 className="banner-catalogue-group-title text">Conditional Heroes ({conditionalHeroes.length})</h3>
                    <div className="banner-catalogue-hero-grid">
                        {conditionalHeroes.map((hero, index) => (
                            <div className="banner-catalogue-hero" key={`${hero.id}-conditional-${index}`} title={hero.name}>
                                <Hero heroObj={hero} selected={false} level={null} onClick={() => {}} />
                                <span className="banner-catalogue-hero-odds banner-catalogue-hero-odds--conditional text">
                                    Conditional
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {missingHeroCount > 0 && (
                <p className="banner-catalogue-missing text">
                    {missingHeroCount} referenced {missingHeroCount === 1 ? "hero is" : "heroes are"} not defined in the hero database.
                </p>
            )}
        </article>
    )
}

function BannerCatalogueList({ heroesRef, search, setSearch, commitSearch }) {
    const heroesById = useMemo(() => {
        const heroes = Array.isArray(heroesRef) ? heroesRef : []
        return new Map(heroes.map(hero => [hero.id, hero]))
    }, [heroesRef])
    const query = search.trim().toLowerCase()

    const filteredBanners = useMemo(() => {
        const allDated = BANNERS.every(banner =>
            banner.id === "everyday_heroes" || hasValidBannerDate(banner)
        )

        return BANNERS.map((banner, sourceIndex) => {
            const resolveList = ids => (Array.isArray(ids) ? ids : [])
                .map(id => heroesById.get(id) ?? null)
            const primaryRaw = resolveList(banner.heroIds)
            const conditionalRaw = resolveList(banner.conditionalHeroIDs)
            const missingHeroCount = primaryRaw.filter(hero => !hero).length
                + conditionalRaw.filter(hero => !hero).length
            const bannerMetadata = {
                ...banner,
                heroIds: [],
                conditionalHeroIDs: [],
                featuredHeroId: null,
            }

            // Search both banner metadata and the text represented by its visible detail chips.
            // Hero data is searched separately so a matching hero doesn't expose unrelated heroes.
            const liveDateInfo = getBannerLiveDateInfo(BANNERS, sourceIndex)
            const searchableBannerMetadata = [
                ...getSearchableValues(bannerMetadata),
                banner.standardBanner ? "standard standard banner" : "event banner",
                `${Array.isArray(banner.heroIds) ? banner.heroIds.length : 0} listed heroes`,
                banner.featuredHeroId ? "featured featured hero" : "",
                liveDateInfo.date ? `last live ${liveDateInfo.date}` : "last live n/a",
                ...(Array.isArray(banner.conditionalHeroIDs) && banner.conditionalHeroIDs.length > 0
                    ? ["conditional conditional heroes", `${banner.conditionalHeroIDs.length} conditional heroes`]
                    : []),
            ].join(" ").toLowerCase()
            const bannerMatches = matchesSearchQuery(searchableBannerMetadata, query)
            const visibleHeroes = primaryRaw.filter(
                hero => hero && (bannerMatches || matchesBannerHeroQuery(hero, query))
            )
            const featuredHero = banner.featuredHeroId
                ? (heroesById.get(banner.featuredHeroId) ?? null)
                : null
            const featuredHeroMatches = featuredHero
                && (bannerMatches || matchesBannerHeroQuery(featuredHero, query))
            if (featuredHeroMatches && !visibleHeroes.some(hero => hero.id === featuredHero.id)) {
                visibleHeroes.push(featuredHero)
            }
            const visibleConditionalHeroes = conditionalRaw.filter(
                hero => hero && (bannerMatches || matchesBannerHeroQuery(hero, query))
            )

            return {
                banner,
                sourceIndex,
                bannerMatches,
                // Keep the complete known pool for odds; search should only hide cards,
                // not change the probability assigned to the heroes that remain visible.
                allHeroes: primaryRaw.filter(Boolean),
                heroes: visibleHeroes,
                conditionalHeroes: visibleConditionalHeroes,
                missingHeroCount,
            }
        })
            .filter(result =>
                result.bannerMatches || result.heroes.length > 0 || result.conditionalHeroes.length > 0
            )
            .sort((a, b) => {
                // The permanent Everyday Heroes banner always leads the catalogue.
                if (a.banner.id === "everyday_heroes") return b.banner.id === "everyday_heroes" ? 0 : -1
                if (b.banner.id === "everyday_heroes") return 1

                // Once all event banners have dates, sort chronologically (oldest first).
                // Until then preserve the curated source order, including the first special banner.
                if (allDated) {
                    return parseBannerDate(a.banner.lastLiveDate) - parseBannerDate(b.banner.lastLiveDate)
                        || a.sourceIndex - b.sourceIndex
                }
                return a.sourceIndex - b.sourceIndex
            })
    }, [heroesById, query])

    return (
        <div className="banner-catalogue-list">
            <label className="catalogue-search banner-catalogue-search">
                <span className="catalogue-control-label text">Search banners, heroes, and banner details</span>
                <input
                    className="selectable catalogue-input"
                    type="search"
                    aria-label="Search all banner and hero details"
                    placeholder="Search banners, heroes, and details..."
                    value={search}
                    onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)}
                />
                <span className="catalogue-result-count text">
                    Showing {filteredBanners.length} of {BANNERS.length} banners
                </span>
            </label>
            {filteredBanners.length === 0
                ? <p className="catalogue-empty card">No banners match that search.</p>
                : <div className="banner-catalogue-grid">
                    {filteredBanners.map(result => (
                        <BannerCatalogueCard key={result.banner.id} result={result} heroesById={heroesById} />
                    ))}
                </div>
            }
        </div>
    )
}

function CatalogueHero({ heroesRef, initialView = "heroes", onViewChange }) {
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [rarityFilter, setRarityFilter] = useState("all")
    const [attributeFilter, setAttributeFilter] = useState("all")
    const [elementFilter, setElementFilter] = useState("all")
    const [roleFilter, setRoleFilter] = useState("all")

    const catalogueHeroes = useMemo(() => {
        const heroes = Array.isArray(heroesRef) ? heroesRef : []

        return heroes.filter(hero =>
            Number(hero.rarity) >= RARITY_DEFINITIONS.UNCOMMON.id
            && Number(hero.rarity) <= RARITY_DEFINITIONS.LEGENDARY.id
        )
    }, [heroesRef])

    const filteredHeroes = useMemo(() => {
        return catalogueHeroes.filter(hero => {
            const rarity = getEnumNameById(RARITY_DEFINITIONS, Number(hero.rarity)) ?? ""
            const attribute = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? ""
            const element = getEnumNameById(ELEMENT_DEFINITIONS, Number(hero.element)) ?? ""
            const role = getEnumNameById(ROLE_DEFINITIONS, Number(hero.role)) ?? ""
            const searchable = [
                ...getSearchableValues(hero),
                rarity,
                attribute,
                element,
                role,
                hero.name,
                hero.id,
                hero.variant ?? "",
                hero.isStarred ? "starred" : "not starred",
                hero.isStarred ? "true" : "false"
            ].join(" ").toLowerCase()

            const matchesSearch = matchesSearchQuery(searchable, search, term => {
                if (term === "starred") return hero.isStarred === true
                if (term === "not starred") return hero.isStarred !== true
                return undefined
            })

            return matchesSearch
                && (rarityFilter === "all" || String(hero.rarity) === rarityFilter)
                && (attributeFilter === "all" || String(hero.mainAttribute) === attributeFilter)
                && (elementFilter === "all" || String(hero.element) === elementFilter)
                && (roleFilter === "all" || String(hero.role) === roleFilter)
        }).sort((a, b) => String(a.name).localeCompare(String(b.name)))
    }, [catalogueHeroes, search, rarityFilter, attributeFilter, elementFilter, roleFilter])

    const clearFilters = () => {
        setSearch("")
        commitSearch("")
        setRarityFilter("all")
        setAttributeFilter("all")
        setElementFilter("all")
        setRoleFilter("all")
    }

    return (
        <section className="hero-catalogue">
            <div className="catalogue-view-switch" aria-label="Hero catalogue sections">
                <Button text="Heroes" color={5} active={initialView === "heroes"} onClick={() => onViewChange?.("heroes")} />
                <Button text="Banners" color={5} active={initialView === "banners"} onClick={() => onViewChange?.("banners")} />
            </div>
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{initialView === "banners" ? "Banner Catalogue" : "Hero Catalogue"}</div>
                    <p className="catalogue-description text">
                        {initialView === "banners"
                            ? "Browse the banner definitions and their included heroes. Filter by hero name, rarity, element, role, main attribute, and starred status."
                            : "Search heroes, skills, talents, effects, attributes, rarity, element, role, and other stored hero data."}
                    </p>
                </div>
            </header>
            {initialView === "banners" ? (
                <BannerCatalogueList heroesRef={heroesRef} search={search} setSearch={setSearch} commitSearch={commitSearch} />
            ) : (
                <>
            <div className="hero-catalogue-filters card">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">Search heroes ({filteredHeroes.length} of {catalogueHeroes.length} heroes)</span>
                    <input
                        className="selectable catalogue-input"
                        aria-label="Search hero catalogue"
                        placeholder="Name, skill, talent, effect, ID…"
                        value={search}
                        onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)}
                    />
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Rarity</span>
                    <select aria-label="Filter by rarity" value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                        <option value="all">All rarities</option>
                        {HERO_CATALOGUE_RARITIES.map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                    </select>
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Main attribute</span>
                    <select aria-label="Filter by main attribute" value={attributeFilter} onChange={event => setAttributeFilter(event.target.value)}>
                        <option value="all">All attributes</option>
                        {Object.values(ATTRIBUTE_DEFINITIONS).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                    </select>
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Element</span>
                    <select aria-label="Filter by element" value={elementFilter} onChange={event => setElementFilter(event.target.value)}>
                        <option value="all">All elements</option>
                        {Object.values(ELEMENT_DEFINITIONS).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                    </select>
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Role</span>
                    <select aria-label="Filter by role" value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                        <option value="all">All roles</option>
                        {Object.values(ROLE_DEFINITIONS).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                    </select>
                </label>
                <div className="catalogue-filter-actions">
                    <Button text="Clear filters" color={"cancel"} onClick={clearFilters} />
                </div>
            </div>

            {filteredHeroes.length === 0
                ? <p className="catalogue-empty card">No heroes match these filters.</p>
                : <div className="hero-catalogue-grid">
                    {filteredHeroes.map(hero => <HeroCatalogueCard key={hero.id} hero={hero} />)}
                </div>
            }
                </>
            )}
        </section>
    )
}

export default CatalogueHero
