import { useMemo, useState } from "react"
import { matchesSearchQuery, useUrlSearch } from "../js/search.jsx"
import CatalogueViewSwitch from "./CatalogueViewSwitch.jsx"
import SkillCatalogueCard from "./SkillCatalogueCard.jsx"
import TalentCatalogueCard from "./TalentCatalogueCard.jsx"
import { stringify, getTalentPosition } from "../js/skillsTalentsUtils.jsx"

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
        <CatalogueViewSwitch ariaLabel="Skills and talents sections" view={view} onViewChange={changeView} options={[
            { label: "Skills", value: "skills" },
            { label: "Talents", value: "talents" },
        ]} />
        <header className="catalogue-header"><div className="catalogue-heading-copy"><div className="catalogue-title header-big">{view === "skills" ? "Skills Catalogue" : "Talents Catalogue"}</div><p className="catalogue-description text">{view === "skills" ? "Every skill currently present in the hero database, with its source hero." : "Every unique talent currently present in the hero database, with its source hero and position. Shared talents list all source heroes."}</p><p className="catalogue-progress-note text">This section is still in progress; some skill and talent data may be incomplete.</p></div></header>
        <label className="catalogue-search skills-talents-catalogue-filters card"><span className="catalogue-control-label text">Search {view} ({filtered.length} of {entries.length} {view === "skills" ? "skills" : "talents"})</span><input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)} placeholder="Name, hero, effect…" /></label>
        {filtered.length === 0 ? <p className="catalogue-empty card">No {view} match this search.</p> : <div className="hero-catalogue-grid">{filtered.map(entry => view === "skills" ? <SkillCatalogueCard key={entry.key} hero={entry.hero} skill={entry.skill} skillIndex={entry.skillIndex} /> : <TalentCatalogueCard key={entry.key} talent={entry.talent} sources={entry.sources} />)}</div>}
    </section>
}
export default CatalogueSkillsTalents
