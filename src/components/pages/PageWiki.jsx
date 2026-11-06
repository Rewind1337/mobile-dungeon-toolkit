import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { useDynamicList } from "../../hooks/useDynamicList.jsx"
import Button from "../Button.jsx"
import { useTranslate } from "../../hooks/useTranslate.jsx"

import BackToTopButton from "../BackToTopButton.jsx"
import "../../css/infos.scss"
import "../../css/infos_overview.scss"
import "../../css/hero.scss"
import { ATTRIBUTE_DEFINITIONS, ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, RARITY_DEFINITIONS, PERK_DEFINITIONS, STATUS_EFFECT_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, DROP_SOURCE_DEFINITIONS, PRIMARY_STAT_DEFINITIONS } from "../../database/enums.jsx"
import { init_banner_db } from "../../database/db_banners.jsx"
import { init_resource_db } from "../../database/db_resources.jsx"
import { attributeSprites, elementSprites, roleSprites, perkSprites, iconSprites } from "../../database/db_sprites.jsx"

const CatalogueItem = lazy(() => import("../catalogue/CatalogueItem.jsx"))
const CatalogueHero = lazy(() => import("../catalogue/CatalogueHero.jsx"))
const CatalogueResources = lazy(() => import("../catalogue/CatalogueResources.jsx"))
const CatalogueStatus = lazy(() => import("../catalogue/CatalogueStatus.jsx"))
const CatalogueSkillsTalents = lazy(() => import("../catalogue/CatalogueSkillsTalents.jsx"))
const CataloguePerk = lazy(() => import("../catalogue/CataloguePerk.jsx"))

const EMPTY_ITEM_DATA = {}
const BANNER_DATA = init_banner_db()
const RESOURCE_DATA = init_resource_db()
const RESOURCE_COUNT = RESOURCE_DATA.filter(resource => !resource.isGem).length
const GEM_TYPE_COUNT = new Set(RESOURCE_DATA.filter(resource => resource.isGem).map(resource => resource.gemType)).size
const TABS = [
    ["hero-catalogue", "app.pages.wiki.heroesAndBanners"],
    ["item-catalogue", "app.pages.wiki.itemsAndSets"],
    ["perk-catalogue", "app.pages.catalogues.perkTitle", "app.shared.perks"],
    ["skills-talents-catalogue", "app.shared.skillsAndTalents"],
    ["status-catalogue", "app.pages.wiki.statusCatalogue", "app.pages.wiki.statuses"],
    ["resources-catalogue", "app.pages.wiki.resourcesAndGems"],
]

const humanize = value => String(value ?? "").replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase())

function Stat({ label, value }) {
    return (
        <div className="catalogue-overview-stat card">
            <span className="text">{label}</span>
            <span className="header-big">{value}</span>
        </div>
    )
}

function InfoOverview({ items, sets, heroes, onNavigate }) {
    const t = useTranslate()
    const itemCount = Array.isArray(items) ? items.length : Object.values(items).reduce((total, list) => total + (Array.isArray(list) ? list.length : 0), 0)
    const heroCountBy = (key, definitions, preferredOrder = []) => {
        const counts = new Map()
        for (const hero of heroes) {
            const id = Number(hero[key])
            const definition = Object.values(definitions).find(entry => entry.id === id)
            const label = humanize(definition?.name ?? "unknown")
            const count = counts.get(label) ?? { label, id, count: 0 }
            count.count += 1
            counts.set(label, count)
        }
        const order = new Map(preferredOrder.map((label, index) => [label.toLowerCase(), index]))
        return [...counts.values()].sort((a, b) => {
            const aOrder = order.get(a.label.toLowerCase())
            const bOrder = order.get(b.label.toLowerCase())
            if (aOrder !== undefined || bOrder !== undefined) {
                if (aOrder === undefined) return 1
                if (bOrder === undefined) return -1
                if (aOrder !== bOrder) return aOrder - bOrder
            }
            return a.label.localeCompare(b.label)
        })
    }
    const itemCountBy = (key, definitions) => {
        const counts = new Map()
        for (const item of items) {
            const id = Number(item[key])
            const definition = Object.values(definitions).find(entry => entry.id === id)
            const label = humanize(definition?.name ?? "unknown")
            const current = counts.get(label) ?? { label, id, count: 0 }
            current.count += 1
            counts.set(label, current)
        }
        return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label))
    }
    const guildHuntCount = items.filter(item => Number(item.dropSource) === DROP_SOURCE_DEFINITIONS.GUILD_HUNT.id).length
    const dungeonDropCount = items.length - guildHuntCount

    const skillCount = heroes.reduce((total, hero) => total + (Array.isArray(hero.skills) ? hero.skills.length : 0), 0)
    const talentCount = heroes.reduce((total, hero) => total + (hero.talents && typeof hero.talents === "object" ? Object.keys(hero.talents).length : 0), 0)
    const rows = (values, iconType, onSelect) => values.map(({ label, count, id }) => {
        const iconSrc = iconType === "element"
            ? elementSprites[id]
            : iconType === "role"
                ? roleSprites[id]
                : iconType === "attribute"
                    ? attributeSprites[id]
                    : iconType === "primary-stat"
                        ? perkSprites[({ 0: "ATTACK_FLAT", 1: "DEFENCE_FLAT", 2: "AGILITY_FLAT" })[Number(id)]]
                        : iconType === "slot"
                            ? iconSprites[({ 0: "weapons", 1: "helmets", 2: "armors", 3: "necklaces", 4: "rings" })[Number(id)]]
                            : null
        const isClickable = typeof onSelect === "function" && Number.isFinite(Number(id))
        const activateWithKeyboard = event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(id)
            }
        }

        return (
            <div
                className="catalogue-overview-slot card"
                key={label}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                
                title={isClickable ? t("app.pages.wiki.showEntriesTooltip", { label }) : undefined}
                onClick={isClickable ? () => onSelect(id) : undefined}
                onKeyDown={isClickable ? activateWithKeyboard : undefined}
            >
                {iconType === "rarity" ? (
                    <span className="catalogue-overview-slot-icon catalogue-overview-rarity-icon" data-rarity={id} aria-hidden="true" />
                ) : typeof iconSrc === "string" ? (
                    <img className="catalogue-overview-slot-icon" src={iconSrc} alt="" loading="lazy" decoding="async" draggable={false} />
                ) : (
                    <span className="catalogue-overview-slot-icon catalogue-overview-slot-icon-fallback" aria-hidden="true">◆</span>
                )}
                <span className="text">{label}</span>
                <span className="header">{count}</span>
            </div>
        )
    })

    return (
        <section className="info-overview">
            <header className="catalogue-header info-overview-heading">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{t("app.navigation.wiki")}</div>
                    <p className="catalogue-description text">
                        {t("app.pages.wiki.description")}
                    </p>
                </div>
            </header>

            <section className="info-overview-section card card-static">
                <div className="info-overview-section-heading">
                    <h2 className="header">{t("app.pages.wiki.dataOverview")}</h2>
                    <p className="text">{t("app.pages.wiki.dataDistribution")}</p>
                </div>
                <section className="info-overview-breakdown-card info-overview-data-card card card-static">
                    <div className="catalogue-overview-stats">
                        <Stat label="Items" value={itemCount} />
                        <Stat label="Item sets" value={sets.length} />
                        <Stat label="Heroes" value={heroes.length} />
                        <Stat label="Banners" value={BANNER_DATA.length} />
                        <Stat label="Skills" value={skillCount} />
                        <Stat label="Talent entries" value={talentCount} />
                        <Stat label="Perks" value={Object.keys(PERK_DEFINITIONS).length} />
                        <Stat label="Status Effects" value={Object.keys(STATUS_EFFECT_DEFINITIONS).length} />
                        <Stat label="Resources" value={RESOURCE_COUNT} />
                        <Stat label="Gem types" value={GEM_TYPE_COUNT} />
                    </div>
                </section>
            </section>

            <section className="info-overview-section card card-static">
                <div className="info-overview-section-heading">
                    <h2 className="header">{t("app.pages.wiki.heroOverview")}</h2>
                    <p className="text">{t("app.pages.wiki.heroDistribution")}</p>
                </div>
                <div className="info-overview-breakdown info-overview-hero-breakdown">
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.byElement")}</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("element", ELEMENT_DEFINITIONS, ["Fire", "Water", "Nature", "Light", "Shadow"]), "element", id => onNavigate?.("hero-catalogue", { element: id }))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.byRarity")}</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("rarity", RARITY_DEFINITIONS, ["Uncommon", "Rare", "Epic", "Legendary"]), "rarity", id => onNavigate?.("hero-catalogue", { rarity: id }))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.byRole")}</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("role", ROLE_DEFINITIONS), "role", id => onNavigate?.("hero-catalogue", { role: id }))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.byMainAttribute")}</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("mainAttribute", ATTRIBUTE_DEFINITIONS), "attribute", id => onNavigate?.("hero-catalogue", { attribute: id }))}</div>
                    </section>
                </div>
            </section>

            <section className="info-overview-section card card-static">
                <div className="info-overview-section-heading">
                    <h2 className="header">{t("app.pages.wiki.itemOverview")}</h2>
                    <p className="text">{t("app.pages.wiki.itemDistribution")}</p>
                </div>
                <div className="info-overview-breakdown info-overview-item-breakdown">
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.bySlot")}</h3>
                        <div className="catalogue-overview-slot-list">{rows(itemCountBy("slot", EQUIPMENT_SLOT_DEFINITIONS), "slot", id => onNavigate?.("item-catalogue", { slot: id }))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.byMainAttribute")}</h3>
                        <div className="catalogue-overview-slot-list">{rows(itemCountBy("mainAttribute", PRIMARY_STAT_DEFINITIONS), "primary-stat", id => onNavigate?.("item-catalogue", { attribute: id }))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card card-static">
                        <h3 className="header">{t("app.pages.wiki.byDropSource")}</h3>
                        <div className="catalogue-overview-slot-list">
                            <div className="catalogue-overview-slot card"><span className="text">{t("app.pages.wiki.dungeonDrops")}</span><span className="header">{dungeonDropCount}</span></div>
                            <div className="catalogue-overview-slot card"><span className="text">{t("app.pages.wiki.guildHuntDrops")}</span><span className="header">{guildHuntCount}</span></div>
                        </div>
                        <p className="catalogue-muted text">{t("app.pages.wiki.dungeonDropNote")}</p>
                    </section>
                </div>

            </section>

            <p className="catalogue-muted text">{t("app.pages.wiki.dataCountNote")}</p>

        </section>
    )
}

function PageWiki({ itemsRef, heroesRef, activeTab = "overview", onTabChange }) {
    const t = useTranslate()
    const [overviewFilter, setOverviewFilter] = useState(null)
    const setActiveTab = tab => {
        setOverviewFilter(null)
        onTabChange?.(tab)
    }
    const navigateFromOverview = (tab, filter) => {
        setOverviewFilter({ tab, ...filter })
        onTabChange?.(tab)
    }
    const { listRef, events } = useDynamicList(0)
    const itemData = itemsRef?.current?.BASE_ITEMS ?? EMPTY_ITEM_DATA
    const sets = itemsRef?.current?.ITEM_SETS ?? []
    const heroes = heroesRef?.current ?? []
    const items = useMemo(() => Object.values(itemData).flatMap(value => Array.isArray(value) ? value : []), [itemData])
    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = 0
    }, [activeTab, listRef])

    return <div id="page-info-layout">
        <div className="sub-nav-bar flex-row" style={{ flex: "0 0 auto" }}>
            <div className="pagination flex-row card w-100">
                {TABS.map(([id, labelKey, compactKey]) => <Button key={id} text={compactKey
                    ? <><span className="catalogue-view-label-full">{t(labelKey)}</span><span className="catalogue-view-label-compact">{t(compactKey)}</span></>
                    : t(labelKey)} color={5} active={id === "item-catalogue" ? activeTab === "item-catalogue" || activeTab === "set-catalogue" : id === "hero-catalogue" ? activeTab === "hero-catalogue" || activeTab === "hero-tier-list-catalogue" || activeTab === "hero-banners-catalogue" : id === "resources-catalogue" ? activeTab === "resources-catalogue" || activeTab === "gems-catalogue" : id === "skills-talents-catalogue" ? activeTab === "skills-talents-catalogue" || activeTab === "skills-catalogue" || activeTab === "talents-catalogue" : activeTab === id} onClick={() => setActiveTab(id)} />)}
            </div>
        </div>
        <div id="page-info" className="page card w-100" ref={listRef} {...events} style={{ display:"flex", flexDirection:"column", alignItems:"stretch", flex:"1 1 0", minHeight:0, minWidth:0, overflowY:"auto", overflowX:"hidden", alignContent:"start" }}>
            {activeTab === "overview" && <InfoOverview items={items} sets={sets} heroes={heroes} onNavigate={navigateFromOverview} />}
            <Suspense fallback={<div className="card">{t("app.pages.wiki.loadingCatalogue")}</div>}>
                {activeTab === "item-catalogue" && <CatalogueItem itemsRef={itemData} setsRef={sets} scrollElementRef={listRef} initialFilter={overviewFilter?.tab === "item-catalogue" ? overviewFilter : null} onViewChange={view => setActiveTab(view === "sets" ? "set-catalogue" : "item-catalogue")} />}
                {activeTab === "set-catalogue" && <CatalogueItem itemsRef={itemData} setsRef={sets} scrollElementRef={listRef} initialView="sets" onViewChange={view => setActiveTab(view === "sets" ? "set-catalogue" : "item-catalogue")} />}
                {activeTab === "perk-catalogue" && <CataloguePerk items={items} sets={sets} />}
                {(activeTab === "hero-catalogue" || activeTab === "hero-tier-list-catalogue" || activeTab === "hero-banners-catalogue") && <CatalogueHero heroesRef={heroes} scrollElementRef={listRef} initialFilter={overviewFilter?.tab === "hero-catalogue" ? overviewFilter : null} initialView={activeTab === "hero-tier-list-catalogue" ? "tier-list" : activeTab === "hero-banners-catalogue" ? "banners" : "heroes"} onViewChange={view => setActiveTab(view === "tier-list" ? "hero-tier-list-catalogue" : view === "banners" ? "hero-banners-catalogue" : "hero-catalogue")} />}
                {(activeTab === "resources-catalogue" || activeTab === "gems-catalogue") && <CatalogueResources initialView={activeTab === "gems-catalogue" ? "gems" : "resources"} onViewChange={view => setActiveTab(view === "gems" ? "gems-catalogue" : "resources-catalogue")} />}
                {(activeTab === "skills-catalogue" || activeTab === "talents-catalogue") && <CatalogueSkillsTalents heroes={heroes} initialView={activeTab === "talents-catalogue" ? "talents" : "skills"} onViewChange={view => setActiveTab(view === "talents" ? "talents-catalogue" : "skills-catalogue")} />}
                {activeTab === "skills-talents-catalogue" && <CatalogueSkillsTalents heroes={heroes} initialView="skills" onViewChange={view => setActiveTab(view === "talents" ? "talents-catalogue" : "skills-catalogue")} />}
                {activeTab === "status-catalogue" && <CatalogueStatus />}
            </Suspense>
        </div>
        <BackToTopButton scrollRef={listRef} />
    </div>
}
export default PageWiki
