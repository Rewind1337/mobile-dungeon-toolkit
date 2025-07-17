import { useLayoutEffect, useRef, useState } from "react"
import { CONSTANTS } from "../database/constants";
import { useDynamicList } from "../hooks/useDynamicList";

const CHAPTERS = [
    { id: 0, name: "Maerwynn" },
    { id: 1, name: "Black Forest" },
    { id: 2, name: "Gnarogrim" },
    { id: 3, name: "Stumble Steppe" },
    { id: 4, name: "Split Canyon" },
    { id: 5, name: "Sunburn Desert" },
    { id: 6, name: "Skull Island" },
    { id: 7, name: "Sprawling Jungle" },
    { id: 8, name: "Mojo Mangroves" },
    { id: 9, name: "Northrunt" },
    { id: 0, name: "Shadowrock Mountain" },
    { id: 1, name: "Plains of Oz'Korr" },
    { id: 2, name: "Nevermoor" },
    { id: 3, name: "Rotten Lands" },
    { id: 4, name: "Busted Lands" },
]

function Chapter({ id, name, setSelectedChapter }) {
    return <div className="chapter card flex-row" data-id={id} onClick={() => { setSelectedChapter(id) }}>
        <div className="text">{id + 1}</div>
        <div className="header">{name}</div>
    </div>
}

function SubPageChapters({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const { listHeight, listRef, events } = useDynamicList(() => { }, 0, CONSTANTS.listHeightSubPage);
    const [selectedChapter, setSelectedChapter] = useState(null);

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Chapter</div>
                <div ref={listRef} className="list chapter-list flex-col" style={{ maxHeight: listHeight }}>
                    {CHAPTERS.map(chapter => <Chapter {...chapter} setSelectedChapter={setSelectedChapter} />)}
                </div>
            </div>
            <div className='card w-100'>{selectedChapter}</div>
        </>
    )
}

export default SubPageChapters