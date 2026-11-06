import CatalogueFilterActions from "./CatalogueFilterActions.jsx"
import {
    ATTRIBUTE_DEFINITIONS,
    ELEMENT_DEFINITIONS,
    RARITY_DEFINITIONS,
    ROLE_DEFINITIONS
} from "../database/enums.jsx"
import { humanize } from "../js/utils.js"
import { useTranslation } from "../hooks/useTranslation.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"

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
    const t = useTranslate()
    const translateEnum = value => { const key = String(value ?? "").toLowerCase(); const translated = t(`app.shared.${key}`); return translated === `app.shared.${key}` ? humanize(value) : translated }
    const searchLabel = useTranslation("app.pages.catalogues.searchCount", undefined, { resultCount, totalCount })
    const searchAriaLabel = useTranslation("app.pages.heroes.filters.searchAriaLabel")
    const searchPlaceholder = useTranslation("app.pages.heroes.filters.searchPlaceholder")
    const sortOrderLabel = useTranslation("app.shared.sortOrder")
    const sortOrderAriaLabel = useTranslation("app.shared.sortOrderAriaLabel")
    const alphabeticLabel = useTranslation("app.shared.alphabetic")
    const rarityLabel = useTranslation("app.shared.rarity")
    const levelLabel = useTranslation("app.shared.level")
    const allRaritiesLabel = useTranslation("app.shared.allRarities")
    const rarityAriaLabel = useTranslation("app.shared.filterByRarity")
    const mainAttributeLabel = useTranslation("app.shared.mainAttribute")
    const mainAttributeAriaLabel = useTranslation("app.pages.heroes.filters.mainAttributeAriaLabel")
    const allAttributesLabel = useTranslation("app.shared.allAttributes")
    const elementLabel = useTranslation("app.shared.element")
    const elementAriaLabel = useTranslation("app.pages.heroes.filters.elementAriaLabel")
    const allElementsLabel = useTranslation("app.pages.heroes.filters.allElements")
    const roleLabel = useTranslation("app.shared.role")
    const roleAriaLabel = useTranslation("app.pages.heroes.filters.roleAriaLabel")
    const allRolesLabel = useTranslation("app.pages.heroes.filters.allRoles")
    const starredLabel = useTranslation("app.pages.heroes.filters.starred")

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
                    aria-label={searchAriaLabel}
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onBlur={onSearchBlur}
                />
            </label>
            {onSortChange && (
                <label className="catalogue-filter catalogue-filter-sort">
                    <span className="catalogue-control-label text">{sortOrderLabel}</span>
                    <select aria-label={sortOrderAriaLabel} value={sortOrder} onChange={event => onSortChange(event.target.value)}>
                        <option value="alphabetic">{alphabeticLabel}</option>
                        <option value="rarity">{rarityLabel}</option>
                        <option value="level">{levelLabel}</option>
                    </select>
                </label>
            )}
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{rarityLabel}</span>
                <select aria-label={rarityAriaLabel} value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                    <option value="all">{allRaritiesLabel}</option>
                    {HERO_CATALOGUE_RARITIES.map(value => <option key={value.id} value={String(value.id)}>{translateEnum(value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{mainAttributeLabel}</span>
                <select aria-label={mainAttributeAriaLabel} value={attributeFilter} onChange={event => setAttributeFilter(event.target.value)}>
                    <option value="all">{allAttributesLabel}</option>
                    {Object.values(ATTRIBUTE_DEFINITIONS).filter(value => value.id !== ATTRIBUTE_DEFINITIONS.NONE.id).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{elementLabel}</span>
                <select aria-label={elementAriaLabel} value={elementFilter} onChange={event => setElementFilter(event.target.value)}>
                    <option value="all">{allElementsLabel}</option>
                    {Object.values(ELEMENT_DEFINITIONS).filter(value => value.id !== ELEMENT_DEFINITIONS.VOID.id).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">{roleLabel}</span>
                <select aria-label={roleAriaLabel} value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                    <option value="all">{allRolesLabel}</option>
                    {Object.values(ROLE_DEFINITIONS).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
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
