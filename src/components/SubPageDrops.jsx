import { useMemo, useState } from "react"

import { DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { perkSprites, statusSprites } from "../database/db_sprites.jsx"
import Button from "./Button.jsx"

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
    return getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(source)) ?? String(source)
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
        <section className="catalogue-perks">
            <h4 className="catalogue-section-label">{label}</h4>
            {visiblePerks.length === 0
                ? <p className="catalogue-muted">None recorded</p>
                : <ul className="catalogue-perk-list">
                    {visiblePerks.map((perk, index) => {
                        const key = getPerkKey(perk)
                        return (
                            <li className="catalogue-perk" key={key + "-" + index} title={getPerkLabel(perk)}>
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
    rarityFilter,
    setRarityFilter,
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
                <span className="catalogue-control-label">Search all item data</span>
                <input
                    className="selectable catalogue-input"
                    aria-label="Search item catalogue"
                    placeholder="Name, effect text, perk, set, source, ID…"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label">Source</span>
                <select aria-label="Filter by source" value={sourceFilter} onChange={event => setSourceFilter(event.target.value)}>
                    <option value="all">All sources</option>
                    {allSources.map(source => <option key={source} value={source}>{humanize(source)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label">Location</span>
                <select aria-label="Filter by location" value={locationFilter} onChange={event => setLocationFilter(event.target.value)}>
                    <option value="all">All locations</option>
                    {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                </select>
            </label>
            {view === "items" && <>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label">Slot</span>
                    <select aria-label="Filter by slot" value={slotFilter} onChange={event => setSlotFilter(event.target.value)}>
                        <option value="all">All slots</option>
                        {Object.values(EQUIPMENT_SLOT_DEFINITIONS).map(slot =>
                            <option key={slot.id} value={String(slot.id)}>{humanize(slot.name)}</option>
                        )}
                    </select>
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label">Rarity</span>
                    <select aria-label="Filter by rarity" value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                        <option value="all">All rarities</option>
                        {Object.values(RARITY_DEFINITIONS).map(rarity =>
                            <option key={rarity.id} value={String(rarity.id)}>{humanize(rarity.name)}</option>
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
    const unique = isUniqueItem(item)
    const statuses = getEffectStatuses(item)
    const effectDescription = item.unique?.description

    return (
        <article className="catalogue-item-card card" data-rarity={item.rarity}>
            <div className="catalogue-item-identity">
                <img className="catalogue-item-image" src={item.itemSrc} alt="" draggable={false} />
                <div className="catalogue-item-heading">
                    <h3 className="catalogue-item-name">{item.name}</h3>
                    {unique && <span className="catalogue-unique-label">Unique Item</span>}
                    <p className="catalogue-item-meta">
                        {humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity")} · {humanize(item.slotLabel ?? "Unknown slot")}
                    </p>
                    {set && <p className="catalogue-item-set">Set: {set.name}</p>}
                </div>
            </div>

            {statuses.length > 0 && (
                <div className="catalogue-statuses" aria-label="Statuses applied by weapon effect">
                    {statuses.map(status => (
                        <img className="catalogue-status-icon" key={status.key} src={status.sprite} alt={status.name} title={status.name} draggable={false} />
                    ))}
                </div>
            )}

            {effectDescription && (
                <section className="catalogue-effect">
                    <h4 className="catalogue-section-label">Unique effect</h4>
                    <p className="catalogue-effect-description">{effectDescription}</p>
                </section>
            )}

            <PerkList perks={item.fixedPerks} label="Fixed perks" />
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
                <h3 className="catalogue-set-name">{set.name}</h3>
                <p className="catalogue-set-meta">
                    {set.pieces} pieces <span aria-hidden="true">·</span> {humanize(getSourceName(set.dropSource))}
                </p>
                {locations.length > 0 && <p className="catalogue-set-locations">Locations: {locations.join(", ")}</p>}
            </header>

            <PerkList perks={set.setBonus} label="Set bonuses" />

            <section className="catalogue-set-pieces">
                <h4 className="catalogue-section-label">Pieces ({pieces.length})</h4>
                {pieces.length > 0
                    ? <ul className="catalogue-piece-list">
                        {pieces.map(item => (
                            <li className="catalogue-piece" key={item.id}>
                                <img className="catalogue-piece-image" src={item.itemSrc} alt="" draggable={false} />
                                <span className="catalogue-piece-name">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                    : <p className="catalogue-muted">No item pieces are currently linked to this set in the item database.</p>
                }
            </section>
        </article>
    )
}

function SubPageDrops({ itemsRef, setsRef }) {
    const [view, setView] = useState("items")
    const [search, setSearch] = useState("")
    const [sourceFilter, setSourceFilter] = useState("all")
    const [slotFilter, setSlotFilter] = useState("all")
    const [rarityFilter, setRarityFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")

    const allItems = useMemo(() => {
        if (!itemsRef) return []
        return Object.entries(itemsRef).flatMap(([slotKey, items]) => {
            if (!Array.isArray(items)) return []
            return items.map(item => ({
                ...item,
                slotLabel: SLOT_NAMES[item.slot] ?? slotKey,
                setLabel: item.set ? (setsRef ?? []).find(set => set.id === item.set)?.name ?? String(item.set) : ""
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
        const searchable = [
            ...getSearchableValues(item),
            item.name,
            item.id,
            item.slotLabel,
            item.setLabel,
            sourceName,
            ...getLocations(item),
            humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity"),
            ...getEffectStatuses(item).map(status => status.name),
            ...(item.fixedPerks ?? []).map(getPerkLabel)
        ].join(" ").toLowerCase()
        const matchesSearch = !query || searchable.includes(query)
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesSlot = slotFilter === "all" || String(item.slot) === slotFilter
        const matchesRarity = rarityFilter === "all" || String(item.rarity) === rarityFilter
        const matchesLocation = locationFilter === "all" || getLocations(item).includes(locationFilter)
        return matchesSearch && matchesSource && matchesSlot && matchesRarity && matchesLocation
    }), [allItems, search, sourceFilter, slotFilter, rarityFilter, locationFilter])

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

    const groupedItems = useMemo(() => {
        const groups = new Map()
        filteredItems.forEach(item => {
            const source = getSourceName(item.dropSource)
            getLocations(item).forEach(location => {
                const key = source + "::" + location
                if (!groups.has(key)) groups.set(key, { source, location, items: [] })
                groups.get(key).items.push(item)
            })
        })
        return [...groups.values()]
            .map(group => ({ ...group, items: [...group.items].sort((a, b) => a.name.localeCompare(b.name)) }))
            .sort((a, b) => a.source.localeCompare(b.source) || a.location.localeCompare(b.location, undefined, { numeric: true }))
    }, [filteredItems])

    const clearFilters = () => {
        setSearch("")
        setSourceFilter("all")
        setSlotFilter("all")
        setRarityFilter("all")
        setLocationFilter("all")
    }

    return (
        <section className="item-catalogue">
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <h2 className="header-big catalogue-title">Item Catalogue</h2>
                    <p className="catalogue-description">
                        Search item names, unique-effect descriptions, fixed perks, set bonuses, rarity, source, location, and other stored item data.
                    </p>
                </div>
                <p className="catalogue-result-count">
                    {view === "items"
                        ? `${filteredItems.length} matching items · ${groupedItems.length} source/location groups`
                        : `${filteredSets.length} matching sets · ${setsRef?.length ?? 0} total sets`}
                </p>
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
                rarityFilter={rarityFilter}
                setRarityFilter={setRarityFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                allSources={allSources}
                allLocations={allLocations}
                view={view}
                clearFilters={clearFilters}
            />

            {view === "items" && (
                <div className="catalogue-results">
                    {groupedItems.length === 0
                        ? <p className="catalogue-empty card">No items match these filters.</p>
                        : groupedItems.map(group => (
                            <section className="catalogue-source-group" key={group.source + "::" + group.location}>
                                <header className="catalogue-group-header">
                                    <h3 className="catalogue-group-title">{group.location}</h3>
                                    <p className="catalogue-group-meta">
                                        {humanize(group.source)} <span aria-hidden="true">·</span> {group.items.length} item{group.items.length === 1 ? "" : "s"}
                                    </p>
                                </header>
                                <div className="catalogue-item-grid">
                                    {group.items.map(item => {
                                        const set = item.set ? (setsRef ?? []).find(candidate => candidate.id === item.set) : null
                                        return <ItemCatalogueCard key={item.id} item={item} set={set} />
                                    })}
                                </div>
                            </section>
                        ))
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
        </section>
    )
}

export default SubPageDrops
