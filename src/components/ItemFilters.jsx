import { memo, useState } from 'react'
import Button from './Button.jsx'

function ItemFilters({ advanced, toggleFilter, clearFilters, filters, filterSprites, topOffset }) {
    if (!advanced) {
        return (
            <div className='filters flex-row card' style={{ top: topOffset }}>
                <div className='orb-spacer' />
                <Button round onClick={clearFilters} text={filterSprites[0]} active={Object.values(filters).every((v) => v === null)} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('slot', 0)} imgAsText text={filterSprites[43]} active={filters.slot === 0} />
                <Button round onClick={() => toggleFilter('slot', 1)} imgAsText text={filterSprites[44]} active={filters.slot === 1} />
                <Button round onClick={() => toggleFilter('slot', 2)} imgAsText text={filterSprites[45]} active={filters.slot === 2} />
                <Button round onClick={() => toggleFilter('slot', 3)} imgAsText text={filterSprites[46]} active={filters.slot === 3} />
                <Button round onClick={() => toggleFilter('slot', 4)} imgAsText text={filterSprites[47]} active={filters.slot === 4} />
                <div className='orb-spacer' />
            </div>
        )
    } else {
        return (
            <div className='filters flex-row flex-wrap card' style={{ top: topOffset, filter: "drop-shadow(0 0 20px black)" }}>
                <div className='orb-spacer' />
                <Button round onClick={clearFilters} text={filterSprites[0]} active={Object.values(filters).every((v) => v === null)} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('set', 'twoset')} imgAsText text={filterSprites[40]} active={filters.set === 'twoset'} />
                <Button round onClick={() => toggleFilter('set', 'fourset')} imgAsText text={filterSprites[41]} active={filters.set === 'fourset'} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('unique', 'unique')} imgAsText text={filterSprites[42]} active={filters.unique === 'unique'} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('slot', 0)} imgAsText text={filterSprites[43]} active={filters.slot === 0} />
                <Button round onClick={() => toggleFilter('slot', 1)} imgAsText text={filterSprites[44]} active={filters.slot === 1} />
                <Button round onClick={() => toggleFilter('slot', 2)} imgAsText text={filterSprites[45]} active={filters.slot === 2} />
                <Button round onClick={() => toggleFilter('slot', 3)} imgAsText text={filterSprites[46]} active={filters.slot === 3} />
                <Button round onClick={() => toggleFilter('slot', 4)} imgAsText text={filterSprites[47]} active={filters.slot === 4} />
                <div className='orb-spacer' />
                <div className='flex-wrapper' />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('attributeRequirement', 1)} text={filterSprites[20]} active={filters.attributeRequirement === 1} />
                <Button round onClick={() => toggleFilter('attributeRequirement', 2)} text={filterSprites[21]} active={filters.attributeRequirement === 2} />
                <Button round onClick={() => toggleFilter('attributeRequirement', 3)} text={filterSprites[22]} active={filters.attributeRequirement === 3} />
                <div className='orb-spacer' />
                <Button round onClick={() => toggleFilter('rarity', 0)} text={filterSprites[30]} active={filters.rarity === 0} />
                <Button round onClick={() => toggleFilter('rarity', 1)} text={filterSprites[31]} active={filters.rarity === 1} />
                <Button round onClick={() => toggleFilter('rarity', 2)} text={filterSprites[32]} active={filters.rarity === 2} />
                <Button round onClick={() => toggleFilter('rarity', 3)} text={filterSprites[33]} active={filters.rarity === 3} />
                <Button round onClick={() => toggleFilter('rarity', 4)} text={filterSprites[34]} active={filters.rarity === 4} />
                <Button round onClick={() => toggleFilter('rarity', 5)} text={filterSprites[35]} active={filters.rarity === 5} />
                <div className='orb-spacer' />
            </div>
        )
    }
}

export default memo(ItemFilters)