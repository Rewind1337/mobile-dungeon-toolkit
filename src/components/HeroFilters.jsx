import { memo } from 'react'
import Button from './Button.jsx'
import { ELEMENT_DEFINITIONS, ROLE_DEFINITIONS, ATTRIBUTE_DEFINITIONS, RARITY_DEFINITIONS} from '../database/enums.jsx'

function MobileFilterSelect({ label, value, onChange, options }) {
    return <label className="mobile-filter-control"><span>{label}</span><select aria-label={label} value={value ?? ""} onChange={onChange}><option value="">All</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function HeroElementFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-elements flex-row'>
        <Button className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.FIRE.id)} imgAsText text={filterSprites[1]} active={filters.element === ELEMENT_DEFINITIONS.FIRE.id} />
        <Button className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.WATER.id)} imgAsText text={filterSprites[2]} active={filters.element === ELEMENT_DEFINITIONS.WATER.id} />
        <Button className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.NATURE.id)} imgAsText text={filterSprites[3]} active={filters.element === ELEMENT_DEFINITIONS.NATURE.id} />
        <Button className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.LIGHT.id)} imgAsText text={filterSprites[4]} active={filters.element === ELEMENT_DEFINITIONS.LIGHT.id} />
        <Button className='filters-element-button' round onClick={() => toggleFilter('element', ELEMENT_DEFINITIONS.SHADOW.id)} imgAsText text={filterSprites[5]} active={filters.element === ELEMENT_DEFINITIONS.SHADOW.id} />
        <MobileFilterSelect label="Element" value={filters.element} onChange={event => toggleFilter('element', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ELEMENT_DEFINITIONS.FIRE.id, label: 'Fire'}, {value: ELEMENT_DEFINITIONS.WATER.id, label: 'Water'}, {value: ELEMENT_DEFINITIONS.NATURE.id, label: 'Nature'}, {value: ELEMENT_DEFINITIONS.LIGHT.id, label: 'Light'}, {value: ELEMENT_DEFINITIONS.SHADOW.id, label: 'Shadow'}]} />
    </div>)
}

function HeroRoleFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-roles flex-row'>
        <Button className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.OFFENSIVE.id)} imgAsText text={filterSprites[10]} active={filters.role === ROLE_DEFINITIONS.OFFENSIVE.id} />
        <Button className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.DEFENSIVE.id)} imgAsText text={filterSprites[11]} active={filters.role === ROLE_DEFINITIONS.DEFENSIVE.id} />
        <Button className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.CONTROL.id)} imgAsText text={filterSprites[12]} active={filters.role === ROLE_DEFINITIONS.CONTROL.id} />
        <Button className='filters-role-button' round onClick={() => toggleFilter('role', ROLE_DEFINITIONS.SUPPORT.id)} imgAsText text={filterSprites[13]} active={filters.role === ROLE_DEFINITIONS.SUPPORT.id} />
        <MobileFilterSelect label="Role" value={filters.role} onChange={event => toggleFilter('role', event.target.value === '' ? null : Number(event.target.value))} options={Object.values(ROLE_DEFINITIONS).map(option => ({value: option.id, label: option.name[0] + option.name.slice(1).toLowerCase()}))} />
    </div>)
}

function HeroAttributeFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-attributes flex-row'>
        <Button className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.STRENGTH.id)} imgAsText text={filterSprites[20]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.STRENGTH.id} />
        <Button className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.DEXTERITY.id)} imgAsText text={filterSprites[21]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.DEXTERITY.id} />
        <Button className='filters-attribute-button' round onClick={() => toggleFilter('mainAttribute', ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id)} imgAsText text={filterSprites[22]} active={filters.mainAttribute === ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id} />
        <MobileFilterSelect label="Attribute" value={filters.mainAttribute} onChange={event => toggleFilter('mainAttribute', event.target.value === '' ? null : Number(event.target.value))} options={[{value: ATTRIBUTE_DEFINITIONS.STRENGTH.id, label: 'Strength'}, {value: ATTRIBUTE_DEFINITIONS.DEXTERITY.id, label: 'Dexterity'}, {value: ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id, label: 'Intelligence'}]} />
    </div>)
}

function HeroRarityFilters({ toggleFilter, filters, filterSprites }) {
    return (<div className='filter-group filters-group-rarities flex-row'>
        <Button className='filters-rarity-button' round color={"uncommon"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.UNCOMMON.id)} text={filterSprites[31]} active={filters.rarity === RARITY_DEFINITIONS.UNCOMMON.id} />
        <Button className='filters-rarity-button' round color={"rare"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.RARE.id)} text={filterSprites[32]} active={filters.rarity === RARITY_DEFINITIONS.RARE.id} />
        <Button className='filters-rarity-button' round color={"epic"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.EPIC.id)} text={filterSprites[33]} active={filters.rarity === RARITY_DEFINITIONS.EPIC.id} />
        <Button className='filters-rarity-button' round color={"legendary"} onClick={() => toggleFilter('rarity', RARITY_DEFINITIONS.LEGENDARY.id)} text={filterSprites[34]} active={filters.rarity === RARITY_DEFINITIONS.LEGENDARY.id} />
        <MobileFilterSelect label="Rarity" value={filters.rarity} onChange={event => toggleFilter('rarity', event.target.value === '' ? null : Number(event.target.value))} options={[{value: RARITY_DEFINITIONS.UNCOMMON.id, label: 'Uncommon'}, {value: RARITY_DEFINITIONS.RARE.id, label: 'Rare'}, {value: RARITY_DEFINITIONS.EPIC.id, label: 'Epic'}, {value: RARITY_DEFINITIONS.LEGENDARY.id, label: 'Legendary'}]} />
    </div>)
}

function HeroFilters({ setFiltersAdvanced, advanced, toggleFilter, setSearch, clearFilters, filters, filterSprites, sortOrder, onToggleSort }) {

    if (!advanced) {
        return (
            <div className='filters flex-row card'>
                <Button className='filters-advanced-button' round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button className='filters-clear-button' round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className="name-search-filter">
                    <input className="selectable w-100" type="text" aria-label="Search heroes by name" placeholder="Search heroes..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <Button className='filters-sort-button' round onClick={onToggleSort} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card'>
                <Button className='filters-advanced-button' round onClick={() => {setFiltersAdvanced(advanced => !advanced)}} imgAsText text={(advanced ? filterSprites[54] : filterSprites[53])} active={advanced} />
                <Button className='filters-clear-button' round onClick={clearFilters} text={"ALL"} active={Object.values(filters).every((v) => v === null || v === "")} />
                <HeroElementFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className="name-search-filter">
                    <input className="selectable w-100" type="text" aria-label="Search heroes by name" placeholder="Search heroes..." value={filters.name} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <Button className='filters-sort-button' round onClick={onToggleSort} text={(sortOrder == 0 ? filterSprites[51] : filterSprites[52])} active={true} />
                <div className='flex-wrapper' />
                <HeroRoleFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <HeroAttributeFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
                <div className='flex-wrapper' />
                <div className='filter-group filters-group-special flex-row'>
                    <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                </div>
                <div className='flex-wrapper' />
                <HeroRarityFilters toggleFilter={toggleFilter} filters={filters} filterSprites={filterSprites} />
            </div>
        )
    }
}

export default memo(HeroFilters)