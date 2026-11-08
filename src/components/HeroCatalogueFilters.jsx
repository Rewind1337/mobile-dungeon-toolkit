import CatalogueFilterActions from "./CatalogueFilterActions.jsx"
import {
    ATTRIBUTE_DEFINITIONS,
    ELEMENT_DEFINITIONS,
    RARITY_DEFINITIONS,
    ROLE_DEFINITIONS
} from "../database/enums.jsx"
import { humanizeName } from "../js/utils.js"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"

const HERO_CATALOGUE_RARITIES = Object.values(RARITY_DEFINITIONS).filter(
    rarity => rarity.id >= RARITY_DEFINITIONS.UNCOMMON.id && rarity.id <= RARITY_DEFINITIONS.LEGENDARY.id
)

function HeroCatalogueFilters({
    search,
    setSearch,
    headerText,
    onSearchBlur,
    rarityFilter,
    setRarityFilter,
    attributeFilter,
    setAttributeFilter,
    elementFilter,
    setElementFilter,
    roleFilter,
    setRoleFilter,
    starredOnly = false,
    setStarredOnly,
    resultCount,
    totalCount,
    clearFilters,
    filtersVisible = true,
    onHideFilters,
    onShowFilters,
    sortOrder,
    onSortChange,
    topOffset
}) {
    const tc = useContentTranslation()
    const translateEnum = (type, value) => tc(type, String(value ?? "").toUpperCase(), "name", humanizeName(value))
    const t = useTranslate()
    const searchLabel = t("app.pages.catalogues.searchCount", { resultCount, totalCount })
    const searchPlaceholder = t("app.pages.heroes.filters.searchPlaceholder")
    const sortOrderLabel = t("app.shared.sortOrder")
    const alphabeticLabel = t("app.shared.alphabetic")
    const rarityLabel = t("app.shared.rarity")
    const levelLabel = t("app.shared.level")
    const allRaritiesLabel = t("app.shared.allRarities")
    const mainAttributeLabel = t("app.shared.mainAttribute")
    const allAttributesLabel = t("app.shared.allAttributes")
    const elementLabel = t("app.shared.element")
    const allElementsLabel = t("app.pages.heroes.filters.allElements")
    const roleLabel = t("app.shared.role")
    const allRolesLabel = t("app.pages.heroes.filters.allRoles")
    const starredLabel = t("app.pages.heroes.filters.starred")

    if (!filtersVisible) {
        return (
            <>
                {headerText && <div className="header-big catalogue-filter-heading-hidden">{headerText}</div>}
                <CatalogueFilterActions filtersVisible={false} onShow={onShowFilters} />
            </>
        )
    }

    return (
        <div className={`hero-catalogue-filters card${onSortChange ? " has-sort-order" : ""}`} style={topOffset ? { top: topOffset } : undefined}>
            {headerText && <div className="header-big catalogue-filter-heading">{headerText}</div>}
            <label className="catalogue-search">
                <span className="catalogue-control-label text">{searchLabel}</span>
                <input
                    className="selectable catalogue-input"
                    
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onBlur={onSearchBlur}
                />
            </label>
            {onSortChange && (
                <label className="catalogue-filter catalogue-filter-sort">
                    <span className="catalogue-control-label text">{sortOrderLabel}</span>
                    <select  value={sortOrder} onChange={event => onSortChange(event.target.value)}>
                        <option value="alphabetic">{alphabeticLabel}</option>
                        <option value="rarity">{rarityLabel}</option>
                        <option value="level">{levelLabel}</option>
                    </select>
                </label>
            )}
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{rarityLabel}</span>
                <select  value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                    <option value="all">{allRaritiesLabel}</option>
                    {HERO_CATALOGUE_RARITIES.map(value => <option key={value.id} value={String(value.id)}>{translateEnum("rarity", value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{mainAttributeLabel}</span>
                <select  value={attributeFilter} onChange={event => setAttributeFilter(event.target.value)}>
                    <option value="all">{allAttributesLabel}</option>
                    {Object.values(ATTRIBUTE_DEFINITIONS).filter(value => value.id !== ATTRIBUTE_DEFINITIONS.NONE.id).map(value => <option key={value.id} value={String(value.id)}>{translateEnum("attribute", value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{elementLabel}</span>
                <select  value={elementFilter} onChange={event => setElementFilter(event.target.value)}>
                    <option value="all">{allElementsLabel}</option>
                    {Object.values(ELEMENT_DEFINITIONS).filter(value => value.id !== ELEMENT_DEFINITIONS.VOID.id).map(value => <option key={value.id} value={String(value.id)}>{translateEnum("element", value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{roleLabel}</span>
                <select  value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                    <option value="all">{allRolesLabel}</option>
                    {Object.values(ROLE_DEFINITIONS).map(value => <option key={value.id} value={String(value.id)}>{translateEnum("role", value.name)}</option>)}
                </select>
            </label>
            {setStarredOnly && (
                <label className="catalogue-filter-checkbox">
                    <input type="checkbox" checked={starredOnly} onChange={event => setStarredOnly(event.target.checked)} />
                    <span className="text">{starredLabel}</span>
                </label>
            )}
            <CatalogueFilterActions filtersVisible onHide={onHideFilters} onClear={clearFilters} />
        </div>
    )
}

export default HeroCatalogueFilters
