import {
    ATTRIBUTE_DEFINITIONS,
    EQUIPMENT_SLOT_DEFINITIONS,
    PRIMARY_STAT_DEFINITIONS,
    RARITY_DEFINITIONS
} from "../database/enums.jsx"
import { humanize } from "../js/util.jsx"
import CatalogueFilterActions from "./CatalogueFilterActions.jsx"

function CatalogueItemFilters({
    search,
    setSearch,
    onSearchBlur,
    sourceFilter = "all",
    setSourceFilter,
    slotFilter = "all",
    setSlotFilter,
    attributeFilter = "all",
    setAttributeFilter,
    setAttributeFilterForSets,
    setMainAttributeFilter,
    setPieceCountFilter,
    locationFilter = "all",
    setLocationFilter,
    allSources = [],
    allLocations = [],
    view = "items",
    resultCount,
    totalCount,
    clearFilters,
    onHideFilters,
    onShowFilters,
    filtersVisible = true,
    topOffset,
    isListView = false,
    showSlotFilter = true,
    attributeLabel = "Main attribute",
    rarityFilter,
    setRarityFilter,
    itemCategoryFilter,
    setItemCategoryFilter,
    sortOrder,
    onSortChange
}) {
    if (!filtersVisible) {
        return <CatalogueFilterActions filtersVisible={false} onShow={onShowFilters} />
    }

    const className = [
        "catalogue-filters",
        "card",
        view === "sets" ? "is-set-view" : "",
        isListView ? "is-list-view" : "",
        isListView && !showSlotFilter ? "is-slot-specific" : ""
    ].filter(Boolean).join(" ")

    return (
        <div className={className} style={topOffset ? { top: topOffset } : undefined}>
            <label className="catalogue-search">
                <span className="catalogue-control-label text">
                    Search ({resultCount} of {totalCount})
                </span>
                <input
                    className="selectable catalogue-input"
                    aria-label="Search item catalogue"
                    placeholder="Name, effect text, perk, set, source, ID…"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onBlur={onSearchBlur}
                />
            </label>

            {isListView && onSortChange && (
                <label className="catalogue-filter catalogue-filter-sort">
                    <span className="catalogue-control-label text">Sort Order</span>
                    <select aria-label="Sort order" value={sortOrder} onChange={event => onSortChange(event.target.value)}>
                        <option value="alphabetic">Alphabetic</option>
                        <option value="rarity">Rarity</option>
                        <option value="level">Level</option>
                    </select>
                </label>
            )}

            {!isListView && (
                <>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">Source</span>
                        <select aria-label="Filter by source" value={sourceFilter} onChange={event => setSourceFilter?.(event.target.value)}>
                            <option value="all">All sources</option>
                            {allSources.map(source => <option key={source} value={source}>{humanize(source)}</option>)}
                        </select>
                    </label>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">Location</span>
                        <select aria-label="Filter by location" value={locationFilter} onChange={event => setLocationFilter?.(event.target.value)}>
                            <option value="all">All locations</option>
                            {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                        </select>
                    </label>
                </>
            )}

            {view === "items" && showSlotFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Slot</span>
                    <select aria-label="Filter by slot" value={slotFilter} onChange={event => setSlotFilter?.(event.target.value)}>
                        <option value="all">All slots</option>
                        {Object.values(EQUIPMENT_SLOT_DEFINITIONS)
                            .filter(slot => slot.id !== EQUIPMENT_SLOT_DEFINITIONS.OTHER.id)
                            .map(slot => <option key={slot.id} value={String(slot.id)}>{humanize(slot.name)}</option>)}
                    </select>
                </label>
            )}

            {view === "items" && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{attributeLabel}</span>
                    <select aria-label={`Filter by ${attributeLabel.toLowerCase()}`} value={attributeFilter} onChange={event => setAttributeFilter?.(event.target.value)}>
                        <option value="all">All attributes</option>
                        {Object.values(isListView ? ATTRIBUTE_DEFINITIONS : PRIMARY_STAT_DEFINITIONS)
                            .filter(attribute => attribute.name !== "NONE")
                            .map(attribute => <option key={attribute.id} value={String(attribute.id)}>{humanize(attribute.name)}</option>)}
                    </select>
                </label>
            )}

            {view === "sets" && (
                <>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">Set attribute</span>
                        <select aria-label="Filter sets by main attribute" value={setMainAttributeFilter ?? "all"} onChange={event => setAttributeFilterForSets?.(event.target.value)}>
                            <option value="all">All attributes</option>
                            {Object.values(PRIMARY_STAT_DEFINITIONS).map(attribute =>
                                <option key={attribute.id} value={String(attribute.id)}>{humanize(attribute.name)}</option>
                            )}
                        </select>
                    </label>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">Set pieces</span>
                        <select aria-label="Filter by set size" value={setPieceCountFilter} onChange={event => setPieceCountFilter?.(event.target.value)}>
                            <option value="all">All sets</option>
                            <option value="2">2 Piece Sets</option>
                            <option value="4">4 Piece Sets</option>
                        </select>
                    </label>
                </>
            )}

            {isListView && setItemCategoryFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Item type</span>
                    <select aria-label="Filter by item type" value={itemCategoryFilter} onChange={event => setItemCategoryFilter(event.target.value)}>
                        <option value="all">All items</option>
                        <option value="twoset">2-piece set</option>
                        <option value="fourset">4-piece set</option>
                        <option value="unique">Unique</option>
                    </select>
                </label>
            )}

            {isListView && setRarityFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Rarity</span>
                    <select aria-label="Filter by rarity" value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                        <option value="all">All rarities</option>
                        {Object.values(RARITY_DEFINITIONS).map(rarity =>
                            <option key={rarity.id} value={String(rarity.id)}>{humanize(rarity.name)}</option>
                        )}
                    </select>
                </label>
            )}

            <CatalogueFilterActions filtersVisible onHide={onHideFilters} onClear={clearFilters} />
        </div>
    )
}

export default CatalogueItemFilters
