import { useState } from "react"
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
    { id: 10, name: "Shadowrock Mountain" },
    { id: 11, name: "Plains of Oz'Korr" },
    { id: 12, name: "Nevermoor" },
    { id: 13, name: "Rotten Lands" },
    { id: 14, name: "Busted Lands" },
    { id: 15, name: "Tusk Mountain" },
    { id: 16, name: "Magmaron" },
]

function Chapter({ id, name, setSelectedChapter }) {
    return <div className="chapter-wrapper flex-row">
        <div className="chapter card flex-row" data-id={id} data-threshhold="0" onClick={() => { setSelectedChapter(id) }}>
            <div className="text">{id + 1}</div>
            <div className="header">{name}</div>
        </div>
        <div className="chapter-shadow card" data-id={id} data-threshhold="1">
            <div className="header">SW 1</div>
        </div>
        <div className="chapter-shadow card" data-id={id} data-threshhold="2">
            <div className="header">SW 2</div>
        </div>
        <div className="chapter-shadow card" data-id={id} data-threshhold="3">
            <div className="header">SW 3</div>
        </div>
    </div>
}

function SubPageChapters({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const { listHeight, listRef } = useDynamicList(0, true);
    const [selectedChapter, setSelectedChapter] = useState(null);

    return (
        <>
            <div className='card w-66'>
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