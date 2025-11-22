import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'

import '../css/item.scss'

import Item from './Item.jsx'
import Button from './Button.jsx'
import { attributeSprites, iconSprites, raritySprites } from '../database/db_sprites.jsx'
import { ATTRIBUTE } from '../database/enums.jsx'

function ItemList({ setForceUpdate = () => { }, extraHeight = 0, savedItems, headerText, itemsRef, itemType = null, setSelectedItemId, setsRef }) {
    const { listHeight, listRef, events } = useDynamicList(setForceUpdate, extraHeight);
    const [filters, setFilters] = useState({
        set: null,
        unique: null,
        slot: null,
        attributeRequirement: null,
        rarity: null,
    });

    const allItems = useMemo(() => {
        return [
            ...itemsRef.WEAPONS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.HELMETS.map((item) => ({ ...item, key: 1000 + item.id })),
            ...itemsRef.ARMORS.map((item) => ({ ...item, key: 2000 + item.id })),
            ...itemsRef.NECKLACES.map((item) => ({ ...item, key: 3000 + item.id })),
            ...itemsRef.RINGS.map((item) => ({ ...item, key: 4000 + item.id })),
        ];
    }, [itemsRef]);

    const toggleFilter = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type] === value ? null : value,
        }));
    };

    const clearFilters = () => {
        setFilters({ set: null, unique: null, slot: null, attributeRequirement: null, rarity: null });
    };

    // Memoize filtered items
    const filteredItems = useMemo(() => {
        const result = allItems.filter((itemObj) => {
            const matchesSet = filters.set === null || itemObj.iconType === filters.set;
            const matchesUnique = filters.unique === null || (filters.unique ? itemObj.unique !== 'NOTHING' : itemObj.unique === 'NOTHING');
            const matchesSlot = filters.slot === null || itemObj.slot === filters.slot;
            const matchesAttribute = filters.attributeRequirement === null || itemObj.attributeRequirement === filters.attributeRequirement;
            const matchesRarity = filters.rarity === null || itemObj.rarity === filters.rarity;

            return matchesSet && matchesUnique && matchesSlot && matchesAttribute && matchesRarity;
        });
        return result;
    }, [allItems, filters]);

    return (<>
        <div className='header-big'>{headerText}</div>
        <div className='filters flex-row card'>
            <Button round onClick={clearFilters} text={attributeSprites[ATTRIBUTE.NONE]} active={Object.values(filters).every((v) => v === null)} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('set', 'twoset')} imgAsText text={iconSprites['twoset']} active={filters.set === 'twoset'} />
            <Button round onClick={() => toggleFilter('set', 'fourset')} imgAsText text={iconSprites['fourset']} active={filters.set === 'fourset'} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('unique', 'unique')} imgAsText text={iconSprites['unique']} active={filters.unique === 'unique'} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('slot', 0)} imgAsText text={iconSprites['weapons']} active={filters.slot === 0} />
            <Button round onClick={() => toggleFilter('slot', 1)} imgAsText text={iconSprites['helmets']} active={filters.slot === 1} />
            <Button round onClick={() => toggleFilter('slot', 2)} imgAsText text={iconSprites['armors']} active={filters.slot === 2} />
            <Button round onClick={() => toggleFilter('slot', 3)} imgAsText text={iconSprites['rings']} active={filters.slot === 3} />
            <Button round onClick={() => toggleFilter('slot', 4)} imgAsText text={iconSprites['necklaces']} active={filters.slot === 4} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('attributeRequirement', 1)} text={attributeSprites[ATTRIBUTE.STRENGTH]} active={filters.attributeRequirement === 1} />
            <Button round onClick={() => toggleFilter('attributeRequirement', 2)} text={attributeSprites[ATTRIBUTE.DEXTERITY]} active={filters.attributeRequirement === 2} />
            <Button round onClick={() => toggleFilter('attributeRequirement', 3)} text={attributeSprites[ATTRIBUTE.INTELLIGENCE]} active={filters.attributeRequirement === 3} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('rarity', 0)} text={raritySprites[0]} active={filters.rarity === 0} />
            <Button round onClick={() => toggleFilter('rarity', 1)} text={raritySprites[1]} active={filters.rarity === 1} />
            <Button round onClick={() => toggleFilter('rarity', 2)} text={raritySprites[2]} active={filters.rarity === 2} />
            <Button round onClick={() => toggleFilter('rarity', 3)} text={raritySprites[3]} active={filters.rarity === 3} />
            <Button round onClick={() => toggleFilter('rarity', 4)} text={raritySprites[4]} active={filters.rarity === 4} />
            <Button round onClick={() => toggleFilter('rarity', 5)} text={raritySprites[5]} active={filters.rarity === 5} />
        </div>
        <div className='list item-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredItems.length === 0 ? (
                <div className="text">No items match the selected filters</div>
            ) : (
                filteredItems.map((itemObj) => (
                    <Item
                        itemObj={itemObj}
                        key={itemObj.key}
                        level={null}
                        onClick={() => setSelectedItemId({ slot: itemObj.slot, id: savedItems ? itemObj.saveId : itemObj.id })}
                    />
                ))
            )}
        </div>
    </>
    )
}

export default memo(ItemList)