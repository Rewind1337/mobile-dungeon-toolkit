import { lazy, Suspense, useEffect, useMemo } from "react"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import Button from "./Button.jsx"

import BackToTopButton from "./BackToTopButton.jsx"
import "../css/other.scss"
import "../css/hero.scss"
import { ATTRIBUTE_DEFINITIONS, ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, RARITY_DEFINITIONS, PERK_DEFINITIONS, STATUS_EFFECT_DEFINITIONS } from "../database/enums.jsx"
import { init_banner_db } from "../database/db_banners.jsx"
import { init_resource_db } from "../database/db_resources.jsx"

const CatalogueItem = lazy(() => import("./CatalogueItem.jsx"))
const CatalogueHero = lazy(() => import("./CatalogueHero.jsx"))
const CatalogueResources = lazy(() => import("./CatalogueResources.jsx"))
const CatalogueStatus = lazy(() => import("./CatalogueStatus.jsx"))
const CatalogueSkillsTalents = lazy(() => import("./CatalogueSkillsTalents.jsx"))
const CataloguePerk = lazy(() => import("./CataloguePerk.jsx"))

const EMPTY_ITEM_DATA = {}
const BANNER_DATA = init_banner_db()
const RESOURCE_DATA = init_resource_db()
const GEM_RESOURCE_IDS = new Set(["ruby", "sapphire", "emerald", "diamond"])
const RESOURCE_COUNT = RESOURCE_DATA.filter(resource => !GEM_RESOURCE_IDS.has(resource.id)).length
const GEM_TYPE_COUNT = RESOURCE_DATA.filter(resource => GEM_RESOURCE_IDS.has(resource.id)).length
const TABS = [
    ["hero-catalogue", "Hero Catalogue"],
    ["item-catalogue", "Items & Sets"],
    ["perk-catalogue", "Perk Catalogue"],
    ["skills-talents-catalogue", "Skills & Talents"],
    ["status-catalogue", "Status Catalogue"],
    ["resources-catalogue", "Resources"],
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

function OverviewLink({ title, description, buttonText, onClick }) {
    return (
        <article className="catalogue-overview-link card">
            <div className="catalogue-overview-link-copy">
                <h3 className="header">{title}</h3>
                <p className="text">{description}</p>
            </div>
            <Button text={buttonText} color={5} onClick={onClick} />
        </article>
    )
}

function InfoOverview({ items, sets, heroes, onNavigate }) {
    const itemCount = Array.isArray(items) ? items.length : Object.values(items).reduce((total, list) => total + (Array.isArray(list) ? list.length : 0), 0)
    const heroCountBy = (key, definitions) => heroes.reduce((counts, hero) => {
        const value = Object.values(definitions).find(entry => entry.id === Number(hero[key]))
        const label = humanize(value?.name ?? "unknown")
        counts[label] = (counts[label] ?? 0) + 1
        return counts
    }, {})
    const skillCount = heroes.reduce((total, hero) => total + (Array.isArray(hero.skills) ? hero.skills.length : 0), 0)
    const talentCount = heroes.reduce((total, hero) => total + (hero.talents && typeof hero.talents === "object" ? Object.keys(hero.talents).length : 0), 0)
    const rows = values => Object.entries(values).sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => (
        <div className="catalogue-overview-slot card" key={name}>
            <span className="text">{name}</span>
            <span className="header">{count}</span>
        </div>
    ))

    return (
        <section className="info-overview">
            <header className="info-overview-hero card">
                <div className="info-overview-eyebrow text">Mobile Dungeon Toolkit</div>
                <h1 className="catalogue-title header-big">Your data hub</h1>
                <p className="catalogue-description text">
                    Explore the heroes, banners, equipment, gems, resources, perks, skills, talents, and status effects tracked by the toolkit.
                    Choose a collection below to jump straight into its catalogue.
                </p>
            </header>

            <div className="catalogue-overview-stats">
                <Stat label="Items" value={itemCount} />
                <Stat label="Item sets" value={sets.length} />
                <Stat label="Heroes" value={heroes.length} />
                <Stat label="Banners" value={BANNER_DATA.length} />
                <Stat label="Skills" value={skillCount} />
                <Stat label="Talent entries" value={talentCount} />
                <Stat label="Perks" value={Object.keys(PERK_DEFINITIONS).length} />
                <Stat label="Status effects" value={Object.keys(STATUS_EFFECT_DEFINITIONS).length} />
                <Stat label="Resources" value={RESOURCE_COUNT} />
                <Stat label="Gem types" value={GEM_TYPE_COUNT} />
            </div>

            <section className="info-overview-section">
                <div className="info-overview-section-heading">
                    <h2 className="header">Browse catalogues</h2>
                    <p className="text">Each section has its own search and browsing tools.</p>
                </div>
                <div className="catalogue-overview-links">
                    <OverviewLink title="Heroes" description="Browse hero portraits, rarities, elements, roles, attributes, skills, and talents." buttonText="Browse heroes" onClick={() => onNavigate("hero-catalogue")} />
                    <OverviewLink title="Banners" description="Explore banner definitions and their featured, legendary, epic, and conditional heroes." buttonText="Browse banners" onClick={() => onNavigate("hero-banners-catalogue")} />
                    <OverviewLink title="Items" description="Search equipment, item details, rarity, perks, and drop locations." buttonText="Browse items" onClick={() => onNavigate("item-catalogue")} />
                    <OverviewLink title="Sets" description="Review item sets, their bonuses, and the pieces that belong to each set." buttonText="Browse sets" onClick={() => onNavigate("set-catalogue")} />
                    <OverviewLink title="Perks" description="Look up perk effects and the gear pieces that can roll each perk." buttonText="Browse perks" onClick={() => onNavigate("perk-catalogue")} />
                    <OverviewLink title="Skills & Talents" description="Search skill descriptions and talent effects across the hero roster." buttonText="Browse skills" onClick={() => onNavigate("skills-talents-catalogue")} />
                    <OverviewLink title="Status Effects" description="Review effects, polarity, removability, and mitigation information." buttonText="Browse statuses" onClick={() => onNavigate("status-catalogue")} />
                    <OverviewLink title="Resources" description="Find resource names and descriptions, excluding gems." buttonText="Browse resources" onClick={() => onNavigate("resources-catalogue")} />
                    <OverviewLink title="Gems" description="Browse every defined rarity of ruby, sapphire, emerald, and diamond, grouped by gem type." buttonText="Browse gems" onClick={() => onNavigate("gems-catalogue")} />
                </div>
            </section>

            <section className="info-overview-section">
                <div className="info-overview-section-heading">
                    <h2 className="header">Hero roster at a glance</h2>
                    <p className="text">Distribution of the currently loaded hero data.</p>
                </div>
                <div className="info-overview-breakdown">
                    <section className="info-overview-breakdown-card card">
                        <h3 className="header">By element</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("element", ELEMENT_DEFINITIONS))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card">
                        <h3 className="header">By role</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("role", ROLE_DEFINITIONS))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card">
                        <h3 className="header">By rarity</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("rarity", RARITY_DEFINITIONS))}</div>
                    </section>
                    <section className="info-overview-breakdown-card card">
                        <h3 className="header">By main attribute</h3>
                        <div className="catalogue-overview-slot-list">{rows(heroCountBy("mainAttribute", ATTRIBUTE_DEFINITIONS))}</div>
                    </section>
                </div>
            </section>
            <p className="catalogue-muted text">Counts reflect the data currently loaded in the project. Skills and talent entries are counted per hero, so repeated names are included.</p>
        </section>
    )
}

function PageInfos({ itemsRef, heroesRef, activeTab = "overview", onTabChange }) {
    const setActiveTab = tab => onTabChange?.(tab)
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
                {TABS.map(([id, label]) => <Button key={id} text={label} color={5} active={id === "item-catalogue" ? activeTab === "item-catalogue" || activeTab === "set-catalogue" : id === "hero-catalogue" ? activeTab === "hero-catalogue" || activeTab === "hero-banners-catalogue" : id === "resources-catalogue" ? activeTab === "resources-catalogue" || activeTab === "gems-catalogue" : id === "skills-talents-catalogue" ? activeTab === "skills-talents-catalogue" || activeTab === "skills-catalogue" || activeTab === "talents-catalogue" : activeTab === id} onClick={() => setActiveTab(id)} />)}
            </div>
        </div>
        <div id="page-info" className="page card w-100" ref={listRef} {...events} style={{ display:"flex", flexDirection:"column", alignItems:"stretch", flex:"1 1 0", minHeight:0, minWidth:0, overflowY:"auto", overflowX:"hidden", alignContent:"start" }}>
            {activeTab === "overview" && <InfoOverview items={items} sets={sets} heroes={heroes} onNavigate={setActiveTab} />}
            <Suspense fallback={<div className="card">Loading catalogue...</div>}>
                {activeTab === "item-catalogue" && <CatalogueItem itemsRef={itemData} setsRef={sets} onViewChange={view => setActiveTab(view === "sets" ? "set-catalogue" : "item-catalogue")} />}
                {activeTab === "set-catalogue" && <CatalogueItem itemsRef={itemData} setsRef={sets} initialView="sets" onViewChange={view => setActiveTab(view === "sets" ? "set-catalogue" : "item-catalogue")} />}
                {activeTab === "perk-catalogue" && <CataloguePerk items={items} sets={sets} />}
                {(activeTab === "hero-catalogue" || activeTab === "hero-banners-catalogue") && <CatalogueHero heroesRef={heroes} initialView={activeTab === "hero-banners-catalogue" ? "banners" : "heroes"} onViewChange={view => setActiveTab(view === "banners" ? "hero-banners-catalogue" : "hero-catalogue")} />}
                {(activeTab === "resources-catalogue" || activeTab === "gems-catalogue") && <CatalogueResources initialView={activeTab === "gems-catalogue" ? "gems" : "resources"} onViewChange={view => setActiveTab(view === "gems" ? "gems-catalogue" : "resources-catalogue")} />}
                {(activeTab === "skills-catalogue" || activeTab === "talents-catalogue") && <CatalogueSkillsTalents heroes={heroes} initialView={activeTab === "talents-catalogue" ? "talents" : "skills"} onViewChange={view => setActiveTab(view === "talents" ? "talents-catalogue" : "skills-catalogue")} />}
                {activeTab === "skills-talents-catalogue" && <CatalogueSkillsTalents heroes={heroes} initialView="skills" onViewChange={view => setActiveTab(view === "talents" ? "talents-catalogue" : "skills-catalogue")} />}
                {activeTab === "status-catalogue" && <CatalogueStatus />}
            </Suspense>
        </div>
        <BackToTopButton scrollRef={listRef} />
    </div>
}
export default PageInfos
