import { useLayoutEffect, useRef, useState } from "react"

import { elementSprites, guildBossSprites } from "../database/db_sprites.jsx"
import TextCard from "./TextCard.jsx"
import { CONSTANTS } from "../database/constants.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx";

const GUILD_BOSSES = [
    { id: 0, name: "Elementor", elementSrcArray: [elementSprites[0], elementSprites[1], elementSprites[2]] },
    { id: 1, name: "Equinox", elementSrcArray: [elementSprites[3], elementSprites[4]] },
    { id: 2, name: "Star Breaker", elementSrcArray: [elementSprites[5]] },
]

function GuildBoss({ id, name, elementSrcArray, setSelectedGuildBoss }) {
    return <div className="guildboss card flex-col" data-id={id} onClick={() => { setSelectedGuildBoss(id) }} >
        <div className="header">{name}</div>
        <div className="header elements">{elementSrcArray.map(src => <img src={src} />)}</div>
    </div>
}

function SubPageGuildBoss({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const { listHeight, listRef, events } = useDynamicList(() => { }, 0, CONSTANTS.listHeightSubPage);
    const [selectedGuildBoss, setSelectedGuildBoss] = useState(null);

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Guildboss</div>
                <div ref={listRef} className="list guildboss-list flex-col" style={{ maxHeight: listHeight }}>
                    {GUILD_BOSSES.map(boss => <GuildBoss {...boss} setSelectedGuildBoss={setSelectedGuildBoss} />)}
                </div>
            </div>
            <div className='card boss-preview w-100'>
                {selectedGuildBoss}
                <div className="flex-row" style={{ maxHeight: listHeight }}>
                </div>
            </div>
        </>
    )
}

export default SubPageGuildBoss