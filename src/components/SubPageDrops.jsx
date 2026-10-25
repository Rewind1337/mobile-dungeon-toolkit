import { useMemo, useState } from "react"
import Button from "./Button.jsx"
import { DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"

const SLOT_NAMES = Object.fromEntries(
    Object.values(EQUIPMENT_SLOT_DEFINITIONS).map(({ id, name }) => [id, name])
)

const RARITY_NAMES = Object.fromEntries(
    Object.values(RARITY_DEFINITIONS).map(({ id, name }) => [id, name])
)

const SOURCE_NAMES = Object.fromEntries(
    Object.values(DROP_SOURCE_DEFINITIONS).map(({ id, name }) => [id, name])
)

const humanize = (value) => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

function getLocations(item) {
    const raw = item.dropLocation
    if (Array.isArray(raw)) return raw.map(value => String(value)).filter(Boolean)
    if (raw === null || raw === undefined || raw === "") return ["Unspecified location"]
    return [String(raw)]
}

function getSourceName(source) {
    if (source === null || source === undefined || source === "") return "Unspecified source"
    const enumName = getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(source))
    return enumName ?? SOURCE_NAMES[source] ?? String(source)
}

function SubPageDrops({ itemsRef, setsRef }) {
    const [search, setSearch] = useState("")
    const [sourceFilter, setSourceFilter] = useState("all")
    const [slotFilter, setSlotFilter] = useState("all")
    const [rarityFilter, setRarityFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")

    const allItems = useMemo(() => {
        if (!itemsRef) return []
        return Object.entries(itemsRef).flatMap(([slotKey, items]) => {
            if (!Array.isArray(items)) return []
            return items.map(item => ({ ...item, slotLabel: SLOT_NAMES[item.slot] ?? slotKey }))
        })
    }, [itemsRef])

    const allLocations = useMemo(() => {
        const locations = new Set()
        allItems.forEach(item => getLocations(item).forEach(location => locations.add(location)))
        return [...locations].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    }, [allItems])

    const filteredItems = useMemo(() => allItems.filter(item => {
        const query = search.trim().toLowerCase()
        const sourceName = getSourceName(item.dropSource)
        const setName = item.set
            ? (setsRef ?? []).find(set => set.id === item.set)?.name ?? String(item.set)
            : ""
        const matchesSearch = !query || [item.name, item.id, setName, ...getLocations(item), sourceName]
            .some(value => String(value ?? "").toLowerCase().includes(query))
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesSlot = slotFilter === "all" || String(item.slot) === slotFilter
        const matchesRarity = rarityFilter === "all" || String(item.rarity) === rarityFilter
        const matchesLocation = locationFilter === "all" || getLocations(item).includes(locationFilter)
        return matchesSearch && matchesSource && matchesSlot && matchesRarity && matchesLocation
    }), [allItems, search, sourceFilter, slotFilter, rarityFilter, locationFilter, setsRef])

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
        <section className="card flex-col w-100" style={{ gap: "12px", minWidth: 0 }}>
            <div className="flex-col" style={{ gap: "4px" }}>
                <div className="header-big">Item Drop Catalogue</div>
                <div className="text">
                    Browse the items recorded in the database by their configured drop source and location.
                    Location values are shown as stored (including chapter/dungeon codes); they are not expanded into names unless the data defines them.
                </div>
                <div className="text">{filteredItems.length} matching items · {groupedItems.length} source/location groups</div>
            </div>

            <div className="card flex-row flex-wrap" style={{ alignItems: "center", gap: "8px" }}>
                <input
                    className="selectable"
                    aria-label="Search drop catalogue"
                    placeholder="Search item, set, source, or location…"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    style={{ minWidth: "220px", flex: "1 1 260px" }}
                />
                <select aria-label="Filter by source" value={sourceFilter} onChange={event => setSourceFilter(event.target.value)}>
                    <option value="all">All sources</option>
                    {[...new Set(allItems.map(item => getSourceName(item.dropSource)))].sort().map(source =>
                        <option key={source} value={source}>{humanize(source)}</option>
                    )}
                </select>
                <select aria-label="Filter by location" value={locationFilter} onChange={event => setLocationFilter(event.target.value)}>
                    <option value="all">All locations</option>
                    {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                </select>
                <select aria-label="Filter by slot" value={slotFilter} onChange={event => setSlotFilter(event.target.value)}>
                    <option value="all">All slots</option>
                    {Object.values(EQUIPMENT_SLOT_DEFINITIONS).map(slot =>
                        <option key={slot.id} value={String(slot.id)}>{humanize(slot.name)}</option>
                    )}
                </select>
                <select aria-label="Filter by rarity" value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                    <option value="all">All rarities</option>
                    {Object.values(RARITY_DEFINITIONS).map(rarity =>
                        <option key={rarity.id} value={String(rarity.id)}>{humanize(rarity.name)}</option>
                    )}
                </select>
                <Button text="Clear filters" color={5} onClick={clearFilters} />
            </div>

            {groupedItems.length === 0 ? (
                <div className="card text">No items match these filters.</div>
            ) : groupedItems.map(group => (
                <section className="card flex-col" key={group.source + "::" + group.location} style={{ gap: "8px" }}>
                    <div className="flex-row" style={{ alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap" }}>
                        <div className="header">{group.location}</div>
                        <div className="text">{humanize(group.source)} · {group.items.length} item{group.items.length === 1 ? "" : "s"}</div>
                    </div>
                    <div className="flex-row flex-wrap" style={{ gap: "8px", alignItems: "stretch" }}>
                        {group.items.map(item => {
                            const set = item.set ? (setsRef ?? []).find(candidate => candidate.id === item.set) : null
                            return (
                                <div className="card flex-row" key={item.id} data-rarity={item.rarity} style={{ gap: "8px", alignItems: "center", minWidth: "210px", flex: "1 1 230px" }}>
                                    <img src={item.itemSrc} alt="" draggable={false} style={{ width: "54px", height: "54px", objectFit: "contain", flex: "0 0 auto" }} />
                                    <div className="flex-col" style={{ gap: "3px", minWidth: 0 }}>
                                        <div className="header">{item.name}</div>
                                        <div className="text">{humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity")} · {humanize(item.slotLabel ?? "Unknown slot")}</div>
                                        {set && <div className="text">Set: {set.name}</div>}
                                        {item.unique && item.unique !== "NOTHING" && <div className="text">Unique item</div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            ))}
        </section>
    )
}

export default SubPageDrops
