import { useEffect, useMemo, useState } from "react"
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
import { getSearchableValues, matchesSearchQuery, useUrlSearch } from "../js/search.jsx"
import { humanize } from "../js/util.jsx"
import BannerCatalogueList from "./BannerCatalogueList.jsx"
import CatalogueViewSwitch from "./CatalogueViewSwitch.jsx"
import SkillCatalogueCard from "./SkillCatalogueCard.jsx"
import TalentCatalogueCard from "./TalentCatalogueCard.jsx"
import "../css/infos_heroes.scss"

const HERO_CATALOGUE_RARITIES = Object.values(RARITY_DEFINITIONS).filter(
    rarity => rarity.id >= RARITY_DEFINITIONS.UNCOMMON.id && rarity.id <= RARITY_DEFINITIONS.LEGENDARY.id
)

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
                    <div className="hero-catalogue-name text" data-rarity={hero.rarity}>{hero.name}</div>
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
                <details className="hero-catalogue-section hero-catalogue-collapsible card">
                    <summary className="catalogue-section-label text">Skills</summary>
                    <div className="hero-catalogue-skills">
                        {skills.map((skill, index) => (
                            <SkillCatalogueCard key={hero.id + "-skill-" + index} hero={hero} skill={skill} skillIndex={index} />
                        ))}
                    </div>
                </details>
            )}

            {talents.length > 0 && (
                <details className="hero-catalogue-section hero-catalogue-collapsible card">
                    <summary className="catalogue-section-label text">Talents</summary>
                    <div className="hero-catalogue-talents">
                        {talents.map(([id, talent]) => (
                            <TalentCatalogueCard key={hero.id + "-talent-" + id} talent={talent} sources={[{ hero, id }]} />
                        ))}
                    </div>
                </details>
            )}
        </article>
    )
}


function CatalogueHero({ heroesRef, initialView = "heroes", initialFilter = null, onViewChange }) {
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [rarityFilter, setRarityFilter] = useState("all")
    const [attributeFilter, setAttributeFilter] = useState("all")
    const [elementFilter, setElementFilter] = useState("all")
    const [roleFilter, setRoleFilter] = useState("all")

    useEffect(() => {
        if (!initialFilter) return
        if (initialFilter.rarity !== undefined) setRarityFilter(String(initialFilter.rarity))
        if (initialFilter.attribute !== undefined) setAttributeFilter(String(initialFilter.attribute))
        if (initialFilter.element !== undefined) setElementFilter(String(initialFilter.element))
        if (initialFilter.role !== undefined) setRoleFilter(String(initialFilter.role))
    }, [initialFilter])

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
            <CatalogueViewSwitch ariaLabel="Hero catalogue sections" view={initialView} onViewChange={onViewChange} options={[
                { label: "Heroes", value: "heroes" },
                { label: "Tier List", value: "tier-list" },
                { label: "Banners", value: "banners" },
            ]} />
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{initialView === "banners" ? "Banner Catalogue" : initialView === "tier-list" ? "Hero Tier List" : "Hero Catalogue"}</div>
                    <p className="catalogue-description text">
                        {initialView === "banners"
                            ? "Browse the banner definitions and their included heroes. Filter by hero name, rarity, element, role, main attribute, and starred status."
                            : initialView === "tier-list"
                                ? "Tier List view. Tier placements are not currently defined in the project data."
                                : "Search heroes, skills, talents, effects, attributes, rarity, element, role, and other stored hero data."}
                    </p>
                </div>
            </header>
            {initialView === "tier-list" ? (
                <div className="catalogue-empty card">No tier placements have been defined yet.</div>
            ) : initialView === "banners" ? (
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
