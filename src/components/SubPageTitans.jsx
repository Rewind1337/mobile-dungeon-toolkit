import { useLayoutEffect, useRef, useState } from "react"

import { elementSprites } from "../database/db_sprites.jsx"
import { CONSTANTS } from "../database/constants.jsx";
import { useDynamicList } from "../hooks/useDynamicList.jsx";

const TITANS = [
    { id: 0, name: "Scorchwing" },
    { id: 1, name: "Azuretide" },
    { id: 2, name: "Mossquake" },
    { id: 3, name: "Throne" },
    { id: 4, name: "Shadowmaw" },
]

function Titan({ id, name, elementSrc, setSelectedTitan }) {
    return <div className="titan card flex-col" data-id={id} onClick={() => { setSelectedTitan(id) }}>
        <div className="header">{name}</div>
        <div className="header elements"><img src={elementSrc} /></div>
    </div>
}

function SubPageTitans({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const { listHeight, listRef, events } = useDynamicList(() => { }, 0, CONSTANTS.listHeightSubPage);
    const [selectedTitan, setSelectedTitan] = useState(null);

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Titan</div>
                <div ref={listRef} className="list titan-list flex-col" style={{ maxHeight: listHeight }}>
                    {TITANS.map(titan => <Titan {...titan} elementSrc={elementSprites[titan.id]} setSelectedTitan={setSelectedTitan} />)}
                </div>
            </div>
            <div className='card w-100'>{selectedTitan}</div>
        </>
    )
}

export default SubPageTitans