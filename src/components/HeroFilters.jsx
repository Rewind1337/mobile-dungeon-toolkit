import { memo } from 'react'
import Button from './Button.jsx'
import { useTranslate } from '../hooks/useTranslate.jsx'
import MobileFilterSelect from './MobileFilterSelect.jsx'
import { ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function HeroElementFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-elements flex-row'>
        <Button title={t("app.shared.fireTooltip")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.FIRE.id)} imgAsText text={filterSprites[1]} active={filters.element === ELEMENT_DEFINITIONS.FIRE.id} />
        <Button title={t("app.shared.waterTooltip")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.WATER.id)} imgAsText text={filterSprites[2]} active={filters.element === ELEMENT_DEFINITIONS.WATER.id} />
        <Button title={t("app.shared.natureTooltip")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.NATURE.id)} imgAsText text={filterSprites[3]} active={filters.element === ELEMENT_DEFINITIONS.NATURE.id} />
        <Button title={t("app.shared.lightTooltip")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.LIGHT.id)} imgAsText text={filterSprites[4]} active={filters.element === ELEMENT_DEFINITIONS.LIGHT.id} />
        <Button title={t("app.shared.shadowTooltip")} className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.SHADOW.id)} imgAsText text={filterSprites[5]} active={filters.element === ELEMENT_DEFINITIONS.SHADOW.id} />
        <MobileFilterSelect label={t("app.shared.element")} value={filters.element} onChange={event => toggleFilter('element', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ELEMENT_DEFINITIONS.FIRE.id, label: t("app.shared.fire")}, {value: ELEMENT_DEFINITIONS.WATER.id, label: t("app.shared.water")}, {value: ELEMENT_DEFINITIONS.NATURE.id, label: t("app.shared.nature")}, {value: ELEMENT_DEFINITIONS.LIGHT.id, label: t("app.shared.light")}, {value: ELEMENT_DEFINITIONS.SHADOW.id, label: t("app.shared.shadow")}]} />
    </div>)
}

function HeroRoleFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-roles flex-row'>
        <Button title={t("app.shared.offensiveTooltip")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.OFFENSIVE.id)} imgAsText text={filterSprites[10]} active={filters.role === ROLE_DEFINITIONS.OFFENSIVE.id} />
        <Button title={t("app.shared.defensiveTooltip")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.DEFENSIVE.id)} imgAsText text={filterSprites[11]} active={filters.role === ROLE_DEFINITIONS.DEFENSIVE.id} />
        <Button title={t("app.shared.controlTooltip")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.CONTROL.id)} imgAsText text={filterSprites[12]} active={filters.role === ROLE_DEFINITIONS.CONTROL.id} />
        <Button title={t("app.shared.supportTooltip")} className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.SUPPORT.id)} imgAsText text={filterSprites[13]} active={filters.role === ROLE_DEFINITIONS.SUPPORT.id} />
        <MobileFilterSelect label={t("app.shared.role")} value={filters.role} onChange={event => toggleFilter('role', event.target.value === '' ? null : Number(event.target.value))} options={Object.values(ROLE_DEFINITIONS).map(option => ({value: option.id, label: t(`app.shared.${option.name.toLowerCase()}`)}))} />
    </div>)
}

function HeroAttributeFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-attributes flex-row'>
        <Button title={t("app.shared.strengthTooltip")} className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button title={t("app.shared.dexterityTooltip")} className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button title={t("app.shared.intelligenceTooltip")} className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
        <MobileFilterSelect label={t("app.shared.attribute")} value={filters.mainAttribute} onChange={event => toggleFilter('mainAttribute', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ATTRIBUTE_DEFINITIONS.STRENGTH.id, label: t("app.shared.strength")}, {value: ATTRIBUTE_DEFINITIONS.DEXTERITY.id, label: t("app.shared.dexterity")}, {value: ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id, label: t("app.shared.intelligence")}]} />
    </div>)
}

function HeroRarityFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-rarities flex-row'>
        <Button title={t("app.shared.uncommonTooltip")} className='filters-rarity-button' round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button title={t("app.shared.rareTooltip")} className='filters-rarity-button' round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button title={t("app.shared.epicTooltip")} className='filters-rarity-button' round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button title={t("app.shared.legendaryTooltip")} className='filters-rarity-button' round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
        <MobileFilterSelect label={t("app.shared.rarity")} value={filters.rarity ?? ""}
            onChange={event => toggleFilter("rarity", event.target.value === "" ? null : Number(event.target.value))}
            options={[{value: RARITY_DEFINITIONS.UNCOMMON.id, label: t("app.shared.uncommon")}, {value: RARITY_DEFINITIONS.RARE.id, label: t("app.shared.rare")}, {value: RARITY_DEFINITIONS.EPIC.id, label: t("app.shared.epic")}, {value: RARITY_DEFINITIONS.LEGENDARY.id, label: t("app.shared.legendary")}]} />
    </div>)
}

function HeroFilters({ setFiltersAdvanced, advanced, toggleFilter, setSearch, onSearchBlur, clearFilters, filters, filterSprites, sortOrder, onSortChange, searchPlaceholder }) {
    const t = useTranslate()
    return (
        <div className="filters card">
            <div className="filters-primary-row">
                <Button title={t("app.shared.showOrHideAdvancedFiltersTooltip")} className="filters-advanced-button" round onClick={() => setFiltersAdvanced(value => !value)} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button title={t("app.shared.clearAllFiltersTooltip")} className="filters-clear-button" round onClick={clearFilters} text={t("app.shared.all").toUpperCase()} active={filters.rarity === null && [filters.element, filters.role, filters.mainAttribute, filters.isStarred, filters.name].every(value => value === null || value === "")} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <label className="name-search-filter catalogue-search">
                    <span className="catalogue-control-label text">{t("app.shared.search")}</span>
                    <input className="selectable catalogue-input w-100" type="text"  placeholder={searchPlaceholder ?? t("app.shared.searchHeroPlaceholder")} value={filters.name} onChange={event => setSearch(event.target.value)} onBlur={onSearchBlur} />
                </label>
                <label className="filters-sort-order">
                    <span className="catalogue-control-label text">{t("app.shared.sortOrder")}</span>
                    <select  value={sortOrder} onChange={event => onSortChange(event.target.value)}>
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
                        <Button title={t("app.shared.showStarredHeroesTooltip")} className="filters-starred-button" round onClick={() => toggleFilter("isStarred", true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                    </div>
                    <HeroRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                </div>
            )}
        </div>
    )
}

export default memo(HeroFilters)