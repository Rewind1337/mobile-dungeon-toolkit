import CatalogueFilterActions from "./CatalogueFilterActions.jsx"
import {
    ATTRIBUTE_DEFINITIONS,
    ELEMENT_DEFINITIONS,
    RARITY_DEFINITIONS,
    ROLE_DEFINITIONS
} from "../database/enums.jsx"
import { humanize } from "../js/util.jsx"

const HERO_CATALOGUE_RARITIES = Object.values(RARITY_DEFINITIONS).filter(
    rarity => rarity.id >= RARITY_DEFINITIONS.UNCOMMON.id && rarity.id <= RARITY_DEFINITIONS.LEGENDARY.id
)

function HeroCatalogueFilters({
    search,
    setSearch,
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
    if (!filtersVisible) {
        return <CatalogueFilterActions filtersVisible={false} onShow={onShowFilters} />
    }

    return (
        <div className={`hero-catalogue-filters card${onSortChange ? " has-sort-order" : ""}`} style={topOffset ? { top: topOffset } : undefined}>
            <label className="catalogue-search">
                <span className="catalogue-control-label text">Search heroes ({resultCount} of {totalCount} heroes)</span>
                <input
                    className="selectable catalogue-input"
                    aria-label="Search hero catalogue"
                    placeholder="Name, skill, talent, effect, ID…"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onBlur={onSearchBlur}
                />
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">Rarity</span>
                <select aria-label="Filter by rarity" value={rarityFilter} onChange={event => setRarityFilter(event.target.value)}>
                    <option value="all">All rarities</option>
                    {HERO_CATALOGUE_RARITIES.map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">Main attribute</span>
                <select aria-label="Filter by main attribute" value={attributeFilter} onChange={event => setAttributeFilter(event.target.value)}>
                    <option value="all">All attributes</option>
                    {Object.values(ATTRIBUTE_DEFINITIONS).filter(value => value.id !== ATTRIBUTE_DEFINITIONS.NONE.id).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">Element</span>
                <select aria-label="Filter by element" value={elementFilter} onChange={event => setElementFilter(event.target.value)}>
                    <option value="all">All elements</option>
                    {Object.values(ELEMENT_DEFINITIONS).filter(value => value.id !== ELEMENT_DEFINITIONS.VOID.id).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                </select>
            </label>
            <label className="catalogue-filter">
                <span className="catalogue-control-label text">Role</span>
                <select aria-label="Filter by role" value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                    <option value="all">All roles</option>
                    {Object.values(ROLE_DEFINITIONS).map(value => <option key={value.id} value={String(value.id)}>{humanize(value.name)}</option>)}
                </select>
            </label>
            {setStarredOnly && (
                <label className="catalogue-filter-checkbox">
                    <input type="checkbox" checked={starredOnly} onChange={event => setStarredOnly(event.target.checked)} />
                    <span className="text">Starred</span>
                </label>
            )}
            {onSortChange && (
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Sort Order</span>
                    <select aria-label="Sort order" value={sortOrder} onChange={event => onSortChange(event.target.value)}>
                        <option value="alphabetic">Alphabetic</option>
                        <option value="rarity">Rarity</option>
                        <option value="level">Level</option>
                    </select>
                </label>
            )}
            <CatalogueFilterActions filtersVisible onHide={onHideFilters} onClear={clearFilters} />
        </div>
    )
}

export default HeroCatalogueFilters
