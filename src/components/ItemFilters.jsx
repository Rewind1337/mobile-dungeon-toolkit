import { memo } from 'react'
import Button from './Button.jsx'
import { useTranslate } from '../hooks/useTranslate.jsx'
import MobileFilterSelect from './MobileFilterSelect.jsx'
import { EQUIPMENT_SLOT_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function ItemSetUniqueFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-special flex-row'>
        <Button title={t("app.shared.uniqueItemsTooltip")} className='filters-special-button' round onClick={() => toggleFilter('unique', 'unique')} imgAsText text={filterSprites[42]} active={filters.unique === 'unique'} />
        <Button title={t("app.shared.itemsWithTwoPieceSetsTooltip")} className='filters-special-button' round onClick={() => toggleFilter('set', 'twoset')} imgAsText text={filterSprites[40]} active={filters.set === 'twoset'} />
        <Button title={t("app.shared.itemsWithFourPieceSetsTooltip")} className='filters-special-button' round onClick={() => toggleFilter('set', 'fourset')} imgAsText text={filterSprites[41]} active={filters.set === 'fourset'} />
        <div className="mobile-filter-specials flex-row justify-between">
            <MobileFilterSelect label={t("app.shared.unique")} value={filters.unique} onChange={event => toggleFilter('unique', event.target.value === '' ? null : event.target.value)} options={[{value: 'unique', label: t("app.shared.unique")}, {value: 'notUnique', label: t("app.shared.notUnique")}]} />
            <MobileFilterSelect label={t("app.shared.set")} value={filters.set} onChange={event => toggleFilter('set', event.target.value === '' ? null : event.target.value)} options={[{value: 'twoset', label: t("app.shared.twoPieceSet")}, {value: 'fourset', label: t("app.shared.fourPieceSet")}, {value: 'noSet', label: t("app.shared.noSet")}]} /></div>
    </div>)
}

function ItemSlotFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-slots flex-row'>
        <Button title={t("app.shared.weaponTooltip")} className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.WEAPON.id)} imgAsText text={filterSprites[43]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.WEAPON.id} />
        <Button title={t("app.shared.helmetTooltip")} className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.HELMET.id)} imgAsText text={filterSprites[44]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.HELMET.id} />
        <Button title={t("app.shared.armorTooltip")} className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.ARMOR.id)} imgAsText text={filterSprites[45]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.ARMOR.id} />
        <Button title={t("app.shared.ringTooltip")} className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.RING.id)} imgAsText text={filterSprites[46]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.RING.id} />
        <Button title={t("app.shared.necklaceTooltip")} className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.NECKLACE.id)} imgAsText text={filterSprites[47]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.NECKLACE.id} />
        <MobileFilterSelect label={t("app.shared.slotLabel")} value={filters.slot} onChange={event => toggleFilter('slot', event.target.value === '' ? null : Number(event.target.value))} options={Object.values(EQUIPMENT_SLOT_DEFINITIONS).filter(option => option.id !== EQUIPMENT_SLOT_DEFINITIONS.OTHER.id).map(option => ({value: option.id, label: t(`app.shared.${option.name.toLowerCase()}`)}))} />
    </div>)
}

function ItemAttributeFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-attributes flex-row'>
        <Button title={t("app.shared.strengthRequirementTooltip")} className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button title={t("app.shared.dexterityRequirementTooltip")} className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button title={t("app.shared.intelligenceRequirementTooltip")} className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
        <MobileFilterSelect label={t("app.shared.attribute")} value={filters.attributeRequirement} onChange={event => toggleFilter('attributeRequirement', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ATTRIBUTE_DEFINITIONS.STRENGTH.id, label: t("app.shared.strength")}, {value: ATTRIBUTE_DEFINITIONS.DEXTERITY.id, label: t("app.shared.dexterity")}, {value: ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id, label: t("app.shared.intelligence")}]} />
    </div>)
}

function ItemRarityFilters({ toggleFilter, filters, filterSprites }) {
    const t = useTranslate()
    return (<div className='filter-group filters-group-rarities flex-row'>
        <Button title={t("app.shared.commonTooltip")} className='filters-rarity-button' round color={"common"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.COMMON.id)} text={filterSprites[30]} active={filters.rarity === RARITY_DEFINITIONS.COMMON.id} />
        <Button title={t("app.shared.uncommonTooltip")} className='filters-rarity-button' round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button title={t("app.shared.rareTooltip")} className='filters-rarity-button' round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button title={t("app.shared.epicTooltip")} className='filters-rarity-button' round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button title={t("app.shared.legendaryTooltip")} className='filters-rarity-button' round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
        <Button title={t("app.shared.mythicTooltip")} className='filters-rarity-button' round color={"mythic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.MYTHIC.id)} text={filterSprites[35]} active={filters.rarity === RARITY_DEFINITIONS.MYTHIC.id} />
        <Button title={t("app.shared.heroicTooltip")} className='filters-rarity-button' round color={"heroic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.HEROIC.id)} text={filterSprites[36]} active={filters.rarity === RARITY_DEFINITIONS.HEROIC.id} />
        <Button title={t("app.shared.divineTooltip")} className='filters-rarity-button' round color={"divine"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.DIVINE.id)} text={filterSprites[37]} active={filters.rarity === RARITY_DEFINITIONS.DIVINE.id} />
        <Button title={t("app.shared.ancientTooltip")} className='filters-rarity-button' round color={"ancient"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.ANCIENT.id)} text={filterSprites[38]} active={filters.rarity === RARITY_DEFINITIONS.ANCIENT.id} />
        <MobileFilterSelect label={t("app.shared.rarity")} value={filters.rarity ?? ""}
            onChange={event => toggleFilter("rarity", event.target.value === "" ? null : Number(event.target.value))}
            options={Object.values(RARITY_DEFINITIONS).map(option => ({value: option.id, label: option.name[0] + option.name.slice(1).toLowerCase()}))} />
    </div>)
}

function ItemFilters({ savedItems = false, setFiltersAdvanced, advanced, toggleFilter, setSearch, onSearchBlur, clearFilters, filters, filterSprites, topOffset, sortOrder, onSortChange }) {
    const t = useTranslate()
    return (
        <div className="filters card" style={{ top: topOffset }}>
            <div className="filters-primary-row">
                <Button title={t("app.shared.showOrHideAdvancedFiltersTooltip")} className="filters-advanced-button" round onClick={() => setFiltersAdvanced(value => !value)} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button title={t("app.shared.clearAllFiltersTooltip")} className="filters-clear-button" round onClick={clearFilters} text={t("app.shared.all").toUpperCase()} active={filters.rarity === null && [filters.set, filters.unique, filters.slot, filters.attributeRequirement, filters.name].every(value => value === null || value === "")} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <label className="name-search-filter catalogue-search">
                    <span className="catalogue-control-label text">{t("app.shared.search")}</span>
                    <input className="selectable catalogue-input w-100" type="text"  placeholder={t("app.shared.searchItemPlaceholder")} value={filters.name} onChange={event => setSearch(event.target.value)} onBlur={onSearchBlur} />
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
                    <ItemSetUniqueFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                    <ItemAttributeFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                    {savedItems && <ItemRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />}
                </div>
            )}
        </div>
    )
}

export default memo(ItemFilters)