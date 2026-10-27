import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx';

import '../css/hero.scss'

import Hero from './Hero.jsx'
import { filterSprites } from '../database/db_sprites.jsx'
import HeroFilters from './HeroFilters.jsx';
import BackToTopButton from './BackToTopButton.jsx';

function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [String(value)]
    if (typeof value !== 'object' || seen.has(value)) return []
    seen.add(value)
    return Object.entries(value).flatMap(([key, child]) => [key, ...getSearchableValues(child, seen)])
}
function HeroList({ extraHeight = 0, savedHeroes = false, headerText, heroesRef, selectedHeroId, setSelectedHeroId }) {
    const { listHeight, listRef, events } = useDynamicList(extraHeight);
    const [filters, setFilters] = useState({
        element: null,
        role: null,
        mainAttribute: null,
        rarity: null,
        isStarred: null,
        name: ""
    });
    const [filtersAdvanced, setFiltersAdvanced] = useState(false)
    const [sortOrder, setSortOrder] = useState(0) // 0 alphabetical, 1 reverse alphabetical

    const toggleFilter = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type] === value ? null : value,
        }));
    };

    const clearFilters = () => {
        setFilters({ element: null, role: null, mainAttribute: null, rarity: null, isStarred: null, name: "" });
    };

    const filteredHeroes = useMemo(() => {
        const result = heroesRef.filter((heroObj) => (
            (filters.element === null || heroObj.element === filters.element) &&
            (filters.role === null || heroObj.role === filters.role) &&
            (filters.mainAttribute === null || heroObj.mainAttribute === filters.mainAttribute) &&
            (filters.rarity === null || heroObj.rarity === filters.rarity) &&
            (filters.isStarred === null || heroObj.isStarred === filters.isStarred) &&
            (!filters.name.trim() || [...getSearchableValues(heroObj), heroObj.isStarred ? 'starred' : 'not starred'].join(' ').toLowerCase().includes(filters.name.trim().toLowerCase()))
        ));

        return result.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            return sortOrder === 0 ? comparison : -comparison;
        });
    }, [heroesRef, filters, sortOrder]);

    return (<>
        <div className='flex-row'>
            <HeroFilters setFiltersAdvanced={setFiltersAdvanced} advanced={filtersAdvanced} toggleFilter={toggleFilter} setSearch={(name) => setFilters((prev) => ({ ...prev, name }))} clearFilters={clearFilters} filters={filters} filterSprites={filterSprites} sortOrder={sortOrder} onToggleSort={() => setSortOrder(order => order === 0 ? 1 : 0)} />
        </div>
        <div className='header-big'>{headerText}</div>
        <div className='list hero-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredHeroes.length === 0 ? (
                <div className="text-big margin-auto">No heroes match the selected filters</div>
            ) : (
                filteredHeroes.map((heroObj) => (
                    <Hero
                        selected={heroObj.id === selectedHeroId}
                        heroObj={heroObj}
                        key={heroObj.id + '-' + heroObj.saveId}
                        level={null}
                        onClick={() => setSelectedHeroId(savedHeroes ? heroObj.saveId : heroObj.id)}
                    />
                ))
            )}
        </div>
        <BackToTopButton scrollRef={listRef} />
    </>
    )
}

export default memo(HeroList)