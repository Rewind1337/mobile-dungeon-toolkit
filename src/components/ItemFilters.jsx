import { memo, useState } from 'react'
import Button from './Button.jsx'
import { EQUIPMENT_SLOT, ATTRIBUTE, RARITY} from '../database/enums.jsx'

function ItemSetUniqueFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('set', 'twoset')} imgAsText text={filterSprites[40]} active={filters.set === 'twoset'} />
        <Button round onClick={() => toggleFilter('set', 'fourset')} imgAsText text={filterSprites[41]} active={filters.set === 'fourset'} />
        <Button round onClick={() => toggleFilter('unique', 'unique')} imgAsText text={filterSprites[42]} active={filters.unique === 'unique'} />
    </div>)
}

function ItemSlotFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT.WEAPON)} imgAsText text={filterSprites[43]} active={filters.slot === EQUIPMENT_SLOT.WEAPON} />
        <Button round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT.HELMET)} imgAsText text={filterSprites[44]} active={filters.slot === EQUIPMENT_SLOT.HELMET} />
        <Button round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT.ARMOR)} imgAsText text={filterSprites[45]} active={filters.slot === EQUIPMENT_SLOT.ARMOR} />
        <Button round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT.RING)} imgAsText text={filterSprites[46]} active={filters.slot === EQUIPMENT_SLOT.RING} />
        <Button round onClick={() => toggleFilter('slot', EQUIPMENT_SLOT.NECKLACE)} imgAsText text={filterSprites[47]} active={filters.slot === EQUIPMENT_SLOT.NECKLACE} />
    </div>)
}

function ItemAttributeFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE.STRENGTH)} imgAsText text={filterSprites[20]} active={filters.attributeRequirement === ATTRIBUTE.STRENGTH} />
        <Button round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE.DEXTERITY)} imgAsText text={filterSprites[21]} active={filters.attributeRequirement === ATTRIBUTE.DEXTERITY} />
        <Button round onClick={() => toggleFilter('attributeRequirement', ATTRIBUTE.INTELLIGENCE)} imgAsText text={filterSprites[22]} active={filters.attributeRequirement === ATTRIBUTE.INTELLIGENCE} />
    </div>)
}

function ItemRarityFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round color={"common"} onClick={() => toggleFilter('rarity', RARITY.COMMON)} text={filterSprites[30]} active={filters.rarity === RARITY.COMMON} />
        <Button round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY.UNCOMMON)} text={filterSprites[31]} active={filters.rarity === RARITY.UNCOMMON} />
        <Button round color={"rare"} onClick={() => toggleFilter('rarity', RARITY.RARE)} text={filterSprites[32]} active={filters.rarity === RARITY.RARE} />
        <Button round color={"epic"} onClick={() => toggleFilter('rarity', RARITY.EPIC)} text={filterSprites[33]} active={filters.rarity === RARITY.EPIC} />
        <Button round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY.LEGENDARY)} text={filterSprites[34]} active={filters.rarity === RARITY.LEGENDARY} />
        <Button round color={"mythic"} onClick={() => toggleFilter('rarity', RARITY.MYTHIC)} text={filterSprites[35]} active={filters.rarity === RARITY.MYTHIC} />
        <Button round color={"heroic"} onClick={() => toggleFilter('rarity', RARITY.HEROIC)} text={filterSprites[36]} active={filters.rarity === RARITY.HEROIC} />
        <Button round color={"divine"} onClick={() => toggleFilter('rarity', RARITY.DIVINE)} text={filterSprites[37]} active={filters.rarity === RARITY.DIVINE} />
        <Button round color={"ancient"} onClick={() => toggleFilter('rarity', RARITY.ANCIENT)} text={filterSprites[38]} active={filters.rarity === RARITY.ANCIENT} />
    </div>)
}

function ItemFilters({ setFiltersAdvanced, advanced, toggleFilter, clearFilters, filters, filterSprites, topOffset }) {
    const [sortOrder, setSortOrder] = useState(0) // 0 ascending, 1 descending, unused

    if (!advanced) {
        return (
            <div className='filters flex-row card' style={{ top: topOffset }}>
                <Button round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null)} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <Button round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card'>
                <Button round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null)} />
                <ItemSlotFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <Button round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
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