import { useMemo, useState } from "react"
import { useTranslate } from "../../hooks/useTranslate.jsx"
import { useContentTranslation } from "../../hooks/useContentTranslation.jsx"
import { matchesSearchQuery, useUrlSearch } from "../../js/search.jsx"
import { PERK_DEFINITIONS, POSSIBLE_PERKS } from "../../database/enums.jsx"
import { iconSprites, perkSprites } from "../../database/db_sprites.jsx"
import CatalogueFilterActions from "../CatalogueFilterActions.jsx"
import "../../css/infos.scss"
import "../../css/infos_perks.scss"

const perkLabel = key => PERK_DEFINITIONS[key]?.name ?? key.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())

function CataloguePerk() {
    const t = useTranslate()
    const tc = useContentTranslation()
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [slotFilter, setSlotFilter] = useState("all")
    const [filtersVisible, setFiltersVisible] = useState(true)
    const entries = useMemo(() => {
        const slotsByPerk = new Map()
        for (const [slot, perkKeys] of Object.entries(POSSIBLE_PERKS)) {
            for (const key of perkKeys) {
                if (!slotsByPerk.has(key)) slotsByPerk.set(key, new Set())
                slotsByPerk.get(key).add(slot)
            }
        }
        return [...slotsByPerk.entries()]
            .map(([key, slots]) => ({ key, name: tc("perk", key, "name", perkLabel(key)), description: tc("perk", key, "description", ""), slots: [...slots] }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [tc])
    const filtered = entries.filter(entry => matchesSearchQuery([entry.name, entry.key, entry.slots.join(" ")], search)
        && (slotFilter === "all" || entry.slots.includes(slotFilter)))
    const clearFilters = () => { setSearch(""); commitSearch(""); setSlotFilter("all") }
    return <section className="perk-catalogue">
        <header className="catalogue-header">
            <div className="catalogue-heading-copy">
                <div className="catalogue-title header-big">{t("app.pages.catalogues.perkTitle")}</div>
                <p className="catalogue-description text">{t("app.pages.catalogues.perkDescription")}</p>
            </div>
        </header>
        {filtersVisible ? (
            <div className="perk-catalogue-filters card">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">{t("app.pages.catalogues.searchCount", { resultCount: filtered.length, totalCount: entries.length })}</span>
                    <input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)} placeholder={t("app.pages.catalogues.perkSearchPlaceholder")} />
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{t("app.shared.slotLabel")}</span>
                    <select  value={slotFilter} onChange={event => setSlotFilter(event.target.value)}>
                        <option value="all">{t("app.shared.allSlots")}</option>
                        {Object.keys(POSSIBLE_PERKS).map(slot => <option key={slot} value={slot}>{{ WEAPONS: "Weapon", HELMETS: "Helmet", ARMORS: "Armor", RINGS: "Ring", NECKLACES: "Necklace" }[slot] ?? slot}</option>)}
                    </select>
                </label>
                <CatalogueFilterActions filtersVisible onHide={() => setFiltersVisible(false)} onClear={clearFilters} />
            </div>
        ) : <CatalogueFilterActions filtersVisible={false} onShow={() => setFiltersVisible(true)} />}
        <div className="perk-catalogue-list">
            {filtered.map(entry => <article className="perk-catalogue-row card" key={entry.key}>
                {perkSprites[entry.key] && (
                    <div className="perk-catalogue-icon-wrap">
                        <img className="perk-catalogue-icon" src={perkSprites[entry.key]} alt="" loading="lazy" decoding="async" draggable={false} />
                    </div>
                )}
                <div className="perk-catalogue-content">
                    <div className="perk-catalogue-heading">
                        <span className="text-big catalogue-entry-name perk-catalogue-name">{entry.name}</span>
                    {entry.description && <p className="text perk-catalogue-description">{entry.description}</p>}
                    </div>
                    <div className="perk-catalogue-slots">{entry.slots.map(slot => {
                        const slotLabel = tc("equipmentSlot", slot.replace(/S$/, ""), "name", slot.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()))
                        const iconKey = slot.toLowerCase()
                        return <span className="catalogue-chip text perk-catalogue-slot-chip" key={slot}>
                            {iconSprites[iconKey] && <img className="catalogue-chip-icon" src={iconSprites[iconKey]} alt="" />}
                            {slotLabel}
                        </span>
                    })}</div>
                </div>
            </article>)}
            {filtered.length === 0 && <p className="catalogue-empty card">{t("app.pages.catalogues.noPerksMatch")}</p>}
        </div>
    </section>
}
export default CataloguePerk
