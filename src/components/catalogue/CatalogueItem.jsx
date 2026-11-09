import { useEffect, useMemo, useState } from "react"

import { getSearchableValues, matchesSearchQuery, useUrlSearch } from "../../js/search.jsx"
import { humanizeName } from "../../js/utils.js"
import { useTranslate } from "../../hooks/useTranslate.jsx"
import { useContentTranslation } from "../../hooks/useContentTranslation.jsx"
import { SLOT_NAMES, RARITY_NAMES, getLocations, getSetLocations, getSourceName, getAttributeRequirementLabel, getPerkKey, getPerkLabel, getEffectStatuses, isUniqueItem } from "../../js/catalogueItemUtils.jsx"
import ItemCatalogueCard from "../ItemCatalogueCard.jsx"
import SetCatalogueCard from "../SetCatalogueCard.jsx"
import CatalogueViewSwitch from "../CatalogueViewSwitch.jsx"
import CatalogueItemFilters from "../CatalogueItemFilters.jsx"
import VirtualizedGrid from "../VirtualizedGrid.jsx"

import "../../css/item.scss"
import "../../css/infos.scss"
import "../../css/infos_items.scss"

function CatalogueItem({ itemsRef, setsRef, initialView = "items", initialFilter = null, onViewChange, scrollElementRef }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const [view, setView] = useState(initialView)
    const [search, setSearch, commitSearch] = useUrlSearch()
    const changeView = nextView => {
        setView(nextView)
        onViewChange?.(nextView)
    }
    const [sourceFilter, setSourceFilter] = useState("all")
    const [slotFilter, setSlotFilter] = useState("all")
    const [attributeFilter, setAttributeFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")
    const [setMainAttributeFilter, setSetMainAttributeFilter] = useState("all")
    const [setPieceCountFilter, setSetPieceCountFilter] = useState("all")
    const [filtersVisible, setFiltersVisible] = useState(true)

    useEffect(() => {
        if (!initialFilter) return
        if (initialFilter.slot !== undefined) setSlotFilter(String(initialFilter.slot))
        if (initialFilter.attribute !== undefined) setAttributeFilter(String(initialFilter.attribute))
    }, [initialFilter])

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
        ...(setsRef ?? []).filter(set => set.dropSource !== undefined && set.dropSource !== null).map(set => getSourceName(set.dropSource))
    ])].filter(source => source !== "Unspecified source").sort(), [allItems, setsRef])

    const filteredItems = useMemo(() => allItems.filter(item => {
        const sourceName = getSourceName(item.dropSource)
        const unique = isUniqueItem(item)
        const searchable = [
            ...getSearchableValues(item),
            unique ? "unique" : "not unique",
            item.name,
            tc("item", item.id, "name", item.name),
            item.id,
            item.slotLabel,
            getAttributeRequirementLabel(item.attributeRequirement),
            item.setLabel,
            sourceName,
            ...getLocations(item),
            humanizeName(RARITY_NAMES[item.rarity] ?? "Unknown rarity"),
            ...getEffectStatuses(item).flatMap(status => [status.name, tc("status", status.key, "name", status.name)]),
            ...(item.fixedPerks ?? []).flatMap(perk => [getPerkLabel(perk), tc("perk", getPerkKey(perk), "name", getPerkLabel(perk)), getPerkKey(perk)]),
            ...(item.setBonusLabels ?? [])
        ].join(" ").toLowerCase()
        const matchesSearch = matchesSearchQuery(searchable, search, term => {
            if (term === "unique") return unique
            if (term === "not unique") return !unique
            return undefined
        })
        const matchesSource = sourceFilter === "all" || sourceName === sourceFilter
        const matchesSlot = slotFilter === "all" || String(item.slot) === slotFilter
        const matchesAttribute = attributeFilter === "all" || String(item.mainAttribute) === attributeFilter
        const matchesLocation = locationFilter === "all" || getLocations(item).includes(locationFilter)
        return matchesSearch && matchesSource && matchesSlot && matchesAttribute && matchesLocation
    }), [allItems, search, sourceFilter, slotFilter, attributeFilter, locationFilter, tc])

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
        const pieces = itemsBySet.get(set.id) ?? []
        const sourceIds = set.dropSource !== undefined && set.dropSource !== null
            ? [set.dropSource]
            : pieces.map(item => item.dropSource).filter(source => source !== undefined && source !== null)
        const sourceNames = [...new Set(sourceIds.map(getSourceName))]
        const locations = getSetLocations(set, pieces)
        const searchable = [
            ...getSearchableValues(set),
            set.name,
            tc("set", set.id, "name", set.name),
            set.id,
            getAttributeRequirementLabel(set.attributeRequirement),
            ...sourceNames,
            ...locations,
            ...(set.setBonus ?? []).flatMap(perk => [getPerkLabel(perk), tc("perk", getPerkKey(perk), "name", getPerkLabel(perk)), getPerkKey(perk)]),
            ...pieces.flatMap(item => [
                ...getSearchableValues(item),
                item.name,
                tc("item", item.id, "name", item.name),
                getAttributeRequirementLabel(item.attributeRequirement),
                humanizeName(RARITY_NAMES[item.rarity] ?? "Unknown rarity"),
                getSourceName(item.dropSource),
                ...getLocations(item),
                ...(item.fixedPerks ?? []).flatMap(perk => [getPerkLabel(perk), tc("perk", getPerkKey(perk), "name", getPerkLabel(perk)), getPerkKey(perk)]),
                ...getEffectStatuses(item).flatMap(status => [status.name, tc("status", status.key, "name", status.name)])
            ])
        ].join(" ").toLowerCase()
        const matchesSearch = matchesSearchQuery(searchable, search)
        const matchesSource = sourceFilter === "all" || sourceNames.includes(sourceFilter)
        const matchesLocation = locationFilter === "all" || locations.includes(locationFilter)
        const matchesSetAttribute = setMainAttributeFilter === "all" || String(set.mainAttribute) === setMainAttributeFilter
        const matchesSetPieces = setPieceCountFilter === "all" || String(set.pieces) === setPieceCountFilter
        return matchesSearch && matchesSource && matchesLocation && matchesSetAttribute && matchesSetPieces
    }), [setsRef, search, sourceFilter, locationFilter, itemsBySet, setMainAttributeFilter, setPieceCountFilter, tc])

    const sortedItems = useMemo(
        () => filteredItems.slice().sort((a, b) => tc("item", a.id, "name", a.name).localeCompare(tc("item", b.id, "name", b.name))),
        [filteredItems, tc]
    )

    const clearFilters = () => {
        setSearch("")
        commitSearch("")
        setSourceFilter("all")
        setSlotFilter("all")
        setAttributeFilter("all")
        setLocationFilter("all")
        setSetMainAttributeFilter("all")
        setSetPieceCountFilter("all")
    }

    return (
        <section className="item-catalogue">
            <CatalogueViewSwitch view={view} onViewChange={changeView} options={[
                { label: t("app.pages.catalogues.itemTitle"), value: "items" },
                { label: t("app.pages.catalogues.setTitle"), value: "sets" },
            ]} />

            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">{view === "sets" ? t("app.pages.catalogues.setTitle") : t("app.pages.catalogues.itemTitle")}</div>
                    <p className="catalogue-description text">
                        {view === "sets"
                            ? t("app.pages.catalogues.setDescription")
                            : t("app.pages.catalogues.itemDescription")}
                    </p>
                </div>
            </header>

            <CatalogueItemFilters
                search={search}
                setSearch={setSearch}
                onSearchBlur={() => commitSearch(search)}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                slotFilter={slotFilter}
                setSlotFilter={setSlotFilter}
                attributeFilter={attributeFilter}
                setAttributeFilter={setAttributeFilter}
                setAttributeFilterForSets={setSetMainAttributeFilter}
                setMainAttributeFilter={setMainAttributeFilter}
                setPieceCountFilter={setSetPieceCountFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                allSources={allSources}
                allLocations={allLocations}
                view={view}
                resultCount={view === "sets" ? filteredSets.length : filteredItems.length}
                totalCount={view === "sets" ? (setsRef ?? []).length : allItems.length}
                clearFilters={clearFilters}
                filtersVisible={filtersVisible}
                onHideFilters={() => setFiltersVisible(false)}
                onShowFilters={() => setFiltersVisible(true)}
            />

            {view === "items" && (
                <div className="catalogue-results">
                    {filteredItems.length === 0
                        ? <p className="catalogue-empty card">{t("app.pages.catalogues.noItemsMatch")}</p>
                        : <VirtualizedGrid
                            items={sortedItems}
                            scrollElementRef={scrollElementRef}
                            minColumnWidth={340}
                            maxColumns={3}
                            estimatedRowHeight={390}
                            rowGap={10}
                            columnGap={10}
                            alignItems="stretch"
                            className="catalogue-item-grid-spacer"
                            rowClassName="catalogue-item-grid-row"
                            renderItem={item => {
                                const set = item.set ? setsById.get(item.set) ?? null : null
                                return <ItemCatalogueCard item={item} set={set} />
                            }}
                        />
                    }
                </div>
            )}

            {view === "sets" && (
                <div className="catalogue-results">
                    {filteredSets.length === 0
                        ? <p className="catalogue-empty card">{t("app.pages.catalogues.noSetsMatch")}</p>
                        : <VirtualizedGrid
                            items={filteredSets}
                            scrollElementRef={scrollElementRef}
                            minColumnWidth={340}
                            maxColumns={3}
                            estimatedRowHeight={440}
                            rowGap={10}
                            columnGap={10}
                            alignItems="stretch"
                            className="catalogue-set-grid-spacer"
                            rowClassName="catalogue-set-grid-row"
                            renderItem={set => <SetCatalogueCard set={set} pieces={itemsBySet.get(set.id) ?? []} />}
                        />
                    }
                </div>
            )}
        </section>
    )
}

export default CatalogueItem
