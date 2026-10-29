import { useMemo, useState } from "react"
import { matchesSearchQuery, useUrlSearch } from "../js/search.jsx"
import Button from "./Button.jsx"
import CatalogueEntryCard from "./CatalogueEntryCard.jsx"

const stringify = value => {
    if (value == null) return ""
    if (typeof value === "string") return value
    try { return JSON.stringify(value, null, 2) } catch { return String(value) }
}

function SkillCard({ hero, skill, skillIndex }) {
    const skillType = ["Primary", "Secondary", "Ultimate"][skillIndex] ?? `Skill ${skillIndex + 1}`
    return <CatalogueEntryCard className="skill-catalogue-entry">
        <header className="skill-catalogue-heading">
            <h3 className="catalogue-entry-name text-big skill-catalogue-name">{skill.name || "Unnamed skill"}</h3>
            <div className="skill-catalogue-meta">
                <span className="catalogue-chip catalogue-chip-rarity text skill-catalogue-hero" data-rarity={hero.rarity}>{hero.name}</span>
                <span className="catalogue-chip text skill-catalogue-type">{skillType}</span>
                {skill.cooldown != null && <span className="catalogue-chip text skill-catalogue-cooldown">Cooldown: {skill.cooldown} Turns</span>}
            </div>
        </header>
        {skill.description && <p className="text skill-catalogue-description">{skill.description}</p>}
        {skill.effect != null && <details className="hero-catalogue-details"><summary className="text">Effect data</summary><pre className="hero-catalogue-code text">{stringify(skill.effect)}</pre></details>}
    </CatalogueEntryCard>
}

function getTalentPosition(talentId) {
    const id = String(talentId)
    const row = Number(id[0])
    const side = id.endsWith("0") ? "Center" : id.endsWith("1") ? "Left" : "Right"
    return `Row #${row} - ${side}`
}

const humanizeKey = key => String(key).replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase())

function TalentEffect({ effect }) {
    const entries = (Array.isArray(effect) ? effect : [effect]).flatMap(value => {
        if (value && typeof value === "object" && !Array.isArray(value)) return Object.entries(value)
        return [["Effect", value]]
    })
    return <dl className="talent-effect-list flex-row justify-center">
        {entries.map(([key, value], index) => <div className="talent-effect-entry w-fit" key={key + "-" + index}>
            <dt className="text">{humanizeKey(key)}</dt>
            <dd className="text">{typeof value === "object" && value !== null ? stringify(value) : String(value)}</dd>
        </div>)}
    </dl>
}

function TalentCard({ talent, sources }) {
    return <CatalogueEntryCard className="talent-catalogue-entry">
        <header className="catalogue-entry-heading talent-catalogue-heading">
            <h3 className="catalogue-entry-name text-big talent-catalogue-name">{talent.name || "Unnamed talent"}</h3>
        </header>
        <div className="talent-source-list" aria-label="Heroes with this talent">
            {sources.map(({ hero, id }) => <div className="talent-source-entry" key={hero.id + "-" + id}>
                <span className="catalogue-chip text talent-source-hero">{hero.name}</span>
                <span className="catalogue-chip text talent-source-position">{getTalentPosition(id)}</span>
            </div>)}
        </div>
        {talent.effect != null && <TalentEffect effect={talent.effect} />}
    </CatalogueEntryCard>
}

function CatalogueSkillsTalents({ heroes = [], initialView = "skills", onViewChange }) {
    const [view, setView] = useState(initialView)
    const [search, setSearch, commitSearch] = useUrlSearch()
    const changeView = nextView => {
        setView(nextView)
        onViewChange?.(nextView)
    }
    const entries = useMemo(() => {
        if (view === "skills") {
            return heroes.flatMap(hero => (Array.isArray(hero.skills) ? hero.skills : []).map((skill, index) => ({
                hero, skill, skillIndex: index, key: hero.id + "-skill-" + index
            })))
        }
        const groupedTalents = new Map()
        heroes.forEach(hero => {
            Object.entries(hero.talents && typeof hero.talents === "object" ? hero.talents : {}).forEach(([id, talent]) => {
                // Group by name and effect, not position: talent positions can differ between heroes.
                const groupKey = JSON.stringify([talent?.name ?? "", talent?.effect ?? null])
                if (!groupedTalents.has(groupKey)) groupedTalents.set(groupKey, { talent, key: "talent-" + groupKey, sources: [] })
                groupedTalents.get(groupKey).sources.push({ hero, id })
            })
        })
        return [...groupedTalents.values()]
    }, [heroes, view])
    const filtered = entries.filter(entry => {
        const value = view === "skills" ? entry.skill : entry.talent
        const sourceText = view === "skills" ? entry.hero.name : entry.sources.map(({ hero, id }) => hero.name + " " + getTalentPosition(id)).join(" ")
        return matchesSearchQuery([sourceText, stringify(value), entry.id ?? ""], search)
    })
    return <section className="hero-catalogue">
        <nav className="catalogue-view-switch" aria-label="Skills and talents sections">
            <Button text="Skills" color={5} active={view === "skills"} onClick={() => changeView("skills")} />
            <Button text="Talents" color={5} active={view === "talents"} onClick={() => changeView("talents")} />
        </nav>
        <header className="catalogue-header"><div className="catalogue-heading-copy"><div className="catalogue-title header-big">{view === "skills" ? "Skills Catalogue" : "Talents Catalogue"}</div><p className="catalogue-description text">{view === "skills" ? "Every skill currently present in the hero database, with its source hero." : "Every unique talent currently present in the hero database, with its source hero and position. Shared talents list all source heroes."}</p><p className="catalogue-progress-note text">This section is still in progress; some skill and talent data may be incomplete.</p></div></header>
        <label className="catalogue-search skills-talents-catalogue-filters card"><span className="catalogue-control-label text">Search {view} ({filtered.length} of {entries.length} {view === "skills" ? "skills" : "talents"})</span><input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)} placeholder="Name, hero, effect…" /></label>
        {filtered.length === 0 ? <p className="catalogue-empty card">No {view} match this search.</p> : <div className="hero-catalogue-grid">{filtered.map(entry => view === "skills" ? <SkillCard key={entry.key} hero={entry.hero} skill={entry.skill} skillIndex={entry.skillIndex} /> : <TalentCard key={entry.key} talent={entry.talent} sources={entry.sources} />)}</div>}
    </section>
}
export default CatalogueSkillsTalents
