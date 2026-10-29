import { useMemo, useState } from "react"

import { EQUIPMENT_SLOT_DEFINITIONS } from "../database/enums.jsx"
import { getSearchableValues, matchesSearchQuery, useUrlSearch } from "../js/search.jsx"
import { humanize } from "../js/util.jsx"
import { SLOT_NAMES, RARITY_NAMES, getLocations, getSetLocations, getSourceName, getAttributeRequirementLabel, getPerkKey, getPerkLabel, getEffectStatuses, isUniqueItem } from "../js/catalogueItemUtils.jsx"
import ItemCatalogueCard from "./ItemCatalogueCard.jsx"
import SetCatalogueCard from "./SetCatalogueCard.jsx"
import CatalogueViewSwitch from "./CatalogueViewSwitch.jsx"
import Button from "./Button.jsx"

import "../css/item.scss"
import "../css/infos.scss"
import "../css/infos_items.scss"

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
    clearFilters,
    onSearchBlur
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
                    onBlur={onSearchBlur}
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

function CatalogueItem({ itemsRef, setsRef, initialView = "items", onViewChange }) {
    const [view, setView] = useState(initialView)
    const [search, setSearch, commitSearch] = useUrlSearch()
    const changeView = nextView => {
        setView(nextView)
        onViewChange?.(nextView)
    }
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
        const matchesSearch = matchesSearchQuery(searchable, search, term => {
            if (term === "unique") return unique
            if (term === "not unique") return !unique
            return undefined
        })
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
        const matchesSearch = matchesSearchQuery(searchable, search)
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesLocation = locationFilter === "all" || locations.includes(locationFilter)
        return matchesSearch && matchesSource && matchesLocation
    }), [setsRef, search, sourceFilter, locationFilter, itemsBySet])

    const clearFilters = () => {
        setSearch("")
        commitSearch("")
        setSourceFilter("all")
        setSlotFilter("all")
        setLocationFilter("all")
    }

    return (
        <section className="item-catalogue">
            <CatalogueViewSwitch ariaLabel="Catalogue view" view={view} onViewChange={changeView} options={[
                { label: "Item Catalogue", value: "items" },
                { label: "Set Catalogue", value: "sets" },
            ]} />

            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{view === "sets" ? "Set Catalogue" : "Item Catalogue"}</div>
                    <p className="catalogue-description text">
                        {view === "sets"
                            ? "Browse item sets, their required attributes, drop locations, set pieces, and set bonuses."
                            : "Search item names, unique-effect descriptions, fixed perks, rarity, drop source, location, and other stored item data."}
                    </p>
                </div>
            </header>

            <CatalogueFilters
                search={search}
                setSearch={setSearch}
                onSearchBlur={() => commitSearch(search)}
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
