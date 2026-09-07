import { memo, useState } from 'react'
import Button from './Button.jsx'
import { ELEMENT, ROLE, ATTRIBUTE, RARITY} from '../database/enums.jsx'

function HeroElementFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('element', ELEMENT.FIRE)} imgAsText text={filterSprites[1]} active={filters.element === ELEMENT.FIRE} />
        <Button round onClick={() => toggleFilter('element', ELEMENT.WATER)} imgAsText text={filterSprites[2]} active={filters.element === ELEMENT.WATER} />
        <Button round onClick={() => toggleFilter('element', ELEMENT.NATURE)} imgAsText text={filterSprites[3]} active={filters.element === ELEMENT.NATURE} />
        <Button round onClick={() => toggleFilter('element', ELEMENT.LIGHT)} imgAsText text={filterSprites[4]} active={filters.element === ELEMENT.LIGHT} />
        <Button round onClick={() => toggleFilter('element', ELEMENT.SHADOW)} imgAsText text={filterSprites[5]} active={filters.element === ELEMENT.SHADOW} />
    </div>)
}

function HeroRoleFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('role', ROLE.OFFENSIVE)} imgAsText text={filterSprites[10]} active={filters.role === ROLE.OFFENSIVE} />
        <Button round onClick={() => toggleFilter('role', ROLE.DEFENSIVE)} imgAsText text={filterSprites[11]} active={filters.role === ROLE.DEFENSIVE} />
        <Button round onClick={() => toggleFilter('role', ROLE.CONTROL)} imgAsText text={filterSprites[12]} active={filters.role === ROLE.CONTROL} />
        <Button round onClick={() => toggleFilter('role', ROLE.SUPPORT)} imgAsText text={filterSprites[13]} active={filters.role === ROLE.SUPPORT} />
    </div>)
}

function HeroAttributeFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE.STRENGTH)} imgAsText text={filterSprites[20]} active={filters.mainAttribute === ATTRIBUTE.STRENGTH} />
        <Button round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE.DEXTERITY)} imgAsText text={filterSprites[21]} active={filters.mainAttribute === ATTRIBUTE.DEXTERITY} />
        <Button round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE.INTELLIGENCE)} imgAsText text={filterSprites[22]} active={filters.mainAttribute === ATTRIBUTE.INTELLIGENCE} />
    </div>)
}

function HeroRarityFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY.UNCOMMON)} text={filterSprites[31]} active={filters.rarity === RARITY.UNCOMMON} />
        <Button round color={"rare"} onClick={() => toggleFilter('rarity', RARITY.RARE)} text={filterSprites[32]} active={filters.rarity === RARITY.RARE} />
        <Button round color={"epic"} onClick={() => toggleFilter('rarity', RARITY.EPIC)} text={filterSprites[33]} active={filters.rarity === RARITY.EPIC} />
        <Button round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY.LEGENDARY)} text={filterSprites[34]} active={filters.rarity === RARITY.LEGENDARY} />
    </div>)
}

function HeroFilters({ setFiltersAdvanced, advanced, toggleFilter, clearFilters, filters, filterSprites }) {
    const [sortOrder, setSortOrder] = useState(0) // 0 ascending, 1 descending, unused

    if (!advanced) {
        return (
            <div className='filters flex-row card'>
                <Button round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null)} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                <Button round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card'>
                <Button round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null)} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                <Button round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
                <div className='flex-wrapper' />
                <HeroRoleFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <HeroAttributeFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <HeroRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
            </div>
        )
    }
}

export default memo(HeroFilters)