import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'

import '../css/item.scss'

import Item from './Item.jsx'
import Button from './Button.jsx'
import { attributeSprites, iconSprites, raritySprites, filterSprites } from '../database/db_sprites.jsx'
import { ATTRIBUTE } from '../database/enums.jsx'
import ItemFilters from './ItemFilters.jsx'

function ItemList({ setForceUpdate = () => { }, extraHeight = 0, filtersOffset = 0, savedItems, headerText, itemsRef, itemType = null, setSelectedItemId, setsRef }) {
    const { listHeight, listRef, events } = useDynamicList(setForceUpdate, extraHeight);
    const [filters, setFilters] = useState({
        set: null,
        unique: null,
        slot: null,
        attributeRequirement: null,
        rarity: null,
    });
    const [filtersAdvanced, setFiltersAdvanced] = useState(false)

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
        <div className='header-big'>
            <div>
                <Button className='filters-button' round onClick={() => { setFiltersAdvanced(!filtersAdvanced) }} text={"Filters"} />
                <ItemFilters advanced={filtersAdvanced} toggleFilter={toggleFilter} clearFilters={clearFilters} filters={filters} filterSprites={filterSprites} topOffset={filtersOffset} />
            </div>
            {headerText}</div>

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