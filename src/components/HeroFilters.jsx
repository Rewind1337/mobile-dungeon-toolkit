import { memo } from 'react'
import Button from './Button.jsx'
import { useTranslate } from '../hooks/useTranslate.jsx'
import { ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function MobileFilterSelect({ label, value, onChange, options, multiple = false }) {
    const t = useTranslate()
    return (
        <label className="mobile-filter-control">
            <span className="catalogue-control-label text">{label}</span>
            <select aria-label={label} multiple={multiple}
                value={multiple ? (Array.isArray(value) ? value.map(String) : []) : value ?? ""}
                onChange={onChange}>
                {!multiple && <option value="">{t("app.shared.all")}</option>}
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
    )
}

function HeroElementFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-elements flex-row'>
        <Button title={t("app.shared.fire")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.FIRE.id)} imgAsText text={filterSprites[1]} active={filters.element === ELEMENT_DEFINITIONS.FIRE.id} />
        <Button title={t("app.shared.water")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.WATER.id)} imgAsText text={filterSprites[2]} active={filters.element === ELEMENT_DEFINITIONS.WATER.id} />
        <Button title={t("app.shared.nature")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.NATURE.id)} imgAsText text={filterSprites[3]} active={filters.element === ELEMENT_DEFINITIONS.NATURE.id} />
        <Button title={t("app.shared.light")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.LIGHT.id)} imgAsText text={filterSprites[4]} active={filters.element === ELEMENT_DEFINITIONS.LIGHT.id} />
        <Button title={t("app.shared.shadow")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.SHADOW.id)} imgAsText text={filterSprites[5]} active={filters.element === ELEMENT_DEFINITIONS.SHADOW.id} />
        <MobileFilterSelect label={t("app.shared.element")} value={filters.element} onChange={event => toggleFilter('element', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ELEMENT_DEFINITIONS.FIRE.id, label: t("app.shared.fire")}, {value: ELEMENT_DEFINITIONS.WATER.id, label: t("app.shared.water")}, {value: ELEMENT_DEFINITIONS.NATURE.id, label: t("app.shared.nature")}, {value: ELEMENT_DEFINITIONS.LIGHT.id, label: t("app.shared.light")}, {value: ELEMENT_DEFINITIONS.SHADOW.id, label: t("app.shared.shadow")}]} />
    </div>)
}

function HeroRoleFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-roles flex-row'>
        <Button title={t("app.shared.offensive")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.OFFENSIVE.id)} imgAsText text={filterSprites[10]} active={filters.role === ROLE_DEFINITIONS.OFFENSIVE.id} />
        <Button title={t("app.shared.defensive")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.DEFENSIVE.id)} imgAsText text={filterSprites[11]} active={filters.role === ROLE_DEFINITIONS.DEFENSIVE.id} />
        <Button title={t("app.shared.control")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.CONTROL.id)} imgAsText text={filterSprites[12]} active={filters.role === ROLE_DEFINITIONS.CONTROL.id} />
        <Button title={t("app.shared.support")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.SUPPORT.id)} imgAsText text={filterSprites[13]} active={filters.role === ROLE_DEFINITIONS.SUPPORT.id} />
        <MobileFilterSelect label={t("app.shared.role")} value={filters.role} onChange={event => toggleFilter('role', event.target.value === '' ? null : Number(event.target.value))} options={Object.values(ROLE_DEFINITIONS).map(option => ({value: option.id, label: option.name[0] + option.name.slice(1).toLowerCase()}))} />
    </div>)
}

function HeroAttributeFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-attributes flex-row'>
        <Button title={t("app.shared.strength")} className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button title={t("app.shared.dexterity")} className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button title={t("app.shared.intelligence")} className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
        <MobileFilterSelect label={t("app.shared.attribute")} value={filters.mainAttribute} onChange={event => toggleFilter('mainAttribute', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ATTRIBUTE_DEFINITIONS.STRENGTH.id, label: t("app.shared.strength")}, {value: ATTRIBUTE_DEFINITIONS.DEXTERITY.id, label: t("app.shared.dexterity")}, {value: ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id, label: t("app.shared.intelligence")}]} />
    </div>)
}

function HeroRarityFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-rarities flex-row'>
        <Button title={t("app.shared.uncommon")} className='filters-rarity-button' round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button title={t("app.shared.rare")} className='filters-rarity-button' round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button title={t("app.shared.epic")} className='filters-rarity-button' round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button title={t("app.shared.legendary")} className='filters-rarity-button' round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
        <MobileFilterSelect label={t("app.shared.rarity")} value={filters.rarity ?? ""}
            onChange={event => toggleFilter("rarity", event.target.value === "" ? null : Number(event.target.value))}
            options={[{value: RARITY_DEFINITIONS.UNCOMMON.id, label: t("app.shared.uncommon")}, {value: RARITY_DEFINITIONS.RARE.id, label: t("app.shared.rare")}, {value: RARITY_DEFINITIONS.EPIC.id, label: t("app.shared.epic")}, {value: RARITY_DEFINITIONS.LEGENDARY.id, label: t("app.shared.legendary")}]} />
    </div>)
}

function HeroFilters({ setFiltersAdvanced, advanced, toggleFilter, setSearch, onSearchBlur, clearFilters, filters, filterSprites, sortOrder, onSortChange, searchPlaceholder, searchAriaLabel }) {
    const t = useTranslate()
    return (
        <div className="filters card">
            <div className="filters-primary-row">
                <Button title={t("app.shared.showOrHideAdvancedFilters")} className="filters-advanced-button" round onClick={() => setFiltersAdvanced(value => !value)} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button title={t("app.shared.clearAllFilters")} className="filters-clear-button" round onClick={clearFilters} text="ALL" active={filters.rarity === null && [filters.element, filters.role, filters.mainAttribute, filters.isStarred, filters.name].every(value => value === null || value === "")} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <label className="name-search-filter catalogue-search">
                    <span className="catalogue-control-label text">{t("app.shared.search")}</span>
                    <input className="selectable catalogue-input w-100" type="text" aria-label={searchAriaLabel ?? t("app.shared.searchHeroesByName")} placeholder={searchPlaceholder ?? t("app.shared.searchHeroPlaceholder")} value={filters.name} onChange={event => setSearch(event.target.value)} onBlur={onSearchBlur} />
                </label>
                <label className="filters-sort-order">
                    <span className="catalogue-control-label text">{t("app.shared.sortOrder")}</span>
                    <select aria-label={t("app.shared.sortOrderAriaLabel")} value={sortOrder} onChange={event => onSortChange(event.target.value)}>
                        <option value="alphabetic">{t("app.shared.alphabetic")}</option>
                        <option value="rarity">{t("app.shared.rarity")}</option>
                        <option value="level">{t("app.shared.level")}</option>
                    </select>
                </label>
            </div>
            {advanced && (
                <div className="filters-advanced-options">
                    <HeroRoleFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                    <HeroAttributeFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                    <div className="filter-group filters-group-special filters-starred-group flex-row">
                        <Button title={t("app.shared.showStarredHeroes")} className="filters-starred-button" round onClick={() => toggleFilter("isStarred", true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                    </div>
                    <HeroRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                </div>
            )}
        </div>
    )
}

export default memo(HeroFilters)