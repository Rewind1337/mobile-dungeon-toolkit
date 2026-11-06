import {
    ATTRIBUTE_DEFINITIONS,
    EQUIPMENT_SLOT_DEFINITIONS,
    PRIMARY_STAT_DEFINITIONS,
    RARITY_DEFINITIONS
} from "../database/enums.jsx"
import { humanize } from "../js/utils.js"
import { useTranslation } from "../hooks/useTranslation.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
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
    const t = useTranslate()
    const translateEnum = value => { const key = String(value ?? "").toLowerCase(); const translated = t(`app.shared.${key}`); return translated === `app.shared.${key}` ? humanize(value) : translated }
    const searchLabel = useTranslation("app.pages.catalogues.searchCount", undefined, { resultCount, totalCount })
    const searchAriaLabel = useTranslation("app.pages.items.filters.searchAriaLabel")
    const searchPlaceholder = useTranslation("app.pages.items.filters.searchPlaceholder")
    const sortOrderLabel = useTranslation("app.shared.sortOrder")
    const sortOrderAriaLabel = useTranslation("app.shared.sortOrderAriaLabel")
    const alphabeticLabel = useTranslation("app.shared.alphabetic")
    const rarityLabel = useTranslation("app.shared.rarity")
    const levelLabel = useTranslation("app.shared.level")
    const sourceLabel = useTranslation("app.pages.items.filters.source")
    const sourceAriaLabel = useTranslation("app.pages.items.filters.sourceAriaLabel")
    const allSourcesLabel = useTranslation("app.shared.allSources")
    const locationLabel = useTranslation("app.pages.items.filters.location")
    const locationAriaLabel = useTranslation("app.pages.items.filters.locationAriaLabel")
    const allLocationsLabel = useTranslation("app.pages.items.filters.allLocations")
    const slotLabel = useTranslation("app.shared.slotLabel")
    const slotAriaLabel = useTranslation("app.pages.items.filters.slotAriaLabel")
    const allSlotsLabel = useTranslation("app.shared.allSlots")
    const mainAttributeLabel = useTranslation("app.shared.mainAttribute")
    const attributeAriaLabel = useTranslation("app.pages.items.filters.attributeAriaLabel", undefined, { attribute: attributeLabel.toLowerCase() })
    const allAttributesLabel = useTranslation("app.shared.allAttributes")
    const rarityAriaLabel = useTranslation("app.shared.filterByRarity")
    const setAttributeLabel = useTranslation("app.pages.items.filters.setAttribute")
    const setAttributeAriaLabel = useTranslation("app.pages.items.filters.setAttributeAriaLabel")
    const setPiecesLabel = useTranslation("app.pages.items.filters.setPieces")
    const setPiecesAriaLabel = useTranslation("app.pages.items.filters.setPiecesAriaLabel")
    const allSetsLabel = useTranslation("app.pages.items.filters.allSets")
    const twoPieceSetsLabel = useTranslation("app.shared.twoPieceSets")
    const fourPieceSetsLabel = useTranslation("app.shared.fourPieceSets")
    const itemTypeLabel = useTranslation("app.pages.items.filters.itemType")
    const itemTypeAriaLabel = useTranslation("app.pages.items.filters.itemTypeAriaLabel")
    const allItemsLabel = useTranslation("app.pages.items.filters.allItems")
    const twoPieceSetLabel = useTranslation("app.shared.twoPieceSet")
    const fourPieceSetLabel = useTranslation("app.shared.fourPieceSet")
    const uniqueLabel = useTranslation("app.shared.unique")
    const allRaritiesLabel = useTranslation("app.shared.allRarities")

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
                    aria-label={searchAriaLabel}
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onBlur={onSearchBlur}
                />
            </label>

            {isListView && onSortChange && (
                <label className="catalogue-filter catalogue-filter-sort">
                    <span className="catalogue-control-label text">{sortOrderLabel}</span>
                    <select aria-label={sortOrderAriaLabel} value={sortOrder} onChange={event => onSortChange(event.target.value)}>
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
                        <select aria-label={sourceAriaLabel} value={sourceFilter} onChange={event => setSourceFilter?.(event.target.value)}>
                            <option value="all">{allSourcesLabel}</option>
                            {allSources.map(source => <option key={source} value={source}>{humanize(source)}</option>)}
                        </select>
                    </label>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{locationLabel}</span>
                        <select aria-label={locationAriaLabel} value={locationFilter} onChange={event => setLocationFilter?.(event.target.value)}>
                            <option value="all">{allLocationsLabel}</option>
                            {allLocations.map(location => <option key={location} value={location}>{location}</option>)}
                        </select>
                    </label>
                </>
            )}

            {view === "items" && showSlotFilter && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{slotLabel}</span>
                    <select aria-label={slotAriaLabel} value={slotFilter} onChange={event => setSlotFilter?.(event.target.value)}>
                        <option value="all">{allSlotsLabel}</option>
                        {Object.values(EQUIPMENT_SLOT_DEFINITIONS)
                            .filter(slot => slot.id !== EQUIPMENT_SLOT_DEFINITIONS.OTHER.id)
                            .map(slot => <option key={slot.id} value={String(slot.id)}>{translateEnum(slot.name)}</option>)}
                    </select>
                </label>
            )}

            {view === "items" && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">{attributeLabel === "Main attribute" ? mainAttributeLabel : attributeLabel}</span>
                    <select aria-label={attributeAriaLabel} value={attributeFilter} onChange={event => setAttributeFilter?.(event.target.value)}>
                        <option value="all">{allAttributesLabel}</option>
                        {Object.values(isListView ? ATTRIBUTE_DEFINITIONS : PRIMARY_STAT_DEFINITIONS)
                            .filter(attribute => attribute.name !== "NONE")
                            .map(attribute => <option key={attribute.id} value={String(attribute.id)}>{translateEnum(attribute.name)}</option>)}
                    </select>
                </label>
            )}

            {view === "sets" && (
                <>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{setAttributeLabel}</span>
                        <select aria-label={setAttributeAriaLabel} value={setMainAttributeFilter ?? "all"} onChange={event => setAttributeFilterForSets?.(event.target.value)}>
                            <option value="all">{allAttributesLabel}</option>
                            {Object.values(PRIMARY_STAT_DEFINITIONS).map(attribute =>
                                <option key={attribute.id} value={String(attribute.id)}>{translateEnum(attribute.name)}</option>
                            )}
                        </select>
                    </label>
                    <label className="catalogue-filter">
                        <span className="catalogue-control-label text">{setPiecesLabel}</span>
                        <select aria-label={setPiecesAriaLabel} value={setPieceCountFilter} onChange={event => setPieceCountFilter?.(event.target.value)}>
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
                    <select aria-label={itemTypeAriaLabel} value={itemCategoryFilter} onChange={event => setItemCategoryFilter(event.target.value)}>
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
                    <select aria-label={rarityAriaLabel} value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                        <option value="all">{allRaritiesLabel}</option>
                        {Object.values(RARITY_DEFINITIONS).map(rarity =>
                            <option key={rarity.id} value={String(rarity.id)}>{translateEnum(rarity.name)}</option>
                        )}
                    </select>
                </label>
            )}

            <CatalogueFilterActions filtersVisible onHide={onHideFilters} onClear={clearFilters} />
        </div>
    )
}

export default CatalogueItemFilters
