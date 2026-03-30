import { memo, useState } from 'react'
import Button from './Button.jsx'

function HeroFilters({ advanced, toggleFilter, clearFilters, filters, filterSprites }) {
    if (!advanced) {
        return (
            <div className='filters flex-row card'>
                <div className='orb-spacer' />
                <Button round onClick={clearFilters} text={filterSprites[0]} active={Object.values(filters).every((v) => v === null)} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('element', 0)} imgAsText text={filterSprites[1]} active={filters.element === 0} />
                <Button round onClick={() => toggleFilter('element', 1)} imgAsText text={filterSprites[2]} active={filters.element === 1} />
                <Button round onClick={() => toggleFilter('element', 2)} imgAsText text={filterSprites[3]} active={filters.element === 2} />
                <Button round onClick={() => toggleFilter('element', 3)} imgAsText text={filterSprites[4]} active={filters.element === 3} />
                <Button round onClick={() => toggleFilter('element', 4)} imgAsText text={filterSprites[5]} active={filters.element === 4} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                <div className='orb-spacer' />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card' style={{ filter: "drop-shadow(0 0 20px black)" }}>
                <div className='orb-spacer' />
                <Button round onClick={clearFilters} text={filterSprites[0]} active={Object.values(filters).every((v) => v === null)} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('element', 0)} imgAsText text={filterSprites[1]} active={filters.element === 0} />
                <Button round onClick={() => toggleFilter('element', 1)} imgAsText text={filterSprites[2]} active={filters.element === 1} />
                <Button round onClick={() => toggleFilter('element', 2)} imgAsText text={filterSprites[3]} active={filters.element === 2} />
                <Button round onClick={() => toggleFilter('element', 3)} imgAsText text={filterSprites[4]} active={filters.element === 3} />
                <Button round onClick={() => toggleFilter('element', 4)} imgAsText text={filterSprites[5]} active={filters.element === 4} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('role', 0)} text={filterSprites[10]} active={filters.role === 0} />
                <Button round onClick={() => toggleFilter('role', 1)} text={filterSprites[11]} active={filters.role === 1} />
                <Button round onClick={() => toggleFilter('role', 2)} text={filterSprites[12]} active={filters.role === 2} />
                <Button round onClick={() => toggleFilter('role', 3)} text={filterSprites[13]} active={filters.role === 3} />
                <div className='orb-spacer' />
                <div className='flex-wrapper' />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('mainAttribute', 1)} text={filterSprites[20]} active={filters.mainAttribute === 1} />
                <Button round onClick={() => toggleFilter('mainAttribute', 2)} text={filterSprites[21]} active={filters.mainAttribute === 2} />
                <Button round onClick={() => toggleFilter('mainAttribute', 3)} text={filterSprites[22]} active={filters.mainAttribute === 3} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('rarity', 1)} text={filterSprites[31]} active={filters.rarity === 1} />
                <Button round onClick={() => toggleFilter('rarity', 2)} text={filterSprites[32]} active={filters.rarity === 2} />
                <Button round onClick={() => toggleFilter('rarity', 3)} text={filterSprites[33]} active={filters.rarity === 3} />
                <Button round onClick={() => toggleFilter('rarity', 4)} text={filterSprites[34]} active={filters.rarity === 4} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('isStarred', true)} imgAsText text={filterSprites[50]} active={filters.isStarred === true} />
                <div className='orb-spacer' />
            </div>
        )
    }
}

export default memo(HeroFilters)