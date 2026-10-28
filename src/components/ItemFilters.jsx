import { memo } from 'react'
import Button from './Button.jsx'
import { EQUIPMENT_SLOT_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function MobileFilterSelect({ label, value, onChange, options }) {
    return (
    <label className="mobile-filter-control">
        <span>{label}</span>
        <select aria-label={label} value={value ?? ""} onChange={onChange}>
            <option value="">All</option>
            {options.map(option => 
                <option key={option.value} value={option.value}>{option.label}</option>
            )}
        </select>
    </label>
)}

function ItemSetUniqueFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-special flex-row'>
        <Button title="Unique items" className='filters-special-button' round onClick={() => toggleFilter('unique', 'unique')} imgAsText text={filterSprites[42]} active={filters.unique === 'unique'} />
        <Button title="Items with 2-piece sets" className='filters-special-button' round onClick={() => toggleFilter('set', 'twoset')} imgAsText text={filterSprites[40]} active={filters.set === 'twoset'} />
        <Button title="Items with 4-piece sets" className='filters-special-button' round onClick={() => toggleFilter('set', 'fourset')} imgAsText text={filterSprites[41]} active={filters.set === 'fourset'} />
        <div className="mobile-filter-specials flex-row justify-between">
            <MobileFilterSelect label="Unique" value={filters.unique} onChange={event => toggleFilter('unique', event.target.value === '' ? null : event.target.value)} options={[{value: 'unique', label: 'Unique'}, {value: 'notUnique', label: 'Not Unique'}]} />
            <MobileFilterSelect label="Set" value={filters.set} onChange={event => toggleFilter('set', event.target.value === '' ? null : event.target.value)} options={[{value: 'twoset', label: '2-piece set'}, {value: 'fourset', label: '4-piece set'}, {value: 'noSet', label: 'No Set'}]} /></div>
    </div>)
}

function ItemSlotFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-slots flex-row'>
        <Button title="Weapon" className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.WEAPON.id)} imgAsText text={filterSprites[43]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.WEAPON.id} />
        <Button title="Helmet" className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.HELMET.id)} imgAsText text={filterSprites[44]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.HELMET.id} />
        <Button title="Armor" className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.ARMOR.id)} imgAsText text={filterSprites[45]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.ARMOR.id} />
        <Button title="Ring" className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.RING.id)} imgAsText text={filterSprites[46]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.RING.id} />
        <Button title="Necklace" className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.NECKLACE.id)} imgAsText text={filterSprites[47]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.NECKLACE.id} />
        <MobileFilterSelect label="Slot" value={filters.slot} onChange={event => toggleFilter('slot', event.target.value === '' ? null : Number(event.target.value))} options={Object.values(EQUIPMENT_SLOT_DEFINITIONS).filter(option => option.id !== EQUIPMENT_SLOT_DEFINITIONS.OTHER.id).map(option => ({value: option.id, label: option.name[0] + option.name.slice(1).toLowerCase()}))} />
    </div>)
}

function ItemAttributeFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-attributes flex-row'>
        <Button title="Strength requirement" className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button title="Dexterity requirement" className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button title="Intelligence requirement" className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
        <MobileFilterSelect label="Attribute" value={filters.attributeRequirement} onChange={event => toggleFilter('attributeRequirement', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ATTRIBUTE_DEFINITIONS.STRENGTH.id, label: 'Strength'}, {value: ATTRIBUTE_DEFINITIONS.DEXTERITY.id, label: 'Dexterity'}, {value: ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id, label: 'Intelligence'}]} />
    </div>)
}

function ItemRarityFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-rarities flex-row'>
        <Button title="Common rarity" className='filters-rarity-button' round color={"common"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.COMMON.id)} text={filterSprites[30]} active={filters.rarity === RARITY_DEFINITIONS.COMMON.id} />
        <Button title="Uncommon rarity" className='filters-rarity-button' round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button title="Rare rarity" className='filters-rarity-button' round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button title="Epic rarity" className='filters-rarity-button' round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button title="Legendary rarity" className='filters-rarity-button' round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
        <Button title="Mythic rarity" className='filters-rarity-button' round color={"mythic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.MYTHIC.id)} text={filterSprites[35]} active={filters.rarity === RARITY_DEFINITIONS.MYTHIC.id} />
        <Button title="Heroic rarity" className='filters-rarity-button' round color={"heroic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.HEROIC.id)} text={filterSprites[36]} active={filters.rarity === RARITY_DEFINITIONS.HEROIC.id} />
        <Button title="Divine rarity" className='filters-rarity-button' round color={"divine"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.DIVINE.id)} text={filterSprites[37]} active={filters.rarity === RARITY_DEFINITIONS.DIVINE.id} />
        <Button title="Ancient rarity" className='filters-rarity-button' round color={"ancient"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.ANCIENT.id)} text={filterSprites[38]} active={filters.rarity === RARITY_DEFINITIONS.ANCIENT.id} />
        <MobileFilterSelect label="Rarity" value={filters.rarity} onChange={event => toggleFilter('rarity', event.target.value === '' ? null : Number(event.target.value))} options={Object.values(RARITY_DEFINITIONS).map(option => ({value: option.id, label: option.name[0] + option.name.slice(1).toLowerCase()}))} />
    </div>)
}

function ItemFilters({ savedItems = false, setFiltersAdvanced, advanced, toggleFilter, setSearch, clearFilters, filters, filterSprites, topOffset, sortOrder, onToggleSort }) {

    if (!advanced) {
        return (
            <div className='filters flex-row card' style={{ top: topOffset }}>
                <Button title="Show or hide advanced filters" className='filters-advanced-button' round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button title="Clear all filters" className='filters-clear-button' round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className="name-search-filter">
                    <input className="selectable w-100" type="text" aria-label="Search items by name" placeholder="Search items..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <Button title={sortOrder == 0 ? "Sort A to Z" : "Sort Z to A"} className='filters-sort-button' round onClick={onToggleSort} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card'>
                <Button title="Show or hide advanced filters" className='filters-advanced-button' round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button title="Clear all filters" className='filters-clear-button' round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className="name-search-filter">
                    <input className="selectable w-100" type="text" aria-label="Search items by name" placeholder="Search items..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <Button title={sortOrder == 0 ? "Sort A to Z" : "Sort Z to A"} className='filters-sort-button' round onClick={onToggleSort} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
                <div className='flex-wrapper' />
                <ItemSetUniqueFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <ItemAttributeFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                {savedItems && <ItemRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />}
            </div>
        )
    }
}

export default memo(ItemFilters)