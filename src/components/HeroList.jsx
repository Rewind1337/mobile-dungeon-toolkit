import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx';

import '../css/hero.scss'

import Hero from './Hero.jsx'
import { filterSprites } from '../database/db_sprites.jsx'
import HeroFilters from './HeroFilters.jsx';
import BackToTopButton from './BackToTopButton.jsx';
import { ATTRIBUTE_DEFINITIONS, ELEMENT_DEFINITIONS, RARITY_DEFINITIONS, ROLE_DEFINITIONS, getEnumNameById } from '../database/enums.jsx';
import { isSearchAssetField, matchesSearchQuery, useUrlSearch } from '../js/search.jsx';

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [String(value)]
    if (typeof value !== 'object' || seen.has(value)) return []
    seen.add(value)
    return Object.entries(value).flatMap(([key, child]) => isSearchAssetField(key) ? [] : [key, ...getSearchableValues(child, seen)])
}
function HeroList({ extraHeight = 0, savedHeroes = false, headerText, heroesRef, selectedHeroId, setSelectedHeroId }) {
    const { listHeight, listRef, events } = useDynamicList(extraHeight);
    const [search, setSearch, commitSearch] = useUrlSearch();
    const [filters, setFilters] = useState({
        element: null,
        role: null,
        mainAttribute: null,
        rarity: [],
        isStarred: null
    });
    const [filtersAdvanced, setFiltersAdvanced] = useState(false)
    const [sortOrder, setSortOrder] = useState("alphabetic")

    const toggleFilter = (type, value) => {
        setFilters(previous => {
            if (type === "rarity") {
                if (Array.isArray(value)) {
                    return { element: null, role: null, mainAttribute: null, rarity: value, isStarred: null }
                }
                const current = Array.isArray(previous.rarity) ? previous.rarity : []
                const nextRarities = current.includes(value)
                    ? current.filter(rarity => rarity !== value)
                    : [...current, value]
                return { element: null, role: null, mainAttribute: null, rarity: nextRarities, isStarred: null }
            }
            return {
                element: null, role: null, mainAttribute: null, rarity: [], isStarred: null,
                [type]: previous[type] === value ? null : value
            }
        })
    };

    const clearFilters = () => {
        setFilters({ element: null, role: null, mainAttribute: null, rarity: [], isStarred: null });
        setSearch("");
        commitSearch("");
    };

    const filteredHeroes = useMemo(() => {
        const result = heroesRef.filter((heroObj) => (
            (filters.element === null || heroObj.element === filters.element) &&
            (filters.role === null || heroObj.role === filters.role) &&
            (filters.mainAttribute === null || heroObj.mainAttribute === filters.mainAttribute) &&
            (filters.rarity.length === 0 || filters.rarity.includes(heroObj.rarity)) &&
            (filters.isStarred === null || heroObj.isStarred === filters.isStarred) &&
            matchesSearchQuery([
                ...getSearchableValues(heroObj),
                getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(heroObj.mainAttribute)) ?? '',
                getEnumNameById(ELEMENT_DEFINITIONS, Number(heroObj.element)) ?? '',
                getEnumNameById(RARITY_DEFINITIONS, Number(heroObj.rarity)) ?? '',
                getEnumNameById(ROLE_DEFINITIONS, Number(heroObj.role)) ?? '',
            ], search, term => {
                if (term === 'starred') return heroObj.isStarred === true;
                if (term === 'not starred') return heroObj.isStarred === false;
                return undefined;
            })
        ));

        return result.sort((a, b) => {
            const byName = String(a.name).localeCompare(String(b.name), undefined, { sensitivity: "base" })
            if (sortOrder === "rarity") return Number(b.rarity ?? 0) - Number(a.rarity ?? 0) || byName
            if (sortOrder === "level") return Number(b.level ?? 0) - Number(a.level ?? 0) || byName
            return byName
        });
    }, [heroesRef, filters, search, sortOrder]);

    return (<>
        <div className='flex-row'>
            <HeroFilters setFiltersAdvanced={setFiltersAdvanced} advanced={filtersAdvanced} toggleFilter={toggleFilter} setSearch={setSearch} onSearchBlur={() => commitSearch(search)} clearFilters={clearFilters} filters={{ ...filters, name: search }} filterSprites={filterSprites} sortOrder={sortOrder} onSortChange={setSortOrder} />
        </div>
        <div className='header-big'>{headerText}</div>
        <div className='list hero-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredHeroes.length === 0 ? (
                <div className="text-big margin-auto">No heroes match the selected filters</div>
            ) : (
                filteredHeroes.map((heroObj) => (
                    <Hero
                        selected={(savedHeroes ? heroObj.saveId : heroObj.id) === selectedHeroId}
                        heroObj={heroObj}
                        key={heroObj.id + '-' + heroObj.saveId}
                        level={savedHeroes ? (heroObj.level ?? null) : null}
                        onClick={() => {
                            const clickedId = savedHeroes ? heroObj.saveId : heroObj.id
                            setSelectedHeroId(currentId => currentId === clickedId ? null : clickedId)
                        }}
                    />
                ))
            )}
        </div>
        <BackToTopButton scrollRef={listRef} className="hero-list-back-to-top" />
    </>
    )
}

export default memo(HeroList)