import { useMemo, useState } from "react"

import { ATTRIBUTE_DEFINITIONS, DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { attributeSprites, iconSprites, perkSprites, statusSprites } from "../database/db_sprites.jsx"
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
const SLOT_ICON_KEYS = { WEAPON: "weapons", HELMET: "helmets", ARMOR: "armors", NECKLACE: "necklaces", RING: "rings" }
const ATTRIBUTE_ICON_KEYS = { strength: 1, dexterity: 2, intelligence: 3 }

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

function getSetLocations(set, pieces) {
    const rawLocation = set?.dropLocation
    if (rawLocation !== undefined && rawLocation !== null && rawLocation !== "") {
        return getLocations(set)
    }
    const inheritedLocations = [...new Set(pieces.flatMap(getLocations))]
        .filter(location => location !== "Unspecified location")
    return inheritedLocations.length > 0 ? inheritedLocations : ["Unspecified location"]
}

function getSourceName(source) {
    if (source === null || source === undefined || source === "") return "Unspecified source"
    const name = getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(source)) ?? String(source)
    return name.toLowerCase() === "everywhere" ? "Any Dungeon" : humanize(name)
}

function getDropSourceLabel(source, locations) {
    const locationNames = (locations ?? []).filter(location => location && location !== "Unspecified location")
    const locationLabel = locationNames.length > 0 ? locationNames.join(", ") : "Unspecified"
    const sourceName = getSourceName(source)
    if (sourceName.toLowerCase().includes("guild hunt")) return `Drop Source: ${locationLabel} (GH)`
    if (locationNames.length > 0) return `Drop Source: ${locationLabel}`
    return "Drop Source: Unspecified"
}

function getAttributeRequirementLabel(value) {
    if (value === null || value === undefined || value === "") return "Not specified"
    const name = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(value))
    return !name || name === "NONE" ? "None" : humanize(name)
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
            <div className="catalogue-section-label text">{label}</div>
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
    resultCount,
    totalCount,
    clearFilters
}) {
    return (
        <div className={`catalogue-filters card${view === "sets" ? " is-set-view" : ""}`}>
            <label className="catalogue-search">
                <span className="catalogue-control-label text">Search {view === "sets" ? "sets" : "items"} ({resultCount} of {totalCount} {view === "sets" ? "sets" : "items"})</span>
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
                <Button text="Clear filters" color={"cancel"} onClick={clearFilters} />
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
                    <div className="catalogue-item-name catalogue-chip catalogue-chip-name header text">{item.name}</div>
                    <div className="catalogue-item-meta-row">
                        <div className="catalogue-item-meta text">
                            <span className="catalogue-chip text">
                                {iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]] && <img className="catalogue-chip-icon" src={iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]]} alt="" />}
                                {humanize(item.slotLabel ?? "Unknown slot")}
                            </span>
                            <span className={`catalogue-chip text catalogue-chip-attribute ${getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("strength") ? "catalogue-chip-attribute-strength" : getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("dexterity") ? "catalogue-chip-attribute-dexterity" : getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("intelligence") ? "catalogue-chip-attribute-intelligence" : ""}`}>
                                {attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]] && <img className="catalogue-chip-icon" src={attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]]} alt="" />}
                                Attribute: {getAttributeRequirementLabel(item.attributeRequirement)}
                            </span>
                            {set && <p className="catalogue-item-set catalogue-chip text">Set: {set.name}</p>}
                        </div>
                    </div>
                    <div className="catalogue-item-source-row text">
                        <p className="catalogue-item-source"><span className="catalogue-chip text">{getDropSourceLabel(item.dropSource, getLocations(item))}</span></p>
                    </div>
                </div>
            </div>

            {effectDescription && (
                <section className="catalogue-effect card">
                    <div className="catalogue-section-label text flex-row">
                        {statuses.length > 0 && (
                            <div className="catalogue-statuses" aria-label="Statuses applied by weapon effect">
                                {statuses.map(status => (
                                    <img className="catalogue-status-icon" key={status.key} src={status.sprite} alt={status.name} title={status.name} draggable={false} />
                                ))}
                            </div>
                        )}
                        <div className="text">Unique Effect</div>
                    </div>
                    <p className="catalogue-effect-description text">{effectDescription}</p>
                </section>
            )}

            <PerkList perks={item.fixedPerks} label="Fixed perks" />
            {set && <PerkList perks={set.setBonus} label="Set bonuses" />}
        </article>
    )
}

function SetCatalogueCard({ set, pieces }) {
    const locations = getSetLocations(set, pieces)
    const attributeLabel = getAttributeRequirementLabel(set.attributeRequirement)
    const attributeKey = ATTRIBUTE_ICON_KEYS[attributeLabel.toLowerCase()]
    const attributeClass = attributeLabel.toLowerCase().includes("strength")
        ? "catalogue-chip-attribute-strength"
        : attributeLabel.toLowerCase().includes("dexterity")
            ? "catalogue-chip-attribute-dexterity"
            : attributeLabel.toLowerCase().includes("intelligence")
                ? "catalogue-chip-attribute-intelligence"
                : ""

    return (
        <article className="catalogue-set-card card">
            <header className="catalogue-set-header">
                <div className="catalogue-set-name catalogue-chip catalogue-chip-name header text">{set.name}</div>
                <section className="catalogue-set-pieces">
                    <div className="catalogue-section-label text">Pieces ({pieces.length})</div>
                    {pieces.length > 0
                        ? <ul className="catalogue-piece-list">
                            {pieces.map(item => (
                                <li className="catalogue-piece card" key={item.id}>
                                    <img className="catalogue-piece-image" src={item.itemSrc} alt="" draggable={false} />
                                    <span className="catalogue-piece-name text">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                        : <p className="catalogue-muted">No item pieces are currently linked to this set in the item database.</p>
                    }
                </section>
                <p className={`catalogue-set-requirement catalogue-chip text catalogue-chip-attribute ${attributeClass}`}>
                    {attributeSprites[attributeKey] && <img className="catalogue-chip-icon" src={attributeSprites[attributeKey]} alt="" />}
                    Attribute: {attributeLabel}
                </p>
                <div className="catalogue-set-meta flex-row justify-center text">
                    <span className="catalogue-chip text">{getDropSourceLabel(set.dropSource, locations)}</span>
                </div>
            </header>
            <PerkList perks={set.setBonus} label="Set bonuses" />
        </article>
    )
}

function CatalogueItem({ itemsRef, setsRef, initialView = "items", onViewChange }) {
    const [view, setView] = useState(initialView)
    const changeView = nextView => { setView(nextView); onViewChange?.(nextView) }
    const [search, setSearch] = useState("")
    const [sourceFilter, setSourceFilter] = useState("all")
    const [slotFilter, setSlotFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")

    const setsById = useMemo(() => new Map((setsRef ?? []).map(set => [set.id, set])), [setsRef])

    const allItems = useMemo(() => {
        if (!itemsRef) return []
        return Object.entries(itemsRef).flatMap(([slotKey, items]) => {
            if (!Array.isArray(items)) return []
            return items.map(item => {
                const set = item.set ? setsById.get(item.set) : null
                return {
                    ...item,
                    slotLabel: SLOT_NAMES[item.slot] ?? slotKey,
                    setLabel: set?.name ?? (item.set ? String(item.set) : ""),
                    setBonusLabels: (set?.setBonus ?? []).map(getPerkLabel)
                }
            })
        })
    }, [itemsRef, setsById])

    const allLocations = useMemo(() => {
        const locations = new Set()
        allItems.forEach(item => getLocations(item).forEach(location => locations.add(location)))
        const itemsBySet = new Map()
        allItems.forEach(item => {
            if (!item.set) return
            if (!itemsBySet.has(item.set)) itemsBySet.set(item.set, [])
            itemsBySet.get(item.set).push(item)
        })
        ;(setsRef ?? []).forEach(set => {
            getSetLocations(set, itemsBySet.get(set.id) ?? []).forEach(location => locations.add(location))
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
            getAttributeRequirementLabel(item.attributeRequirement),
            item.setLabel,
            sourceName,
            ...getLocations(item),
            humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity"),
            ...getEffectStatuses(item).map(status => status.name),
            ...(item.fixedPerks ?? []).flatMap(perk => [getPerkLabel(perk), getPerkKey(perk)]),
            ...(item.setBonusLabels ?? [])
        ].join(" ").toLowerCase()
        const matchesSearch = !query || (query === "unique" ? unique : query === "not unique" ? !unique : searchable.includes(query))
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesSlot = slotFilter === "all" || String(item.slot) === slotFilter
        const matchesLocation = locationFilter === "all" || getLocations(item).includes(locationFilter)
        return matchesSearch && matchesSource && matchesSlot && matchesLocation
    }), [allItems, search, sourceFilter, slotFilter, locationFilter])

    const itemsBySet = useMemo(() => {
        const grouped = new Map()
        allItems.forEach(item => {
            if (!item.set) return
            if (!grouped.has(item.set)) grouped.set(item.set, [])
            grouped.get(item.set).push(item)
        })
        return grouped
    }, [allItems])

    const filteredSets = useMemo(() => (setsRef ?? []).filter(set => {
        const query = search.trim().toLowerCase()
        const sourceName = getSourceName(set.dropSource)
        const pieces = itemsBySet.get(set.id) ?? []
        const locations = getSetLocations(set, pieces)
        const searchable = [
            ...getSearchableValues(set),
            set.name,
            set.id,
            getAttributeRequirementLabel(set.attributeRequirement),
            sourceName,
            ...locations,
            ...(set.setBonus ?? []).flatMap(perk => [getPerkLabel(perk), getPerkKey(perk)]),
            ...pieces.flatMap(item => [
                ...getSearchableValues(item),
                item.name,
                getAttributeRequirementLabel(item.attributeRequirement),
                humanize(RARITY_NAMES[item.rarity] ?? "Unknown rarity"),
                getSourceName(item.dropSource),
                ...getLocations(item),
                ...(item.fixedPerks ?? []).flatMap(perk => [getPerkLabel(perk), getPerkKey(perk)]),
                ...getEffectStatuses(item).map(status => status.name)
            ])
        ].join(" ").toLowerCase()
        const matchesSearch = !query || searchable.includes(query)
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesLocation = locationFilter === "all" || locations.includes(locationFilter)
        return matchesSearch && matchesSource && matchesLocation
    }), [setsRef, search, sourceFilter, locationFilter, itemsBySet])

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
                    <div className="catalogue-title header-big">{view === "sets" ? "Set Catalogue" : "Item Catalogue"}</div>
                    <p className="catalogue-description text">
                        Search item names, unique-effect descriptions, fixed perks, set bonuses, rarity, source, location, and other stored item data.
                    </p>
                </div>
            </header>

            <nav className="catalogue-view-switch" aria-label="Catalogue view">
                <Button text="Item Catalogue" color={5} active={view === "items"} onClick={() => changeView("items")} />
                <Button text="Set Catalogue" color={5} active={view === "sets"} onClick={() => changeView("sets")} />
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
                resultCount={view === "sets" ? filteredSets.length : filteredItems.length}
                totalCount={view === "sets" ? (setsRef ?? []).length : allItems.length}
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
                                    const set = item.set ? setsById.get(item.set) ?? null : null
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
                        : filteredSets.map(set => (
                            <SetCatalogueCard key={set.id} set={set} pieces={itemsBySet.get(set.id) ?? []} />
                        ))
                    }
                </div>
            )}
        </section>
    )
}

export default CatalogueItem
