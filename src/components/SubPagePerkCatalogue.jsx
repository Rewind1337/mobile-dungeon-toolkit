import { useMemo, useState } from "react"
import { PERK_DEFINITIONS, POSSIBLE_PERKS } from "../database/enums.jsx"
import { perkSprites } from "../database/db_sprites.jsx"
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
        </header>
        <label className="catalogue-search perk-catalogue-filters card">
            <span className="catalogue-control-label text">Search perks ({filtered.length} of {entries.length} perks)</span>
            <input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search perks or equipment slots…" />
        </label>
        <div className="perk-catalogue-list">
            {filtered.map(entry => <article className="perk-catalogue-row card" key={entry.key}>
                {perkSprites[entry.key] && <img className="perk-catalogue-icon" src={perkSprites[entry.key]} alt="" loading="lazy" draggable={false} />}
                <span className="header perk-catalogue-name">{entry.name}</span>
                <div className="perk-catalogue-slots">{entry.slots.map(slot => <span className="catalogue-chip" key={slot}>{slot.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())}</span>)}</div>
            </article>)}
            {filtered.length === 0 && <p className="catalogue-empty card">No perks match this search.</p>}
        </div>
    </section>
}
export default SubPagePerkCatalogue
