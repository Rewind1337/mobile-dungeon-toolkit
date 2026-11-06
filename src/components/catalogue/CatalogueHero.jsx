import { useEffect, useMemo, useState } from "react"
import {
    ATTRIBUTE_DEFINITIONS,
    ELEMENT_DEFINITIONS,
    RARITY_DEFINITIONS,
    ROLE_DEFINITIONS,
    getEnumNameById
} from "../../database/enums.jsx"
import Hero from "../Hero.jsx"
import { useContentTranslation } from "../../hooks/useContentTranslation.jsx"
import HeroCatalogueFilters from "../HeroCatalogueFilters.jsx"
import { attributeSprites, elementSprites, roleSprites } from "../../database/db_sprites.jsx"
import { getSearchableValues, matchesSearchQuery, useUrlSearch } from "../../js/search.jsx"
import { humanize } from "../../js/utils.js"
import { useTranslate } from "../../hooks/useTranslate.jsx"
import BannerCatalogueList from "../BannerCatalogueList.jsx"
import CatalogueViewSwitch from "../CatalogueViewSwitch.jsx"
import SkillCatalogueCard from "../SkillCatalogueCard.jsx"
import TalentCatalogueCard from "../TalentCatalogueCard.jsx"
import VirtualizedGrid from "../VirtualizedGrid.jsx"
import "../../css/infos_heroes.scss"

function HeroCatalogueCard({ hero, expandedSections = {}, onSectionToggle }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const rarity = getEnumNameById(RARITY_DEFINITIONS, Number(hero.rarity)) ?? "Unknown rarity"
    const attribute = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? "Unknown attribute"
    const element = getEnumNameById(ELEMENT_DEFINITIONS, Number(hero.element)) ?? "Unknown element"
    const role = getEnumNameById(ROLE_DEFINITIONS, Number(hero.role)) ?? "Unknown role"
    const rarityLabel = tc("rarity", rarity, "name", humanize(rarity))
    const attributeLabel = tc("attribute", attribute, "name", humanize(attribute))
    const elementLabel = tc("element", element, "name", humanize(element))
    const roleLabel = tc("role", role, "name", humanize(role))

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
                    <div className="hero-catalogue-name text" data-rarity={hero.rarity}>{tc("hero", hero.id, "name", hero.name)}</div>
                    <div className="hero-catalogue-meta-row">
                        <span className="catalogue-chip catalogue-chip-rarity text" data-rarity={hero.rarity}>{rarityLabel}</span>
                        <span className={`catalogue-chip text catalogue-chip-element-outline catalogue-chip-element-${String(element).toLowerCase()}`}>
                            {elementSprites[Number(hero.element)] && <img className="catalogue-chip-icon" src={elementSprites[Number(hero.element)]} alt="" />}
                            {elementLabel}
                        </span>
                        <span className={`catalogue-chip catalogue-chip-attribute catalogue-chip-attribute-${String(attribute).toLowerCase()} text`}>
                            {typeof attributeSprites[Number(hero.mainAttribute)] === "string" && <img className="catalogue-chip-icon" src={attributeSprites[Number(hero.mainAttribute)]} alt="" />}
                            {attributeLabel}
                        </span>
                        <span className={`catalogue-chip catalogue-chip-role hero-catalogue-role-chip catalogue-chip-role-${String(role).toLowerCase()} text`}>
                            <img className="catalogue-chip-icon" src={roleSprites[Number(hero.role)]} alt="" />
                            {roleLabel}
                        </span>
                    </div>
                    {hero.variant && <p className="hero-catalogue-variant text">{t("app.pages.catalogues.variant", { name: hero.variant })}</p>}
                </div>
            </header>

            {skills.length > 0 && (
                <details
                    className="hero-catalogue-section hero-catalogue-collapsible card"
                    open={Boolean(expandedSections.skills)}
                    onToggle={event => onSectionToggle?.(hero.id, "skills", event.currentTarget.open)}
                >
                    <summary className="catalogue-section-label text">{t("app.pages.heroes.preview.skills")}</summary>
                    <div className="hero-catalogue-skills">
                        {skills.map((skill, index) => (
                            <SkillCatalogueCard key={hero.id + "-skill-" + index} hero={hero} skill={skill} skillIndex={index} />
                        ))}
                    </div>
                </details>
            )}

            {talents.length > 0 && (
                <details
                    className="hero-catalogue-section hero-catalogue-collapsible card"
                    open={Boolean(expandedSections.talents)}
                    onToggle={event => onSectionToggle?.(hero.id, "talents", event.currentTarget.open)}
                >
                    <summary className="catalogue-section-label text">{t("app.pages.heroes.preview.talents")}</summary>
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


function CatalogueHero({ heroesRef, initialView = "heroes", initialFilter = null, onViewChange, scrollElementRef }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [expandedHeroSections, setExpandedHeroSections] = useState({})
    const handleHeroSectionToggle = (heroId, section, isOpen) => {
        setExpandedHeroSections(previous => ({
            ...previous,
            [heroId]: { ...previous[heroId], [section]: isOpen }
        }))
    }
    const [rarityFilter, setRarityFilter] = useState("all")
    const [attributeFilter, setAttributeFilter] = useState("all")
    const [elementFilter, setElementFilter] = useState("all")
    const [roleFilter, setRoleFilter] = useState("all")
    const [starredOnly, setStarredOnly] = useState(false)
    const [filtersVisible, setFiltersVisible] = useState(true)

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
                tc("hero", hero.id, "name", hero.name),
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
                && (!starredOnly || hero.isStarred === true)
        }).sort((a, b) => String(a.name).localeCompare(String(b.name)))
    }, [catalogueHeroes, search, rarityFilter, attributeFilter, elementFilter, roleFilter, starredOnly, tc])

    const clearFilters = () => {
        setSearch("")
        commitSearch("")
        setRarityFilter("all")
        setAttributeFilter("all")
        setElementFilter("all")
        setRoleFilter("all")
        setStarredOnly(false)
    }

    return (
        <section className="hero-catalogue">
            <CatalogueViewSwitch ariaLabel={t("app.pages.catalogues.heroViews")} view={initialView} onViewChange={onViewChange} options={[
                { label: t("app.pages.catalogues.heroTitle"), compactLabel: t("app.navigation.heroes"), value: "heroes" },
                { label: t("app.pages.catalogues.tierList"), value: "tier-list" },
                { label: t("app.pages.catalogues.bannerTitle"), compactLabel: t("app.pages.catalogues.banners"), value: "banners" },
            ]} />
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{initialView === "banners" ? t("app.pages.catalogues.bannerTitle") : initialView === "tier-list" ? t("app.pages.catalogues.heroTierListTitle") : t("app.pages.catalogues.heroTitle")}</div>
                    <p className="catalogue-description text">
                        {initialView === "banners"
                            ? t("app.pages.catalogues.bannerDescription")
                            : initialView === "tier-list"
                                ? t("app.pages.catalogues.tierListDescription")
                                : t("app.pages.catalogues.heroDescription")}
                    </p>
                </div>
            </header>
            {initialView === "tier-list" ? (
                <div className="catalogue-empty card">{t("app.pages.catalogues.noTierPlacements")}</div>
            ) : initialView === "banners" ? (
                <BannerCatalogueList heroesRef={heroesRef} search={search} setSearch={setSearch} commitSearch={commitSearch} />
            ) : (
                <>
            <HeroCatalogueFilters
                search={search}
                setSearch={setSearch}
                onSearchBlur={() => commitSearch(search)}
                rarityFilter={rarityFilter}
                setRarityFilter={setRarityFilter}
                attributeFilter={attributeFilter}
                setAttributeFilter={setAttributeFilter}
                elementFilter={elementFilter}
                setElementFilter={setElementFilter}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                starredOnly={starredOnly}
                setStarredOnly={setStarredOnly}
                resultCount={filteredHeroes.length}
                totalCount={catalogueHeroes.length}
                clearFilters={clearFilters}
                filtersVisible={filtersVisible}
                onHideFilters={() => setFiltersVisible(false)}
                onShowFilters={() => setFiltersVisible(true)}
            />

            {filteredHeroes.length === 0
                ? <p className="catalogue-empty card">{t("app.pages.catalogues.noHeroesMatch")}</p>
                : <VirtualizedGrid
                    items={filteredHeroes}
                    scrollElementRef={scrollElementRef}
                    minColumnWidth={340}
                    maxColumns={3}
                    estimatedRowHeight={240}
                    rowGap={10}
                    columnGap={10}
                    className="hero-catalogue-grid-spacer"
                    rowClassName="hero-catalogue-grid-row"
                    renderItem={hero => (
                        <HeroCatalogueCard
                            hero={hero}
                            expandedSections={expandedHeroSections[hero.id]}
                            onSectionToggle={handleHeroSectionToggle}
                        />
                    )}
                />
            }
                </>
            )}
        </section>
    )
}

export default CatalogueHero
