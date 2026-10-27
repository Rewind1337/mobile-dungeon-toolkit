import { useEffect, useMemo } from "react"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import Button from "./Button.jsx"
import CatalogueItem from "./CatalogueItem.jsx"
import CatalogueHero from "./CatalogueHero.jsx"
import CatalogueResources from "./CatalogueResources.jsx"
import CatalogueStatus from "./CatalogueStatus.jsx"
import CatalogueSkillsTalents from "./CatalogueSkillsTalents.jsx"
import CataloguePerk from "./CataloguePerk.jsx"
import BackToTopButton from "./BackToTopButton.jsx"
import "../css/other.scss"
import "../css/hero.scss"
import { ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, RARITY_DEFINITIONS } from "../database/enums.jsx"

const EMPTY_ITEM_DATA = {}
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
    return <div className="catalogue-overview-stat card"><span className="text">{label}</span><span className="header-big">{value}</span></div>
}

function InfoOverview({ items, sets, heroes }) {
    const itemCount = Array.isArray(items) ? items.length : Object.values(items).reduce((total, list) => total + (Array.isArray(list) ? list.length : 0), 0)
    const heroCountBy = (key, definitions) => heroes.reduce((counts, hero) => {
        const value = Object.values(definitions).find(entry => entry.id === Number(hero[key]))
        const label = humanize(value?.name ?? "unknown")
        counts[label] = (counts[label] ?? 0) + 1
        return counts
    }, {})
    const skillCount = heroes.reduce((total, hero) => total + (Array.isArray(hero.skills) ? hero.skills.length : 0), 0)
    const talentCount = heroes.reduce((total, hero) => total + (hero.talents && typeof hero.talents === "object" ? Object.keys(hero.talents).length : 0), 0)
    const rows = values => Object.entries(values).sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => <div className="catalogue-overview-slot card" key={name}><span className="text">{name}</span><span className="header">{count}</span></div>)
    return <section className="info-overview">
        <header className="catalogue-header">
            <div className="catalogue-heading-copy">
                <div className="catalogue-title header-big">Info</div>
                <p className="catalogue-description text">A quick overview of the data available in the toolkit. Choose a catalogue above to explore individual entries.</p>
            </div>
        </header>
        <div className="catalogue-overview-stats">
            <Stat label="Items" value={itemCount} />
            <Stat label="Item sets" value={sets.length} />
            <Stat label="Heroes" value={heroes.length} />
            <Stat label="Skills" value={skillCount} />
            <Stat label="Talent entries" value={talentCount} />
        </div>
        <div className="info-overview-breakdown">
            <section className="card"><div className="header">Heroes by element</div><div className="catalogue-overview-slot-list">{rows(heroCountBy("element", ELEMENT_DEFINITIONS))}</div></section>
            <section className="card"><div className="header">Heroes by role</div><div className="catalogue-overview-slot-list">{rows(heroCountBy("role", ROLE_DEFINITIONS))}</div></section>
            <section className="card"><div className="header">Heroes by rarity</div><div className="catalogue-overview-slot-list">{rows(heroCountBy("rarity", RARITY_DEFINITIONS))}</div></section>
        </div>
        <p className="catalogue-muted text">Counts reflect the current in-project data. Skills and talent entries are counted per hero, so repeated names are included.</p>
    </section>
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
                {TABS.map(([id, label]) => <Button key={id} text={label} color={5} active={id === "item-catalogue" ? activeTab === "item-catalogue" || activeTab === "set-catalogue" : id === "hero-catalogue" ? activeTab === "hero-catalogue" || activeTab === "hero-banners-catalogue" : id === "resources-catalogue" ? activeTab === "resources-catalogue" || activeTab === "gems-catalogue" : id === "skills-talents-catalogue" ? activeTab === "skills-catalogue" || activeTab === "talents-catalogue" : activeTab === id} disabled={id === "resources-catalogue"} onClick={() => setActiveTab(id)} />)}
            </div>
        </div>
        <div id="page-info" className="page card w-100" ref={listRef} {...events} style={{ display:"flex", flexDirection:"column", alignItems:"stretch", flex:"1 1 0", minHeight:0, minWidth:0, overflowY:"auto", overflowX:"hidden", alignContent:"start" }}>
            {activeTab === "overview" && <InfoOverview items={items} sets={sets} heroes={heroes} />}
            {activeTab === "item-catalogue" && <CatalogueItem itemsRef={itemData} setsRef={sets} onViewChange={view => setActiveTab(view === "sets" ? "set-catalogue" : "item-catalogue")} />}
            {activeTab === "set-catalogue" && <CatalogueItem itemsRef={itemData} setsRef={sets} initialView="sets" onViewChange={view => setActiveTab(view === "sets" ? "set-catalogue" : "item-catalogue")} />}
            {activeTab === "perk-catalogue" && <CataloguePerk items={items} sets={sets} />}
            {(activeTab === "hero-catalogue" || activeTab === "hero-banners-catalogue") && <CatalogueHero heroesRef={heroes} initialView={activeTab === "hero-banners-catalogue" ? "banners" : "heroes"} onViewChange={view => setActiveTab(view === "banners" ? "hero-banners-catalogue" : "hero-catalogue")} />}
            {(activeTab === "resources-catalogue" || activeTab === "gems-catalogue") && <CatalogueResources initialView={activeTab === "gems-catalogue" ? "gems" : "resources"} onViewChange={view => setActiveTab(view === "gems" ? "gems-catalogue" : "resources-catalogue")} />}
            {(activeTab === "skills-catalogue" || activeTab === "talents-catalogue") && <CatalogueSkillsTalents heroes={heroes} initialView={activeTab === "talents-catalogue" ? "talents" : "skills"} onViewChange={view => setActiveTab(view === "talents" ? "talents-catalogue" : "skills-catalogue")} />}
            {activeTab === "skills-talents-catalogue" && <CatalogueSkillsTalents heroes={heroes} initialView="skills" onViewChange={view => setActiveTab(view === "talents" ? "talents-catalogue" : "skills-catalogue")} />}
            {activeTab === "status-catalogue" && <CatalogueStatus />}
        </div>
        <BackToTopButton scrollRef={listRef} />
    </div>
}
export default PageInfos
