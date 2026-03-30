import { memo, useMemo, useRef, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx';

import '../css/hero.scss'

import Hero from './Hero.jsx'
import { attributeSprites, elementSprites, raritySprites, roleSprites, filterSprites } from '../database/db_sprites.jsx'
import Button from './Button.jsx'
import { ATTRIBUTE, ROLE } from '../database/enums.jsx'
import { useDraggable } from 'react-use-draggable-scroll';
import HeroFilters from './HeroFilters.jsx';

function HeroList({ setForceUpdate = () => { }, extraHeight = 0, savedHeroes = false, headerText, heroesRef, selectedHeroId, setSelectedHeroId }) {
    const { listHeight, listRef, events } = useDynamicList(setForceUpdate, extraHeight);
    const [filters, setFilters] = useState({
        element: null,
        role: null,
        mainAttribute: null,
        rarity: null,
        isStarred: null
    });
    const [filtersAdvanced, setFiltersAdvanced] = useState(false)

    const toggleFilter = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type] === value ? null : value,
        }));
    };

    const clearFilters = () => {
        setFilters({ element: null, role: null, mainAttribute: null, rarity: null, isStarred: null });
    };

    const filteredHeroes = useMemo(() => {
        return heroesRef.filter((heroObj) => {
            return (
                (filters.element === null || heroObj.element === filters.element) &&
                (filters.role === null || heroObj.role === filters.role) &&
                (filters.mainAttribute === null || heroObj.mainAttribute === filters.mainAttribute) &&
                (filters.rarity === null || heroObj.rarity === filters.rarity) &&
                (filters.isStarred === null || heroObj.isStarred === filters.isStarred)
            );
        });
    }, [heroesRef, filters]);

    return (<>
        <div className='header-big'>
            <div>
                <Button className='filters-button' round onClick={() => { setFiltersAdvanced(!filtersAdvanced) }} text={"Filters"} />
                <HeroFilters advanced={filtersAdvanced} toggleFilter={toggleFilter} clearFilters={clearFilters} filters={filters} filterSprites={filterSprites} />
            </div>{headerText}</div>
        <div className='list hero-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredHeroes.length === 0 ? (
                <div className="text">No heroes match the selected filters</div>
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