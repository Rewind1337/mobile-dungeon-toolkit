import { useMemo, useState } from "react"

import { DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { perkSprites, statusSprites } from "../database/db_sprites.jsx"
import Button from "./Button.jsx"
import Item from "./Item.jsx"

import "../css/item.scss"
import "../css/other.scss"

const SLOT_NAMES = Object.fromEntries(
    Object.values(EQUIPMENT_SLOT_DEFINITIONS).map(({ id, name }) => [id, name])
)
const RARITY_NAMES = Object.fromEntries(
    Object.values(RARITY_DEFINITIONS).map(({ id, name }) => [id, name])
)
const PERK_NAMES = Object.fromEntries(
    Object.entries(PERK_DEFINITIONS).map(([key, perk]) => [key, perk.name ?? key])
)

const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

function getLocations(item) {
    const raw = item?.dropLocation
    if (Array.isArray(raw)) return raw.map(value => String(value)).filter(Boolean)
    if (raw === null || raw === undefined || raw === "") return ["Unspecified location"]
    return [String(raw)]
}

function getSourceName(source) {
    if (source === null || source === undefined || source === "") return "Unspecified source"
    const name = getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(source)) ?? String(source)
    return name.toLowerCase() === "everywhere" ? "Any Dungeon" : name
}

function getPerkKey(perk) {
    if (typeof perk === "string") return perk.toUpperCase().replace(/\s/g, "_")
    if (perk && typeof perk === "object") {
        return Object.keys(PERK_DEFINITIONS).find(key => PERK_DEFINITIONS[key].id === perk.id) ?? ""
    }
    return ""
}

function getPerkLabel(perk) {
    const key = getPerkKey(perk)
    return PERK_NAMES[key] ?? (typeof perk === "string" ? humanize(perk) : "")
}

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return [String(value)]
    if (typeof value !== "object" || seen.has(value)) return []
    seen.add(value)
    return Object.values(value).flatMap(child => getSearchableValues(child, seen))
}

const STATUS_ALIASES = [
    { key: "poison", terms: ["poison"] },
    { key: "cursed", terms: ["cursed"] },
    { key: "blind", terms: ["blind"] },
    { key: "bleeding", terms: ["bleeding", "bleed"] },
    { key: "burn", terms: ["burn"] },
    { key: "freeze", terms: ["freeze", "frozen"] },
    { key: "defense_down", terms: ["def down", "defence down", "defense down"] },
    { key: "agility_down", terms: ["agi down", "agility down"] },
    { key: "attack_down", terms: ["atk down", "attack down"] },
    { key: "marked", terms: ["marked"] },
    { key: "petrified", terms: ["petrified"] },
    { key: "sick", terms: ["sick"] },
    { key: "mute", terms: ["mute"] },
    { key: "bound", terms: ["bound"] },
    { key: "echo", terms: ["echo"] },
    { key: "stunned", terms: ["stun", "stunned"] },
]

function getEffectStatuses(item) {
    const description = String(item?.unique?.description ?? "").toLowerCase()
    if (!description) return []
    return STATUS_ALIASES
        .filter(status => status.terms.some(term => description.includes(term)) && statusSprites[status.key])
        .map(status => ({ key: status.key, name: humanize(status.key), sprite: statusSprites[status.key] }))
}

function isUniqueItem(item) {
    return Boolean(item?.isUnique) || (item?.unique !== undefined && item?.unique !== null && item.unique !== 0)
}

function PerkList({ perks, label = "Perks" }) {
    const visiblePerks = (perks ?? []).filter(perk => {
        const key = getPerkKey(perk)
        return key && key !== "NOTHING"
    })

    return (
        <section className="catalogue-perks card">
            <h4 className="catalogue-section-label text">{label}</h4>
            {visiblePerks.length === 0
                ? <p className="catalogue-muted">None recorded</p>
                : <ul className="catalogue-perk-list flex-row">
                    {visiblePerks.map((perk, index) => {
                        const key = getPerkKey(perk)
                        return (
                            <li className="catalogue-perk text" key={key + "-" + index} title={getPerkLabel(perk)}>
                                {perkSprites[key] && <img className="catalogue-perk-icon" src={perkSprites[key]} alt="" draggable={false} />}
                                <span className="catalogue-perk-name">{getPerkLabel(perk)}</span>
                            </li>
                        )
                    })}
                </ul>
            }
        </section>
    )
}

function CatalogueFilters({
    search,
    setSearch,
    sourceFilter,
    setSourceFilter,
    slotFilter,
    setSlotFilter,
    locationFilter,
    setLocationFilter,
    allSources,
    allLocations,
    view,
    clearFilters
}) {
    return (
        <div className="catalogue-filters">
            <label className="catalogue-search">
                <span className="catalogue-control-label text">Search all item data</span>
                <input
                    className="selectable catalogue-input"
                    aria-label="Search item catalogue"
                    placeholder="Name, effect text, perk, set, source, ID…"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">Source</span>
                <select aria-label="Filter by source" value={sourceFilter} onChange={event => setSourceFilter(event.target.value)}>
                    <option value="all">All sources</option>
                    {allSources.map(source => <option key={source} value={source}>{humanize(source)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">Location</span>
                <select aria-label="Filter by location" value={locationFilter} onChange={event => setLocationFilter(event.target.value)}>
                    <option value="all">All locations</option>
                    {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                </select>
            </label>
            {view === "items" && <>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Slot</span>
                    <select aria-label="Filter by slot" value={slotFilter} onChange={event => setSlotFilter(event.target.value)}>
                        <option value="all">All slots</option>
                        {Object.values(EQUIPMENT_SLOT_DEFINITIONS).map(slot =>
                            <option key={slot.id} value={String(slot.id)}>{humanize(slot.name)}</option>
                        )}
                    </select>
                </label>
            </>}
            <div className="catalogue-filter-actions">
                <Button text="Clear filters" color={5} onClick={clearFilters} />
            </div>
        </div>
    )
}

function ItemCatalogueCard({ item, set }) {
    const statuses = getEffectStatuses(item)
    const effectDescription = item.unique?.description

    return (
        <article className="catalogue-item-card card" data-rarity={item.rarity}>
            <div className="catalogue-item-identity">
                <div className="catalogue-item-preview" aria-hidden="true">
                    <Item itemObj={item} selected={false} level={null} />
                </div>
                <div className="catalogue-item-heading">
                    <h3 className="catalogue-item-name header">{item.name}</h3>
                    <div className="catalogue-item-meta-row">
                        <p className="catalogue-item-meta text">
                            {humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity")} · {humanize(item.slotLabel ?? "Unknown slot")}
                        </p>
                        {set && <p className="catalogue-item-set text">· Set: {set.name}</p>}
                    </div>
                    <div className="catalogue-item-source-row text">
                        <p className="catalogue-item-source">Source: {humanize(getSourceName(item.dropSource))}</p>
                        <p className="catalogue-item-location">
                            · Boosted: {getLocations(item).filter(location => location !== "Unspecified location").join(", ") || "Unspecified"}
                        </p>
                    </div>
                </div>
            </div>

            {effectDescription && (
                <section className="catalogue-effect card">
                    <h4 className="catalogue-section-label text flex-row">
                        {statuses.length > 0 && (
                            <div className="catalogue-statuses" aria-label="Statuses applied by weapon effect">
                                {statuses.map(status => (
                                    <img className="catalogue-status-icon" key={status.key} src={status.sprite} alt={status.name} title={status.name} draggable={false} />
                                ))}
                            </div>
                        )}
                        <div className="text">Unique Effect</div>
                    </h4>
                    <p className="catalogue-effect-description text">{effectDescription}</p>
                </section>
            )}

            <PerkList perks={item.fixedPerks} label="Fixed perks" />
            {set && <PerkList perks={set.setBonus} label="Set bonuses" />}
        </article>
    )
}

function SetCatalogueCard({ set, pieces }) {
    const locations = set.dropLocation !== undefined
        ? getLocations(set)
        : [...new Set(pieces.flatMap(getLocations))]

    return (
        <article className="catalogue-set-card card">
            <header className="catalogue-set-header">
                <h3 className="catalogue-set-name header">{set.name}</h3>
                <p className="catalogue-set-meta text">
                    {set.pieces} pieces <span aria-hidden="true">·</span> {humanize(getSourceName(set.dropSource))}
                </p>
                {locations.length > 0 && <p className="catalogue-set-locations text">Locations: {locations.join(", ")}</p>}
            </header>

            <PerkList perks={set.setBonus} label="Set bonuses" />

            <section className="catalogue-set-pieces">
                <h4 className="catalogue-section-label text">Pieces ({pieces.length})</h4>
                {pieces.length > 0
                    ? <ul className="catalogue-piece-list">
                        {pieces.map(item => (
                            <li className="catalogue-piece" key={item.id}>
                                <img className="catalogue-piece-image" src={item.itemSrc} alt="" draggable={false} />
                                <span className="catalogue-piece-name text">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                    : <p className="catalogue-muted">No item pieces are currently linked to this set in the item database.</p>
                }
            </section>
        </article>
    )
}


function ItemOverview({ items, sets }) {
    const slotCounts = items.reduce((counts, item) => {
        const slot = item.slotLabel ?? "Unknown slot"
        counts[slot] = (counts[slot] ?? 0) + 1
        return counts
    }, {})
    const bySlot = Object.entries(slotCounts).sort(([a], [b]) => a.localeCompare(b))
    const withLocation = items.filter(item => (
        Array.isArray(item.dropLocation)
            ? item.dropLocation.some(location => Boolean(String(location).trim()))
            : Boolean(String(item.dropLocation ?? "").trim())
    )).length
    const withoutLocation = items.length - withLocation

    return (
        <section className="catalogue-overview card">
            <h3 className="catalogue-overview-title header">Item Overview</h3>
            <div className="catalogue-overview-stats">
                <div className="catalogue-overview-stat card">
                    <span className="text">Total items</span>
                    <span className="header-big">{items.length}</span>
                </div>
                <div className="catalogue-overview-stat card">
                    <span className="text">Item sets</span>
                    <span className="header-big">{sets.length}</span>
                </div>
                <div className="catalogue-overview-stat card">
                    <span className="text">Items with a location</span>
                    <span className="header-big">{withLocation}</span>
                </div>
                <div className="catalogue-overview-stat card">
                    <span className="text">Items without a location</span>
                    <span className="header-big">{withoutLocation}</span>
                </div>
            </div>
            <div className="catalogue-overview-slots">
                <h4 className="catalogue-section-label text">Items by slot</h4>
                <div className="catalogue-overview-slot-list">
                    {bySlot.map(([slot, count]) => (
                        <div className="catalogue-overview-slot card" key={slot}>
                            <span className="text">{humanize(slot)}</span>
                            <span className="header">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
            <p className="catalogue-muted text">This overview reflects the current item database. It does not infer missing drop locations.</p>
        </section>
    )
}

function SubPageDrops({ itemsRef, setsRef }) {
    const [view, setView] = useState("items")
    const [search, setSearch] = useState("")
    const [sourceFilter, setSourceFilter] = useState("all")
    const [slotFilter, setSlotFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")

    const allItems = useMemo(() => {
        if (!itemsRef) return []
        return Object.entries(itemsRef).flatMap(([slotKey, items]) => {
            if (!Array.isArray(items)) return []
            return items.map(item => ({
                ...item,
                slotLabel: SLOT_NAMES[item.slot] ?? slotKey,
                setLabel: item.set ? (setsRef ?? []).find(set => set.id === item.set)?.name ?? String(item.set) : "",
                setBonusLabels: item.set
                    ? ((setsRef ?? []).find(set => set.id === item.set)?.setBonus ?? []).map(getPerkLabel)
                    : []
            }))
        })
    }, [itemsRef, setsRef])

    const allLocations = useMemo(() => {
        const locations = new Set()
        allItems.forEach(item => getLocations(item).forEach(location => locations.add(location)))
        ;(setsRef ?? []).forEach(set => {
            if (set.dropLocation !== undefined && set.dropLocation !== null) {
                getLocations(set).forEach(location => locations.add(location))
            }
        })
        return [...locations].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    }, [allItems, setsRef])

    const allSources = useMemo(() => [...new Set([
        ...allItems.map(item => getSourceName(item.dropSource)),
        ...(setsRef ?? []).filter(set => set.dropSource !== undefined).map(set => getSourceName(set.dropSource))
    ])].sort(), [allItems, setsRef])

    const filteredItems = useMemo(() => allItems.filter(item => {
        const query = search.trim().toLowerCase()
        const sourceName = getSourceName(item.dropSource)
        const unique = isUniqueItem(item)
        const searchable = [
            ...getSearchableValues(item),
            unique ? "unique" : "not unique",
            item.name,
            item.id,
            item.slotLabel,
            item.setLabel,
            sourceName,
            ...getLocations(item),
            humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity"),
            ...getEffectStatuses(item).map(status => status.name),
            ...(item.fixedPerks ?? []).map(getPerkLabel),
            ...(item.setBonusLabels ?? [])
        ].join(" ").toLowerCase()
        const matchesSearch = !query || (query === "unique" ? unique : query === "not unique" ? !unique : searchable.includes(query))
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesSlot = slotFilter === "all" || String(item.slot) === slotFilter
        const matchesLocation = locationFilter === "all" || getLocations(item).includes(locationFilter)
        return matchesSearch && matchesSource && matchesSlot && matchesLocation
    }), [allItems, search, sourceFilter, slotFilter, locationFilter])

    const filteredSets = useMemo(() => (setsRef ?? []).filter(set => {
        const query = search.trim().toLowerCase()
        const sourceName = getSourceName(set.dropSource)
        const searchable = [
            ...getSearchableValues(set),
            set.name,
            set.id,
            sourceName,
            ...getLocations(set),
            ...(set.setBonus ?? []).map(getPerkLabel),
            ...allItems.filter(item => item.set === set.id).map(item => item.name)
        ].join(" ").toLowerCase()
        const matchesSearch = !query || searchable.includes(query)
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesLocation = locationFilter === "all" || getLocations(set).includes(locationFilter)
        return matchesSearch && matchesSource && matchesLocation
    }), [setsRef, search, sourceFilter, locationFilter, allItems])

    const clearFilters = () => {
        setSearch("")
        setSourceFilter("all")
        setSlotFilter("all")
        setLocationFilter("all")
    }

    return (
        <section className="item-catalogue">
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <h2 className="catalogue-title header-big">Item Catalogue</h2>
                    <p className="catalogue-description text">
                        Search item names, unique-effect descriptions, fixed perks, set bonuses, rarity, source, location, and other stored item data.
                    </p>
                </div>
            </header>

            <nav className="catalogue-view-switch" aria-label="Catalogue view">
                <Button text="Items" color={5} active={view === "items"} onClick={() => setView("items")} />
                <Button text="Set Overview" color={5} active={view === "sets"} onClick={() => setView("sets")} />
            </nav>

            <CatalogueFilters
                search={search}
                setSearch={setSearch}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                slotFilter={slotFilter}
                setSlotFilter={setSlotFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                allSources={allSources}
                allLocations={allLocations}
                view={view}
                clearFilters={clearFilters}
            />

            {view === "items" && (
                <div className="catalogue-results">
                    {filteredItems.length === 0
                        ? <p className="catalogue-empty card">No items match these filters.</p>
                        : <div className="catalogue-item-grid">
                            {filteredItems
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(item => {
                                    const set = item.set ? (setsRef ?? []).find(candidate => candidate.id === item.set) : null
                                    return <ItemCatalogueCard key={item.id} item={item} set={set} />
                                })}
                        </div>
                    }
                </div>
            )}

            {view === "sets" && (
                <div className="catalogue-set-grid">
                    {filteredSets.length === 0
                        ? <p className="catalogue-empty card">No sets match these filters.</p>
                        : filteredSets.map(set => {
                            const pieces = allItems.filter(item => item.set === set.id)
                            return <SetCatalogueCard key={set.id} set={set} pieces={pieces} />
                        })
                    }
                </div>
            )}
            <ItemOverview items={allItems} sets={setsRef ?? []} />
        </section>
    )
}

export default SubPageDrops
