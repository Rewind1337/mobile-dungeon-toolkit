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
import { attributeSprites, roleSprites } from "../database/db_sprites.jsx"

const HERO_CATALOGUE_RARITIES = Object.values(RARITY_DEFINITIONS).filter(
    rarity => rarity.id >= RARITY_DEFINITIONS.UNCOMMON.id && rarity.id <= RARITY_DEFINITIONS.LEGENDARY.id
)

const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return [String(value)]
    if (typeof value !== "object" || seen.has(value)) return []
    seen.add(value)
    return Object.values(value).flatMap(child => getSearchableValues(child, seen))
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

function CatalogueHero({ heroesRef, initialView = "heroes", onViewChange }) {
    const [search, setSearch] = useState("")
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
        const query = search.trim().toLowerCase()
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

            const matchesSearch = !query || (query === "starred" ? hero.isStarred === true : searchable.includes(query))

            return matchesSearch
                && (rarityFilter === "all" || String(hero.rarity) === rarityFilter)
                && (attributeFilter === "all" || String(hero.mainAttribute) === attributeFilter)
                && (elementFilter === "all" || String(hero.element) === elementFilter)
                && (roleFilter === "all" || String(hero.role) === roleFilter)
        }).sort((a, b) => String(a.name).localeCompare(String(b.name)))
    }, [catalogueHeroes, search, rarityFilter, attributeFilter, elementFilter, roleFilter])

    const clearFilters = () => {
        setSearch("")
        setRarityFilter("all")
        setAttributeFilter("all")
        setElementFilter("all")
        setRoleFilter("all")
    }

    return (
        <section className="hero-catalogue">
            <div className="catalogue-view-switch" aria-label="Hero catalogue sections">
                <Button text="Heroes" color={5} active={initialView === "heroes"} onClick={() => onViewChange?.("heroes")} />
                <Button disabled text="Banners" color={5} active={initialView === "banners"} onClick={() => onViewChange?.("banners")} />
            </div>
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{initialView === "banners" ? "Banner Catalogue" : "Hero Catalogue"}</div>
                    <p className="catalogue-description text">
                        {initialView === "banners"
                            ? "The banner catalogue will be available here when banner data is added to the toolkit."
                            : "Search heroes, skills, talents, effects, attributes, rarity, element, role, and other stored hero data."}
                    </p>
                </div>
            </header>
            {initialView === "banners" ? null : <>
            <div className="hero-catalogue-filters card">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">Search heroes ({filteredHeroes.length} of {catalogueHeroes.length} heroes)</span>
                    <input
                        className="selectable catalogue-input"
                        aria-label="Search hero catalogue"
                        placeholder="Name, skill, talent, effect, ID…"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
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
            </>}
        </section>
    )
}

export default CatalogueHero
