import { useMemo, useState } from "react"
import Button from "./Button.jsx"

const humanize = value => String(value ?? "").replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase())
const toLabel = value => {
    if (typeof value === "string") return humanize(value)
    if (value && typeof value === "object") return value.name ?? value.label ?? Object.entries(value).map(([key, val]) => `${humanize(key)}: ${String(val)}`).join(" · ")
    return String(value ?? "")
}
function PerkCard({ entry }) {
    return <article className="catalogue-item-card card">
        <h3 className="header">{entry.name}</h3>
        <p className="text">{entry.source}</p>
        {entry.detail && <p className="catalogue-muted text">{entry.detail}</p>}
    </article>
}
function SubPagePerkCatalogue({ items = [], sets = [] }) {
    const [search, setSearch] = useState("")
    const [kind, setKind] = useState("all")
    const entries = useMemo(() => {
        const result = []
        for (const item of items) {
            for (const [type, list] of [["Fixed perk", item.fixedPerks], ["Perk", item.perks]]) {
                if (!Array.isArray(list)) continue
                list.forEach((perk, index) => result.push({ key: `item-${item.id}-${type}-${index}`, name: toLabel(perk), source: item.name ?? `Item ${item.id}`, detail: type, kind: "item" }))
            }
        }
        for (const set of sets) {
            ;(Array.isArray(set.setBonus) ? set.setBonus : []).forEach((perk, index) => result.push({ key: `set-${set.id}-${index}`, name: toLabel(perk), source: set.name ?? `Set ${set.id}`, detail: "Set bonus", kind: "set" }))
        }
        return result
    }, [items, sets])
    const filtered = entries.filter(entry => (kind === "all" || entry.kind === kind) && `${entry.name} ${entry.source} ${entry.detail}`.toLowerCase().includes(search.trim().toLowerCase()))
    return <section className="item-catalogue">
        <header className="catalogue-header"><div className="catalogue-heading-copy"><h2 className="catalogue-title header-big">Perk Catalogue</h2><p className="catalogue-description text">Search perks attached to items and set bonuses. Each occurrence is shown with its source, including repeated perks.</p></div><p className="catalogue-result-count text">{filtered.length} of {entries.length} perk entries</p></header>
        <div className="catalogue-filters">
            <label className="catalogue-search"><span className="catalogue-control-label text">Search perks</span><input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Perk, item, set…" /></label>
            <label className="catalogue-filter"><span className="catalogue-control-label text">Source type</span><select value={kind} onChange={event => setKind(event.target.value)}><option value="all">All sources</option><option value="item">Items</option><option value="set">Sets</option></select></label>
            <div className="catalogue-filter-actions"><Button text="Clear filters" color={5} onClick={() => { setSearch(""); setKind("all") }} /></div>
        </div>
        {filtered.length === 0 ? <p className="catalogue-empty card">No perks match these filters.</p> : <div className="catalogue-item-grid">{filtered.map(entry => <PerkCard key={entry.key} entry={entry} />)}</div>}
    </section>
}
export default SubPagePerkCatalogue
