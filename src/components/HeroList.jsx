import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx';

import '../css/hero.scss'

import Hero from './Hero.jsx'
import { filterSprites } from '../database/db_sprites.jsx'
import HeroFilters from './HeroFilters.jsx';

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
        return heroesRef.filter((heroObj) => {
            return (
                (filters.element === null || heroObj.element === filters.element) &&
                (filters.role === null || heroObj.role === filters.role) &&
                (filters.mainAttribute === null || heroObj.mainAttribute === filters.mainAttribute) &&
                (filters.rarity === null || heroObj.rarity === filters.rarity) &&
                (filters.isStarred === null || heroObj.isStarred === filters.isStarred) &&
                heroObj.name.toLowerCase().includes(filters.name.trim().toLowerCase())
            );
        });
    }, [heroesRef, filters]);

    return (<>
        <div className='flex-row'>
            <HeroFilters setFiltersAdvanced={setFiltersAdvanced} advanced={filtersAdvanced} toggleFilter={toggleFilter} setSearch={(name) => setFilters((prev) => ({ ...prev, name }))} clearFilters={clearFilters} filters={filters} filterSprites={filterSprites} />
        </div>
        <div className='header-big'>{headerText}</div>
        <div className='list hero-list flex-row' ref={listRef} {...events} style={(filtersAdvanced ? { maxHeight: (listHeight - 189)} : { maxHeight: listHeight })}>
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
    </>
    )
}

export default memo(HeroList)