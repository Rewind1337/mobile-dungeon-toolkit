import {
    ATTRIBUTE_DEFINITIONS,
    EQUIPMENT_SLOT_DEFINITIONS,
    PRIMARY_STAT_DEFINITIONS,
    RARITY_DEFINITIONS
} from "../database/enums.jsx"
import { humanizeName } from "../js/utils.js"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import CatalogueFilterActions from "./CatalogueFilterActions.jsx"

function CatalogueItemFilters({
    search,
    setSearch,
    headerText,
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
    const tc = useContentTranslation()
    const translateEnum = (type, value) => tc(type, String(value ?? "").toUpperCase(), "name", humanizeName(value))
    const t = useTranslate()
    const searchLabel = t("app.pages.catalogues.searchCount", { resultCount, totalCount })
    const searchPlaceholder = t("app.pages.items.filters.searchPlaceholder")
    const sortOrderLabel = t("app.shared.sortOrder")
    const alphabeticLabel = t("app.shared.alphabetic")
    const rarityLabel = t("app.shared.rarity")
    const levelLabel = t("app.shared.level")
    const sourceLabel = t("app.pages.items.filters.source")
    const allSourcesLabel = t("app.shared.allSources")
    const locationLabel = t("app.pages.items.filters.location")
    const allLocationsLabel = t("app.pages.items.filters.allLocations")
    const slotLabel = t("app.shared.slotLabel")
    const allSlotsLabel = t("app.shared.allSlots")
    const mainAttributeLabel = t("app.shared.mainAttribute")
    const allAttributesLabel = t("app.shared.allAttributes")
    const setAttributeLabel = t("app.pages.items.filters.setAttribute")
    const setPiecesLabel = t("app.pages.items.filters.setPieces")
    const allSetsLabel = t("app.pages.items.filters.allSets")
    const twoPieceSetsLabel = t("app.shared.twoPieceSets")
    const fourPieceSetsLabel = t("app.shared.fourPieceSets")
    const itemTypeLabel = t("app.pages.items.filters.itemType")
    const allItemsLabel = t("app.pages.items.filters.allItems")
    const twoPieceSetLabel = t("app.shared.twoPieceSet")
    const fourPieceSetLabel = t("app.shared.fourPieceSet")
    const uniqueLabel = t("app.shared.unique")
    const allRaritiesLabel = t("app.shared.allRarities")

    if (!filtersVisible) {
        return (
            <>
                {headerText && <div className="header-big catalogue-filter-heading-hidden">{headerText}</div>}
                <CatalogueFilterActions filtersVisible={false} onShow={onShowFilters} />
            </>
        )
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
            {headerText && <div className="header-big catalogue-filter-heading">{headerText}</div>}
            <label className="catalogue-search">
                <span className="catalogue-control-label text">
                    {searchLabel}
                </span>
                <input
                    className="selectable catalogue-input"
                    
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onBlur={onSearchBlur}
                />
            </label>

            {isListView && onSortChange && (
                <label className="catalogue-filter catalogue-filter-sort">
                    <span className="catalogue-control-label text">{sortOrderLabel}</span>
                    <select  value={sortOrder} onChange={event => onSortChange(event.target.value)}>
                        <option value="alphabetic">{alphabeticLabel}</option>
                        <option value="rarity">{rarityLabel}</option>
                        <option value="level">{levelLabel}</option>
                    </select>
                </label>
            )}

            {!isListView && (
                <>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{sourceLabel}</span>
                        <select  value={sourceFilter} onChange={event => setSourceFilter?.(event.target.value)}>
                            <option value="all">{allSourcesLabel}</option>
                            {allSources.map(source => <option key={source} value={source}>{tc("dropSource", String(source).toUpperCase().replace(/\s+/g, "_"), "name", humanizeName(source))}</option>)}
                        </select>
                    </label>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{locationLabel}</span>
                        <select  value={locationFilter} onChange={event => setLocationFilter?.(event.target.value)}>
                            <option value="all">{allLocationsLabel}</option>
                            {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                        </select>
                    </label>
                </>
            )}

            {view === "items" && showSlotFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{slotLabel}</span>
                    <select  value={slotFilter} onChange={event => setSlotFilter?.(event.target.value)}>
                        <option value="all">{allSlotsLabel}</option>
                        {Object.values(EQUIPMENT_SLOT_DEFINITIONS)
                            .filter(slot => slot.id !== EQUIPMENT_SLOT_DEFINITIONS.OTHER.id)
                            .map(slot => <option key={slot.id} value={String(slot.id)}>{translateEnum("equipmentSlot", slot.name)}</option>)}
                    </select>
                </label>
            )}

            {view === "items" && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{attributeLabel === "Main attribute" ? mainAttributeLabel : attributeLabel}</span>
                    <select  value={attributeFilter} onChange={event => setAttributeFilter?.(event.target.value)}>
                        <option value="all">{allAttributesLabel}</option>
                        {Object.values(isListView ? ATTRIBUTE_DEFINITIONS : PRIMARY_STAT_DEFINITIONS)
                            .filter(attribute => attribute.name !== "NONE")
                            .map(attribute => <option key={attribute.id} value={String(attribute.id)}>{translateEnum(isListView ? "attribute" : "primaryStat", attribute.name)}</option>)}
                    </select>
                </label>
            )}

            {view === "sets" && (
                <>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{setAttributeLabel}</span>
                        <select  value={setMainAttributeFilter ?? "all"} onChange={event => setAttributeFilterForSets?.(event.target.value)}>
                            <option value="all">{allAttributesLabel}</option>
                            {Object.values(PRIMARY_STAT_DEFINITIONS).map(attribute =>
                                <option key={attribute.id} value={String(attribute.id)}>{translateEnum("primaryStat", attribute.name)}</option>
                            )}
                        </select>
                    </label>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{setPiecesLabel}</span>
                        <select  value={setPieceCountFilter} onChange={event => setPieceCountFilter?.(event.target.value)}>
                            <option value="all">{allSetsLabel}</option>
                            <option value="2">{twoPieceSetsLabel}</option>
                            <option value="4">{fourPieceSetsLabel}</option>
                        </select>
                    </label>
                </>
            )}

            {isListView && setItemCategoryFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{itemTypeLabel}</span>
                    <select  value={itemCategoryFilter} onChange={event => setItemCategoryFilter(event.target.value)}>
                        <option value="all">{allItemsLabel}</option>
                        <option value="twoset">{twoPieceSetLabel}</option>
                        <option value="fourset">{fourPieceSetLabel}</option>
                        <option value="unique">{uniqueLabel}</option>
                    </select>
                </label>
            )}

            {isListView && setRarityFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{rarityLabel}</span>
                    <select  value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                        <option value="all">{allRaritiesLabel}</option>
                        {Object.values(RARITY_DEFINITIONS).map(rarity =>
                            <option key={rarity.id} value={String(rarity.id)}>{translateEnum("rarity", rarity.name)}</option>
                        )}
                    </select>
                </label>
            )}

            <CatalogueFilterActions filtersVisible onHide={onHideFilters} onClear={clearFilters} />
        </div>
    )
}

export default CatalogueItemFilters
