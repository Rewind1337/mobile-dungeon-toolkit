import { useMemo, useState } from "react"
import { PERK_DEFINITIONS, POSSIBLE_PERKS } from "../database/enums.jsx"
import "../css/other.scss"

const perkLabel = key => PERK_DEFINITIONS[key]?.name ?? key.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())

function SubPagePerkCatalogue() {
    const [search, setSearch] = useState("")
    const entries = useMemo(() => {
        const slotsByPerk = new Map()
        for (const [slot, perkKeys] of Object.entries(POSSIBLE_PERKS)) {
            for (const key of perkKeys) {
                if (!slotsByPerk.has(key)) slotsByPerk.set(key, new Set())
                slotsByPerk.get(key).add(slot)
            }
        }
        return [...slotsByPerk.entries()]
            .map(([key, slots]) => ({ key, name: perkLabel(key), slots: [...slots] }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [])
    const filtered = entries.filter(entry => `${entry.name} ${entry.slots.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()))
    return <section className="perk-catalogue">
        <header className="catalogue-header">
            <div className="catalogue-heading-copy">
                <h2 className="catalogue-title header-big">Perk Catalogue</h2>
                <p className="catalogue-description text">Each perk is listed once, alongside the equipment slots it can roll on.</p>
            </div>
            <p className="catalogue-result-count text">{filtered.length} of {entries.length} perks</p>
        </header>
        <label className="catalogue-search perk-catalogue-filters card">
            <span className="catalogue-control-label text">Search perks</span>
            <input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search perks or equipment slots…" />
        </label>
        <div className="perk-catalogue-list">
            {filtered.map(entry => <article className="perk-catalogue-row card" key={entry.key}>
                <span className="header">{entry.name}</span>
                <span className="text perk-catalogue-slots">{entry.slots.map(slot => slot.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())).join(" · ")}</span>
            </article>)}
            {filtered.length === 0 && <p className="catalogue-empty card">No perks match this search.</p>}
        </div>
    </section>
}
export default SubPagePerkCatalogue
