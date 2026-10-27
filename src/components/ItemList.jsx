import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'

import '../css/item.scss'

import Item from './Item.jsx'
import { filterSprites } from '../database/db_sprites.jsx'
import ItemFilters from './ItemFilters.jsx'
import BackToTopButton from './BackToTopButton.jsx'
import { ATTRIBUTE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from '../database/enums.jsx'

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [String(value)]
    if (typeof value !== 'object' || seen.has(value)) return []
    seen.add(value)
    return Object.entries(value).flatMap(([key, child]) => [key, ...getSearchableValues(child, seen)])
}
function ItemList({ extraHeight = 0, filtersOffset = 0, savedItems, headerText, itemsRef, setsRef = [], itemType = null, setSelectedItemId }) {
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
            const set = (setsRef ?? []).find(setEntry => setEntry.id === itemObj.set)
            const searchable = [...getSearchableValues(itemObj), itemObj.name,
                getEnumNameById(EQUIPMENT_SLOT_DEFINITIONS, Number(itemObj.slot)) ?? '',
                getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(itemObj.attributeRequirement)) ?? '',
                getEnumNameById(RARITY_DEFINITIONS, Number(itemObj.rarity)) ?? '', set?.name ?? '',
                ...Object.entries(PERK_DEFINITIONS).flatMap(([key, perk]) => (itemObj.fixedPerks ?? []).some(value => value.id === perk.id) ? [key, perk.name] : [])
            ].join(' ').toLowerCase()
            const searchQuery = filters.name.trim().toLowerCase()
            const isUnique = itemObj.unique !== undefined && itemObj.unique !== null && itemObj.unique !== 0 && itemObj.unique !== 'NOTHING'
            const matchesName = !searchQuery || (searchQuery === 'unique' ? isUnique : searchQuery === 'not unique' ? !isUnique : searchable.includes(searchQuery));

            return matchesItemType && matchesSet && matchesUnique && matchesSlot && matchesAttribute && matchesRarity && matchesName;
        });

        return result.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            return sortOrder === 0 ? comparison : -comparison;
        });
    }, [allItems, filters, itemType, sortOrder, setsRef]);

    return (<>
        <div className='flex-row'>
            <ItemFilters savedItems={savedItems} setFiltersAdvanced={setFiltersAdvanced} advanced={filtersAdvanced} toggleFilter={toggleFilter} setSearch={(name) => setFilters((prev) => ({ ...prev, name }))} clearFilters={clearFilters} filters={filters} filterSprites={filterSprites} topOffset={filtersOffset} sortOrder={sortOrder} onToggleSort={() => setSortOrder(order => order === 0 ? 1 : 0)} />
        </div>
        <div className='header-big'>{headerText}</div>

        <div className='list item-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
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
        <BackToTopButton scrollRef={listRef} />
    </>
    )
}

export default memo(ItemList)