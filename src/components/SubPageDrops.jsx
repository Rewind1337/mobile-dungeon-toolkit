import { useMemo, useState } from "react"
import { DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { perkSprites, statusSprites } from "../database/db_sprites.jsx"
import Button from "./Button.jsx"

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

function getUniqueLabel(item) {
    // Lava Catalyst and Rift Piercer are known unique weapons whose effect metadata
    // is currently missing from UNIQUE_WEAPON_DEFINITIONS.
    return Boolean(item?.isUnique) || (item?.unique !== undefined && item?.unique !== null && item.unique !== 0)
}

function PerkList({ perks, label = "Perks" }) {
    const visiblePerks = (perks ?? []).filter(perk => {
        const key = getPerkKey(perk)
        return key && key !== "NOTHING"
    })
    if (visiblePerks.length === 0) return <div className="text">{label}: none recorded</div>

    return (
        <div className="flex-col" style={{ gap: "4px" }}>
            <div className="text">{label}</div>
            <div className="flex-row flex-wrap" style={{ gap: "5px" }}>
                {visiblePerks.map((perk, index) => {
                    const key = getPerkKey(perk)
                    return (
                        <div className="flex-row card" key={key + "-" + index} title={getPerkLabel(perk)} style={{ alignItems: "center", gap: "5px", padding: "4px 6px" }}>
                            {perkSprites[key] && <img src={perkSprites[key]} alt="" draggable={false} style={{ width: "24px", height: "24px", objectFit: "contain" }} />}
                            <span className="text">{getPerkLabel(perk)}</span>
                        </div>
                    )
                })}
            </div>
        </div>
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
        <section className="card flex-col w-100" style={{ gap: "12px", minWidth: 0 }}>
            <div className="flex-col" style={{ gap: "4px" }}>
                <div className="header-big">Item Catalogue</div>
                <div className="text">
                    Search the item database across item names, unique-effect descriptions, fixed perks, set names and bonuses, rarity, source, location, and other stored item fields.
                </div>
                <div className="text">
                    {view === "items"
                        ? `${filteredItems.length} matching items · ${groupedItems.length} source/location groups`
                        : `${filteredSets.length} matching sets · ${setsRef?.length ?? 0} total sets`}
                </div>
            </div>

            <div className="flex-row flex-wrap" style={{ gap: "8px" }}>
                <Button text="Items" color={5} active={view === "items"} onClick={() => setView("items")} />
                <Button text="Set Overview" color={5} active={view === "sets"} onClick={() => setView("sets")} />
            </div>

            <div className="card flex-row flex-wrap" style={{ alignItems: "center", gap: "8px" }}>
                <input
                    className="selectable"
                    aria-label="Search item catalogue"
                    placeholder="Search any item field or effect description…"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    style={{ minWidth: "220px", flex: "1 1 260px" }}
                />
                <select aria-label="Filter by source" value={sourceFilter} onChange={event => setSourceFilter(event.target.value)}>
                    <option value="all">All sources</option>
                    {allSources.map(source => <option key={source} value={source}>{humanize(source)}</option>)}
                </select>
                <select aria-label="Filter by location" value={locationFilter} onChange={event => setLocationFilter(event.target.value)}>
                    <option value="all">All locations</option>
                    {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                </select>
                {view === "items" && <>
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
                </>}
                <Button text="Clear filters" color={5} onClick={clearFilters} />
            </div>

            {view === "items" && (groupedItems.length === 0
                ? <div className="card text">No items match these filters.</div>
                : groupedItems.map(group => (
                    <section className="card flex-col" key={group.source + "::" + group.location} style={{ gap: "8px" }}>
                        <div className="flex-row" style={{ alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap" }}>
                            <div className="header">{group.location}</div>
                            <div className="text">{humanize(group.source)} · {group.items.length} item{group.items.length === 1 ? "" : "s"}</div>
                        </div>
                        <div className="flex-row flex-wrap" style={{ gap: "8px", alignItems: "stretch" }}>
                            {group.items.map(item => {
                                const set = item.set ? (setsRef ?? []).find(candidate => candidate.id === item.set) : null
                                const unique = getUniqueLabel(item)
                                const statuses = getEffectStatuses(item)
                                const effectDescription = item.unique?.description
                                return (
                                    <article className="card flex-row" key={item.id} data-rarity={item.rarity} style={{ gap: "8px", alignItems: "flex-start", minWidth: "250px", flex: "1 1 300px" }}>
                                        <img src={item.itemSrc} alt="" draggable={false} style={{ width: "58px", height: "58px", objectFit: "contain", flex: "0 0 auto" }} />
                                        <div className="flex-col" style={{ gap: "5px", minWidth: 0, flex: "1 1 auto" }}>
                                            <div className="flex-row flex-wrap" style={{ alignItems: "center", gap: "6px" }}>
                                                <div className="header">{item.name}</div>
                                                {unique && <span className="text">Unique Item</span>}
                                            </div>
                                            <div className="text">{humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity")} · {humanize(item.slotLabel ?? "Unknown slot")}</div>
                                            {set && <div className="text">Set: {set.name}</div>}
                                            {statuses.length > 0 && (
                                                <div className="flex-row flex-wrap" style={{ gap: "5px", alignItems: "center" }} aria-label="Statuses applied by weapon effect">
                                                    {statuses.map(status => (
                                                        <img key={status.key} src={status.sprite} alt={status.name} title={status.name} draggable={false} style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                                                    ))}
                                                </div>
                                            )}
                                            {effectDescription && <div className="text">{effectDescription}</div>}
                                            <PerkList perks={item.fixedPerks} label="Fixed perks" />
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </section>
                ))
            )}

            {view === "sets" && (filteredSets.length === 0
                ? <div className="card text">No sets match these filters.</div>
                : <div className="flex-row flex-wrap" style={{ gap: "8px", alignItems: "stretch" }}>
                    {filteredSets.map(set => {
                        const pieces = allItems.filter(item => item.set === set.id)
                        const locations = set.dropLocation !== undefined ? getLocations(set) : [...new Set(pieces.flatMap(getLocations))]
                        return (
                            <article className="card flex-col" key={set.id} style={{ gap: "8px", flex: "1 1 300px", minWidth: 0 }}>
                                <div className="header">{set.name}</div>
                                <div className="text">{set.pieces} pieces · {humanize(getSourceName(set.dropSource))}</div>
                                {locations.length > 0 && <div className="text">Locations: {locations.join(", ")}</div>}
                                <div className="header">Set bonuses</div>
                                <PerkList perks={set.setBonus} label="Bonuses" />
                                <div className="header">Pieces ({pieces.length})</div>
                                {pieces.length > 0
                                    ? <div className="flex-col" style={{ gap: "4px" }}>
                                        {pieces.map(item => (
                                            <div className="flex-row" key={item.id} style={{ alignItems: "center", gap: "7px" }}>
                                                <img src={item.itemSrc} alt="" draggable={false} style={{ width: "34px", height: "34px", objectFit: "contain" }} />
                                                <span className="text">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    : <div className="text">No item pieces are currently linked to this set in the item database.</div>
                                }
                            </article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default SubPageDrops
