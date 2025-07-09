import { memo, useLayoutEffect, useRef, useState } from 'react'
import { useDraggable } from "react-use-draggable-scroll";

import '../css/hero.scss'

import Hero from './Hero.jsx'
import { attributeSprites, elementSprites, raritySprites, roleSprites } from '../database/db_sprites.jsx'
import Button from './Button.jsx'
import { ATTRIBUTE, ROLE } from '../database/enums.jsx'

function HeroList({ savedHeroes = false, headerText, heroesRef, setSelectedHeroId }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const { events } = useDraggable(listRef);


    function onResize() {
        let newHeight = 0;
        if (window.matchMedia("(max-width: 900px)").matches === true) {
            newHeight = window.innerHeight - (137 + listRef.current.offsetTop)
        } else {
            newHeight = window.innerHeight - (177 + listRef.current.offsetTop)
        }
        setListHeight(newHeight)
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (<>
        <div className='header-big'>{headerText}</div>
        <div className='filters flex-row card'>
            <Button round text={attributeSprites[ATTRIBUTE.NONE]} />
            <Button round imgAsText text={elementSprites[0]} />
            <Button round imgAsText text={elementSprites[1]} />
            <Button round imgAsText text={elementSprites[2]} />
            <Button round imgAsText text={elementSprites[3]} />
            <Button round imgAsText text={elementSprites[4]} />
            <Button round text={roleSprites[ROLE.OFFENSIVE]} />
            <Button round text={roleSprites[ROLE.DEFENSIVE]} />
            <Button round text={roleSprites[ROLE.CONTROL]} />
            <Button round text={roleSprites[ROLE.SUPPORT]} />
            <Button round text={attributeSprites[ATTRIBUTE.STRENGTH]} />
            <Button round text={attributeSprites[ATTRIBUTE.DEXTERITY]} />
            <Button round text={attributeSprites[ATTRIBUTE.INTELLIGENCE]} />
            <Button round text={raritySprites[1]} />
            <Button round text={raritySprites[2]} />
            <Button round text={raritySprites[3]} />
            <Button round text={raritySprites[4]} />
        </div>
        <div className='list hero-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {heroesRef.map(heroObj =>
                <Hero heroObj={heroObj} key={heroObj.id + "-" + heroObj.saveId} level={1} onClick={() => { setSelectedHeroId((savedHeroes ? heroObj.saveId : heroObj.id)) }} />
            )}
        </div>
    </>
    )
}

export default memo(HeroList)