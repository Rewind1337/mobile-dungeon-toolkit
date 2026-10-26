import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'

import '../css/item.scss'

import Item from './Item.jsx'
import { filterSprites } from '../database/db_sprites.jsx'
import ItemFilters from './ItemFilters.jsx'

function ItemList({ extraHeight = 0, filtersOffset = 0, savedItems, headerText, itemsRef, itemType = null, setSelectedItemId }) {
    const { listHeight, listRef, events } = useDynamicList(extraHeight);
    const [filters, setFilters] = useState({
        set: null,
        unique: null,
        slot: null,
        attributeRequirement: null,
        rarity: null,
        name: "",
    });
    const [filtersAdvanced, setFiltersAdvanced] = useState(false)
    const [sortOrder, setSortOrder] = useState(0) // 0 alphabetical, 1 reverse alphabetical

    const allItems = useMemo(() => {
        return [
            ...itemsRef.WEAPONS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.HELMETS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.ARMORS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.NECKLACES.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.RINGS.map((item) => ({ ...item, key: item.id })),
        ];
    }, [itemsRef]);

    const toggleFilter = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type] === value ? null : value,
        }));
    };

    const clearFilters = () => {
        setFilters({ set: null, unique: null, slot: null, attributeRequirement: null, rarity: null, name: "" });
    };

    // Memoize filtered items
    const filteredItems = useMemo(() => {
        const result = allItems.filter((itemObj) => {
            const matchesItemType = itemType === null || itemObj.slot === itemType
            const matchesSet = filters.set === null || itemObj.iconType === filters.set;
            const matchesUnique = filters.unique === null || (filters.unique ? itemObj.unique !== 'NOTHING' : itemObj.unique === 'NOTHING');
            const matchesSlot = filters.slot === null || itemObj.slot === filters.slot;
            const matchesAttribute = filters.attributeRequirement === null || itemObj.attributeRequirement === filters.attributeRequirement;
            const matchesRarity = filters.rarity === null || itemObj.rarity === filters.rarity;
            const matchesName = itemObj.name.toLowerCase().includes(filters.name.trim().toLowerCase());

            return matchesItemType && matchesSet && matchesUnique && matchesSlot && matchesAttribute && matchesRarity && matchesName;
        });

        return result.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            return sortOrder === 0 ? comparison : -comparison;
        });
    }, [allItems, filters, itemType, sortOrder]);

    return (<>
        <div className='flex-row'>
            <ItemFilters setFiltersAdvanced={setFiltersAdvanced} advanced={filtersAdvanced} toggleFilter={toggleFilter} setSearch={(name) => setFilters((prev) => ({ ...prev, name }))} clearFilters={clearFilters} filters={filters} filterSprites={filterSprites} topOffset={filtersOffset} sortOrder={sortOrder} onToggleSort={() => setSortOrder(order => order === 0 ? 1 : 0)} />
        </div>
        <div className='header-big'>{headerText}</div>

        <div className='list item-list flex-row' ref={listRef} {...events} style={(filtersAdvanced ? { maxHeight: (listHeight - 189)} : { maxHeight: listHeight })}>
            {filteredItems.length === 0 ? (
                <div className="text-big margin-auto">No items match the selected filters</div>
            ) : (
                filteredItems.map((itemObj) => (
                    <Item
                        itemObj={itemObj}
                        key={itemObj.key}
                        level={savedItems ? (itemObj.level ?? 1) : null}
                        onClick={() => setSelectedItemId({ slot: itemObj.slot, id: itemObj.id })}
                    />
                ))
            )}
        </div>
    </>
    )
}

export default memo(ItemList)