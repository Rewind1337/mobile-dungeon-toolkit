import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'

import '../css/item.scss'

import Item from './Item.jsx'
import { filterSprites } from '../database/db_sprites.jsx'
import ItemFilters from './ItemFilters.jsx'
import BackToTopButton from './BackToTopButton.jsx'
import { ATTRIBUTE_DEFINITIONS, DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from '../database/enums.jsx'
import { isSearchAssetField, matchesSearchQuery, useUrlSearch } from '../js/search.jsx'

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [String(value)]
    if (typeof value !== 'object' || seen.has(value)) return []
    seen.add(value)
    return Object.entries(value).flatMap(([key, child]) => isSearchAssetField(key) ? [] : [key, ...getSearchableValues(child, seen)])
}
function ItemList({ extraHeight = 0, filtersOffset = 0, savedItems, headerText, itemsRef, setsRef = [], itemType = null, heroAttributeRequirement = null, setSelectedItemId }) {
    const { listHeight, listRef, events } = useDynamicList(extraHeight);
    const [search, setSearch, commitSearch] = useUrlSearch();
    const [filters, setFilters] = useState({
        set: null,
        unique: null,
        slot: null,
        attributeRequirement: null,
        rarity: null,
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
        setFilters({ set: null, unique: null, slot: null, attributeRequirement: null, rarity: null });
        setSearch("");
        commitSearch("");
    };

    // Memoize filtered items
    const filteredItems = useMemo(() => {
        const result = allItems.filter((itemObj) => {
            const matchesItemType = itemType === null || itemObj.slot === itemType
            const itemRequirement = itemObj.attributeRequirement
            const matchesHeroAttribute = heroAttributeRequirement == null
                || itemRequirement == null
                || Number(itemRequirement) === ATTRIBUTE_DEFINITIONS.NONE.id
                || Number(itemRequirement) === Number(heroAttributeRequirement)
            const hasSet = itemObj.set !== undefined && itemObj.set !== null && itemObj.set !== -1;
            const hasUnique = itemObj.unique !== undefined && itemObj.unique !== null && itemObj.unique !== 0 && itemObj.unique !== 'NOTHING';
            const matchesSet = filters.set === null || (filters.set === 'noSet' ? !hasSet : itemObj.iconType === filters.set);
            const matchesUnique = filters.unique === null || (filters.unique === 'unique' ? hasUnique : !hasUnique);
            const matchesSlot = filters.slot === null || itemObj.slot === filters.slot;
            const matchesAttribute = filters.attributeRequirement === null || itemObj.attributeRequirement === filters.attributeRequirement;
            const matchesRarity = filters.rarity === null || itemObj.rarity === filters.rarity;
            const set = (setsRef ?? []).find(setEntry => setEntry.id === itemObj.set)
            const searchable = [...getSearchableValues(itemObj), itemObj.name,
                getEnumNameById(EQUIPMENT_SLOT_DEFINITIONS, Number(itemObj.slot)) ?? '',
                getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(itemObj.attributeRequirement)) ?? '',
                getEnumNameById(RARITY_DEFINITIONS, Number(itemObj.rarity)) ?? '',
                getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(itemObj.dropSource)) ?? '',
                itemObj.dropLocation ?? '', set?.name ?? '',
                ...Object.entries(PERK_DEFINITIONS).flatMap(([key, perk]) => ([...(itemObj.fixedPerks ?? []), ...(itemObj.perks ?? [])].some(value => value && typeof value === 'object' ? value.id === perk.id : String(value).toUpperCase().replace(/\s/g, '_') === key || String(value) === String(perk.id)) ? [key, perk.name] : []))
            ].join(' ').toLowerCase()
            const isUnique = hasUnique
            const matchesName = matchesSearchQuery(searchable, search, term => {
                if (term === 'unique') return isUnique;
                if (term === 'not unique') return !isUnique;
                return undefined;
            });

            return matchesItemType && matchesHeroAttribute && matchesSet && matchesUnique && matchesSlot && matchesAttribute && matchesRarity && matchesName;
        });

        return result.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            return sortOrder === 0 ? comparison : -comparison;
        });
    }, [allItems, filters, search, itemType, heroAttributeRequirement, sortOrder, setsRef]);

    return (<>
        <div className='flex-row'>
            <ItemFilters savedItems={savedItems} setFiltersAdvanced={setFiltersAdvanced} advanced={filtersAdvanced} toggleFilter={toggleFilter} setSearch={setSearch} onSearchBlur={() => commitSearch(search)} clearFilters={clearFilters} filters={{ ...filters, name: search }} filterSprites={filterSprites} topOffset={filtersOffset} sortOrder={sortOrder} onToggleSort={() => setSortOrder(order => order === 0 ? 1 : 0)} />
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
        <BackToTopButton scrollRef={listRef} className="item-list-back-to-top" />
    </>
    )
}

export default memo(ItemList)