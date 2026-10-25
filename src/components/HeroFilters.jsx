import { memo, useState } from 'react'
import Button from './Button.jsx'
import { ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function HeroElementFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.FIRE.id)} imgAsText text={filterSprites[1]} active={filters.element === ELEMENT_DEFINITIONS.FIRE.id} />
        <Button round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.WATER.id)} imgAsText text={filterSprites[2]} active={filters.element === ELEMENT_DEFINITIONS.WATER.id} />
        <Button round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.NATURE.id)} imgAsText text={filterSprites[3]} active={filters.element === ELEMENT_DEFINITIONS.NATURE.id} />
        <Button round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.LIGHT.id)} imgAsText text={filterSprites[4]} active={filters.element === ELEMENT_DEFINITIONS.LIGHT.id} />
        <Button round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.SHADOW.id)} imgAsText text={filterSprites[5]} active={filters.element === ELEMENT_DEFINITIONS.SHADOW.id} />
    </div>)
}

function HeroRoleFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.OFFENSIVE.id)} imgAsText text={filterSprites[10]} active={filters.role === ROLE_DEFINITIONS.OFFENSIVE.id} />
        <Button round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.DEFENSIVE.id)} imgAsText text={filterSprites[11]} active={filters.role === ROLE_DEFINITIONS.DEFENSIVE.id} />
        <Button round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.CONTROL.id)} imgAsText text={filterSprites[12]} active={filters.role === ROLE_DEFINITIONS.CONTROL.id} />
        <Button round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.SUPPORT.id)} imgAsText text={filterSprites[13]} active={filters.role === ROLE_DEFINITIONS.SUPPORT.id} />
    </div>)
}

function HeroAttributeFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
    </div>)
}

function HeroRarityFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group flex-row'>
        <Button round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
    </div>)
}

function HeroFilters({ setFiltersAdvanced, advanced, toggleFilter, setSearch, clearFilters, filters, filterSprites }) {
    const [sortOrder, setSortOrder] = useState(0) // 0 ascending, 1 descending, unused

    if (!advanced) {
        return (
            <div className='filters flex-row card'>
                <Button round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                <Button round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
                <div className="name-search-filter">
                    <input className="selectable" type="text" aria-label="Search heroes by name" placeholder="Search heroes..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                    {filters.name !== "" && <button type="button" className="search-clear" aria-label="Clear hero search" onClick={() => setSearch("")}>×</button>}
                </div>
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card'>
                <Button round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                <Button round onClick={() => setSortOrder(sortOrder => !sortOrder)} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
                <div className="name-search-filter">
                    <input className="selectable" type="text" aria-label="Search heroes by name" placeholder="Search heroes..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                    {filters.name !== "" && <button type="button" className="search-clear" aria-label="Clear hero search" onClick={() => setSearch("")}>×</button>}
                </div>
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