import { useLayoutEffect, useRef, useState } from "react"

import { elementSprites, guildBossSprites } from "../database/db_sprites.jsx"
import Skill from "./Skill.jsx"

function SubPageGuildBoss({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const listRef = useRef(null)
    const [listHeight, setListHeight] = useState(500)

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

    function GuildBoss(id, name, elementSrcArray) {
        return <div className="guildboss card flex-col" data-id={id} >
            <div className="header">{name}</div>
            <div className="header elements">{elementSrcArray.map(src => <img src={src} />)}</div>
        </div>
    }

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Guildboss</div>
                <div ref={listRef} className="list guildboss-list flex-col" style={{ maxHeight: listHeight }}>
                    {GuildBoss(0, "Elementor", [elementSprites[0], elementSprites[1], elementSprites[2]])}
                    {GuildBoss(1, "Equinox", [elementSprites[3], elementSprites[4]])}
                    {GuildBoss(2, "Star Breaker", [elementSprites[5]])}
                </div>
            </div>
            <div className='card boss-preview w-100'>
                <div className="flex-row" style={{ maxHeight: listHeight }}>
                    <div className="flex-col">
                        <div className="header-big">Star Herald (Summon)</div>
                        <div className="card"><img className="boss-mob-sprite" src={guildBossSprites["star_herald"]} draggable={false} /></div>
                        <div className="flex-row">
                            <Skill /><Skill /><Skill />
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="header-big">Star Breaker</div>
                        <div className="card"><img className="boss-sprite" src={guildBossSprites["star_breaker"]} draggable={false} /></div>
                        <div className="flex-row">
                            <Skill /><Skill /><Skill />
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="header-big">Info Dump</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubPageGuildBoss