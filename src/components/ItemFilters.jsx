import { memo, useState } from 'react'
import Button from './Button.jsx'
import { EQUIPMENT_SLOT_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function ItemSetUniqueFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-special flex-row'>
        <Button className='filters-special-button' round onClick={() => toggleFilter('unique', 'unique')} imgAsText text={filterSprites[42]} active={filters.unique === 'unique'} />
        <Button className='filters-special-button' round onClick={() => toggleFilter('set', 'twoset')} imgAsText text={filterSprites[40]} active={filters.set === 'twoset'} />
        <Button className='filters-special-button' round onClick={() => toggleFilter('set', 'fourset')} imgAsText text={filterSprites[41]} active={filters.set === 'fourset'} />
    </div>)
}

function ItemSlotFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-slots flex-row'>
        <Button className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.WEAPON.id)} imgAsText text={filterSprites[43]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.WEAPON.id} />
        <Button className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.HELMET.id)} imgAsText text={filterSprites[44]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.HELMET.id} />
        <Button className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.ARMOR.id)} imgAsText text={filterSprites[45]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.ARMOR.id} />
        <Button className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.RING.id)} imgAsText text={filterSprites[46]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.RING.id} />
        <Button className='filters-slot-button' round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT_DEFINITIONS.NECKLACE.id)} imgAsText text={filterSprites[47]} active={filters.slot === EQUIPMENT_SLOT_DEFINITIONS.NECKLACE.id} />
    </div>)
}

function ItemAttributeFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-attributes flex-row'>
        <Button className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button className='filters-attribute-button' round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.attributeRequirement === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
    </div>)
}

function ItemRarityFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-rarities flex-row'>
        <Button className='filters-rarity-button' round color={"common"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.COMMON.id)} text={filterSprites[30]} active={filters.rarity === RARITY_DEFINITIONS.COMMON.id} />
        <Button className='filters-rarity-button' round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button className='filters-rarity-button' round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button className='filters-rarity-button' round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button className='filters-rarity-button' round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
        <Button className='filters-rarity-button' round color={"mythic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.MYTHIC.id)} text={filterSprites[35]} active={filters.rarity === RARITY_DEFINITIONS.MYTHIC.id} />
        <Button className='filters-rarity-button' round color={"heroic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.HEROIC.id)} text={filterSprites[36]} active={filters.rarity === RARITY_DEFINITIONS.HEROIC.id} />
        <Button className='filters-rarity-button' round color={"divine"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.DIVINE.id)} text={filterSprites[37]} active={filters.rarity === RARITY_DEFINITIONS.DIVINE.id} />
        <Button className='filters-rarity-button' round color={"ancient"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.ANCIENT.id)} text={filterSprites[38]} active={filters.rarity === RARITY_DEFINITIONS.ANCIENT.id} />
    </div>)
}

function ItemFilters({ setFiltersAdvanced, advanced, toggleFilter, setSearch, clearFilters, filters, filterSprites, topOffset }) {
    const [sortOrder, setSortOrder] = useState(0) // 0 ascending, 1 descending, unused

    if (!advanced) {
        return (
            <div className='filters flex-row card' style={{ top: topOffset }}>
                <Button className='filters-advanced-button' round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button className='filters-clear-button' round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className="name-search-filter">
                    <input className="selectable" type="text" aria-label="Search items by name" placeholder="Search items..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <Button className='filters-sort-button' round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card'>
                <Button className='filters-advanced-button' round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button className='filters-clear-button' round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className="name-search-filter">
                    <input className="selectable" type="text" aria-label="Search items by name" placeholder="Search items..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <Button className='filters-sort-button' round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
                <div className='flex-wrapper' />
                <ItemSetUniqueFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <ItemAttributeFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <ItemRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
            </div>
        )
    }
}

export default memo(ItemFilters)