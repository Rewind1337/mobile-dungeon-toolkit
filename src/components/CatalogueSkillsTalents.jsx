import { useMemo, useState } from "react"
import Button from "./Button.jsx"

const stringify = value => {
    if (value == null) return ""
    if (typeof value === "string") return value
    try { return JSON.stringify(value, null, 2) } catch { return String(value) }
}

function SkillCard({ hero, skill, skillIndex }) {
    const skillType = ["Primary", "Secondary", "Ultimate"][skillIndex] ?? `Skill ${skillIndex + 1}`
    return <article className="hero-catalogue-skill card">
        <div className="skill-catalogue-heading">
            <span className="catalogue-chip text skill-catalogue-name">{skill.name || "Unnamed skill"}</span>
            <div className="skill-catalogue-meta">
                <span className="catalogue-chip catalogue-chip-rarity text skill-catalogue-hero" data-rarity={hero.rarity}>{hero.name}</span>
                <span className="catalogue-chip text skill-catalogue-type">{skillType}</span>
                {skill.cooldown != null && <span className="catalogue-chip text skill-catalogue-cooldown">Cooldown: {skill.cooldown} Turns</span>}
            </div>
        </div>
        {skill.description && <p className="catalogue-chip text skill-catalogue-description">{skill.description}</p>}
        {skill.effect != null && <details className="hero-catalogue-details"><summary className="text">Effect data</summary><pre className="hero-catalogue-code text">{stringify(skill.effect)}</pre></details>}
    </article>
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
    return <article className="hero-catalogue-talent card">
        <div className="hero-catalogue-skill-heading">
            <div className="catalogue-chip text talent-catalogue-name">{talent.name || "Unnamed talent"}</div>
        </div>
        <div className="talent-source-list" aria-label="Heroes with this talent">
            {sources.map(({ hero, id }) => <div className="talent-source-entry" key={hero.id + "-" + id}>
                <span className="catalogue-chip text talent-source-hero">{hero.name}</span>
                <span className="catalogue-chip text talent-source-position">{getTalentPosition(id)}</span>
            </div>)}
        </div>
        {talent.effect != null && <TalentEffect effect={talent.effect} />}
    </article>
}

function CatalogueSkillsTalents({ heroes = [] }) {
    const [view, setView] = useState("skills")
    const [search, setSearch] = useState("")
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
        return (sourceText + " " + stringify(value) + " " + (entry.id ?? "")).toLowerCase().includes(search.trim().toLowerCase())
    })
    return <section className="hero-catalogue">
        <header className="catalogue-header"><div className="catalogue-heading-copy"><div className="catalogue-title header-big">Skills &amp; Talents Catalogue</div><p className="catalogue-description text">Every skill and talent entry currently present in the hero database, with its source hero. Repeated names are intentionally listed separately.</p></div></header>
        <nav className="catalogue-view-switch" aria-label="Skills and talents view">
            <Button text="Skill Catalogue" color={5} active={view === "skills"} onClick={() => setView("skills")} />
            <Button text="Talent Catalogue" color={5} active={view === "talents"} onClick={() => setView("talents")} />
        </nav>
        <label className="catalogue-search skills-talents-catalogue-filters card"><span className="catalogue-control-label text">Search {view} ({filtered.length} of {entries.length} {view === "skills" ? "skills" : "talent entries"})</span><input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, hero, effect…" /></label>
        {filtered.length === 0 ? <p className="catalogue-empty card">No {view} match this search.</p> : <div className="hero-catalogue-grid">{filtered.map(entry => view === "skills" ? <SkillCard key={entry.key} hero={entry.hero} skill={entry.skill} skillIndex={entry.skillIndex} /> : <TalentCard key={entry.key} talent={entry.talent} sources={entry.sources} />)}</div>}
    </section>
}
export default CatalogueSkillsTalents
