import { memo, useMemo, useState } from 'react'
import { useDynamicList } from '../hooks/useDynamicList.jsx';

import '../css/hero.scss'

import Hero from './Hero.jsx'
import { attributeSprites, elementSprites, raritySprites, roleSprites } from '../database/db_sprites.jsx'
import Button from './Button.jsx'
import { ATTRIBUTE, ROLE } from '../database/enums.jsx'

function HeroList({ setForceUpdate = () => { }, extraHeight = 0, savedHeroes = false, headerText, heroesRef, selectedHeroId, setSelectedHeroId }) {
    const { listHeight, listRef, events } = useDynamicList(setForceUpdate, extraHeight);
    const [filters, setFilters] = useState({
        element: null,
        role: null,
        mainAttribute: null,
        rarity: null,
    });

    const toggleFilter = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type] === value ? null : value,
        }));
    };

    const clearFilters = () => {
        setFilters({ element: null, role: null, mainAttribute: null, rarity: null });
    };

    const filteredHeroes = useMemo(() => {
        return heroesRef.filter((heroObj) => {
            return (
                (filters.element === null || heroObj.element === filters.element) &&
                (filters.role === null || heroObj.role === filters.role) &&
                (filters.mainAttribute === null || heroObj.mainAttribute === filters.mainAttribute) &&
                (filters.rarity === null || heroObj.rarity === filters.rarity)
            );
        });
    }, [heroesRef, filters]);

    return (<>
        <div className='header-big'>{headerText}</div>
        <div className='filters flex-row card'>
            <Button round onClick={clearFilters} text={attributeSprites[ATTRIBUTE.NONE]} active={Object.values(filters).every((v) => v === null)} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('element', 0)} imgAsText text={elementSprites[0]} active={filters.element === 0} />
            <Button round onClick={() => toggleFilter('element', 1)} imgAsText text={elementSprites[1]} active={filters.element === 1} />
            <Button round onClick={() => toggleFilter('element', 2)} imgAsText text={elementSprites[2]} active={filters.element === 2} />
            <Button round onClick={() => toggleFilter('element', 3)} imgAsText text={elementSprites[3]} active={filters.element === 3} />
            <Button round onClick={() => toggleFilter('element', 4)} imgAsText text={elementSprites[4]} active={filters.element === 4} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('role', 0)} text={roleSprites[ROLE.OFFENSIVE]} active={filters.role === 0} />
            <Button round onClick={() => toggleFilter('role', 1)} text={roleSprites[ROLE.DEFENSIVE]} active={filters.role === 1} />
            <Button round onClick={() => toggleFilter('role', 2)} text={roleSprites[ROLE.CONTROL]} active={filters.role === 2} />
            <Button round onClick={() => toggleFilter('role', 3)} text={roleSprites[ROLE.SUPPORT]} active={filters.role === 3} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('mainAttribute', 1)} text={attributeSprites[ATTRIBUTE.STRENGTH]} active={filters.mainAttribute === 1} />
            <Button round onClick={() => toggleFilter('mainAttribute', 2)} text={attributeSprites[ATTRIBUTE.DEXTERITY]} active={filters.mainAttribute === 2} />
            <Button round onClick={() => toggleFilter('mainAttribute', 3)} text={attributeSprites[ATTRIBUTE.INTELLIGENCE]} active={filters.mainAttribute === 3} />
            <div className='orb-spacer' />
            <Button round onClick={() => toggleFilter('rarity', 1)} text={raritySprites[1]} active={filters.rarity === 1} />
            <Button round onClick={() => toggleFilter('rarity', 2)} text={raritySprites[2]} active={filters.rarity === 2} />
            <Button round onClick={() => toggleFilter('rarity', 3)} text={raritySprites[3]} active={filters.rarity === 3} />
            <Button round onClick={() => toggleFilter('rarity', 4)} text={raritySprites[4]} active={filters.rarity === 4} />
        </div>
        <div className='list hero-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {filteredHeroes.map((heroObj) => (
                <Hero
                    selected={heroObj.id === selectedHeroId}
                    heroObj={heroObj}
                    key={heroObj.id + '-' + heroObj.saveId}
                    level={1}
                    onClick={() => setSelectedHeroId(savedHeroes ? heroObj.saveId : heroObj.id)}
                />
            ))}
        </div>
    </>
    )
}

export default memo(HeroList)