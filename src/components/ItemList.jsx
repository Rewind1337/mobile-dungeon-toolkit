import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx'
import { useTranslate } from '../hooks/useTranslate.jsx'
import { useContentTranslation } from '../hooks/useContentTranslation.jsx'

import '../css/item.scss'

import Item from './Item.jsx'
import VirtualizedGrid from './VirtualizedGrid.jsx'
import CatalogueItemFilters from './CatalogueItemFilters.jsx'
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
function ItemList({extraHeight = 0, filtersOffset = 0, savedItems, headerText, itemsRef, setsRef = [], itemType = null, heroAttributeRequirement = null, localSearch = false, setSelectedItemId, onDoubleClick }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const { listHeight, listRef, events } = useDynamicList(extraHeight);
    const [urlSearch, setUrlSearch, commitUrlSearch] = useUrlSearch();
    const [modalSearch, setModalSearch] = useState("");
    const search = localSearch ? modalSearch : urlSearch;
    const setSearch = localSearch ? setModalSearch : setUrlSearch;
    const commitSearch = localSearch ? () => {} : commitUrlSearch;
    const [filters, setFilters] = useState({
        itemCategory: null,
        slot: null,
        attributeRequirement: null,
        rarity: null,
    });
    const [filtersVisible, setFiltersVisible] = useState(true)
    const [sortOrder, setSortOrder] = useState("alphabetic")

    const allItems = useMemo(() => {
        return [
            ...itemsRef.WEAPONS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.HELMETS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.ARMORS.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.NECKLACES.map((item) => ({ ...item, key: item.id })),
            ...itemsRef.RINGS.map((item) => ({ ...item, key: item.id })),
        ];
    }, [itemsRef]);

    const clearFilters = () => {
        setFilters({ itemCategory: null, slot: null, attributeRequirement: null, rarity: null });
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
            const hasUnique = itemObj.unique !== undefined && itemObj.unique !== null && itemObj.unique !== 0 && itemObj.unique !== 'NOTHING';
            const matchesCategory = filters.itemCategory === null || (
                filters.itemCategory === 'unique'
                    ? hasUnique
                    : itemObj.iconType === filters.itemCategory
            );
            const matchesSlot = filters.slot === null || itemObj.slot === filters.slot;
            const matchesAttribute = filters.attributeRequirement === null || itemObj.attributeRequirement === filters.attributeRequirement;
            const matchesRarity = filters.rarity === null || Number(filters.rarity) === Number(itemObj.rarity);
            const set = (setsRef ?? []).find(setEntry => setEntry.id === itemObj.set)
            const searchable = [...getSearchableValues(itemObj), itemObj.name, tc("item", itemObj.id, "name", itemObj.name),
                getEnumNameById(EQUIPMENT_SLOT_DEFINITIONS, Number(itemObj.slot)) ?? '', tc("equipmentSlot", String(getEnumNameById(EQUIPMENT_SLOT_DEFINITIONS, Number(itemObj.slot)) ?? "").toUpperCase(), "name", getEnumNameById(EQUIPMENT_SLOT_DEFINITIONS, Number(itemObj.slot)) ?? ''),
                getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(itemObj.attributeRequirement)) ?? '', tc("attribute", String(getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(itemObj.attributeRequirement)) ?? "").toUpperCase(), "name", getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(itemObj.attributeRequirement)) ?? ''),
                getEnumNameById(RARITY_DEFINITIONS, Number(itemObj.rarity)) ?? '', tc("rarity", String(getEnumNameById(RARITY_DEFINITIONS, Number(itemObj.rarity)) ?? "").toUpperCase(), "name", getEnumNameById(RARITY_DEFINITIONS, Number(itemObj.rarity)) ?? ''),
                getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(itemObj.dropSource)) ?? '', tc("dropSource", String(getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(itemObj.dropSource)) ?? "").toUpperCase(), "name", getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(itemObj.dropSource)) ?? ''),
                itemObj.dropLocation ?? '', set?.name ?? '', set ? tc("set", set.id, "name", set.name) : '',
                ...Object.entries(PERK_DEFINITIONS).flatMap(([key, perk]) => ([...(itemObj.fixedPerks ?? []), ...(itemObj.perks ?? [])].some(value => value && typeof value === 'object' ? value.id === perk.id : String(value).toUpperCase().replace(/\s/g, '_') === key || String(value) === String(perk.id)) ? [key, perk.name, tc("perk", key, "name", perk.name)] : []))
            ].join(' ').toLowerCase()
            const isUnique = hasUnique
            const matchesName = matchesSearchQuery(searchable, search, term => {
                if (term === 'unique') return isUnique;
                if (term === 'not unique') return !isUnique;
                return undefined;
            });

            return matchesItemType && matchesHeroAttribute && matchesCategory && matchesSlot && matchesAttribute && matchesRarity && matchesName;
        });

        return result.sort((a, b) => {
            const byName = tc("item", a.id, "name", a.name).localeCompare(tc("item", b.id, "name", b.name), undefined, { sensitivity: "base" })
            if (sortOrder === "rarity") return Number(b.rarity ?? 0) - Number(a.rarity ?? 0) || byName
            if (sortOrder === "level") return Number(b.level ?? 0) - Number(a.level ?? 0) || byName
            return byName
        });
    }, [allItems, filters, search, itemType, heroAttributeRequirement, sortOrder, setsRef, tc]);

    return (<>
        <CatalogueItemFilters
            search={search}
            setSearch={setSearch}
            headerText={headerText}
            onSearchBlur={() => commitSearch(search)}
            slotFilter={filters.slot === null ? "all" : String(filters.slot)}
            setSlotFilter={value => setFilters(previous => ({ ...previous, slot: value === "all" ? null : Number(value) }))}
            showSlotFilter={itemType === null}
            attributeFilter={filters.attributeRequirement === null ? "all" : String(filters.attributeRequirement)}
            setAttributeFilter={value => setFilters(previous => ({ ...previous, attributeRequirement: value === "all" ? null : Number(value) }))}
            attributeLabel="Attribute requirement"
            itemCategoryFilter={filters.itemCategory ?? "all"}
            setItemCategoryFilter={value => setFilters(previous => ({ ...previous, itemCategory: value === "all" ? null : value }))}
            rarityFilter={savedItems ? (filters.rarity === null ? "all" : String(filters.rarity)) : undefined}
            setRarityFilter={savedItems ? value => setFilters(previous => ({ ...previous, rarity: value === "all" ? null : Number(value) })) : undefined}
            isListView
            resultCount={filteredItems.length}
            totalCount={allItems.length}
            clearFilters={clearFilters}
            filtersVisible={filtersVisible}
            onHideFilters={() => setFiltersVisible(false)}
            onShowFilters={() => setFiltersVisible(true)}
            topOffset={filtersOffset}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
        />

        <div className='list item-list flex-row virtualized-list-scroll' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredItems.length === 0 ? (
                <div className="text-big margin-auto">{t("app.shared.noItemsMatchFilters")}</div>
            ) : (
                <VirtualizedGrid
                    items={filteredItems}
                    scrollElementRef={listRef}
                    minColumnWidth={110}
                    mobileMinColumnWidth={68}
                    estimatedRowHeight={170}
                    rowGap={8}
                    columnGap={8}
                    className="item-list-virtual"
                    rowClassName="item-list-virtual-row"
                    renderItem={itemObj => (
                        <Item
                            itemObj={itemObj}
                            level={savedItems ? (itemObj.level ?? 1) : null}
                            onClick={() => setSelectedItemId({ slot: itemObj.slot, id: itemObj.id })}
                            onDoubleClick={onDoubleClick ? () => onDoubleClick(itemObj) : undefined}
                        />
                    )}
                />
            )}
        </div>
        <BackToTopButton scrollRef={listRef} className="item-list-back-to-top" />
    </>
    )
}

export default memo(ItemList)