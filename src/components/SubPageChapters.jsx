import { useState } from "react"
import { useDynamicList } from "../hooks/useDynamicList";

const CHAPTERS = [
    { id: 0, name: "Maerwynn", stages: [] },
    { id: 1, name: "Black Forest", stages: [] },
    { id: 2, name: "Gnarogrim", stages: [] },
    { id: 3, name: "Stumble Steppe", stages: [] },
    { id: 4, name: "Split Canyon", stages: [] },
    { id: 5, name: "Sunburn Desert", stages: [] },
    { id: 6, name: "Skull Island", stages: [] },
    { id: 7, name: "Sprawling Jungle", stages: [] },
    { id: 8, name: "Mojo Mangroves", stages: [] },
    { id: 9, name: "Northrunt", stages: [] },
    { id: 10, name: "Shadowrock Mountain", stages: [] },
    { id: 11, name: "Plains of Oz'Korr", stages: [] },
    { id: 12, name: "Nevermoor", stages: [] },
    { id: 13, name: "Rotten Lands", stages: [] },
    { id: 14, name: "Busted Lands", stages: [] },
    { id: 15, name: "Tusk Mountain", stages: [] },
    { id: 16, name: "Magmaron", stages: [] },
]

const SHADOW_CHAPTERS = [
    { id: 0, name: "Maerwynn", stages: [] },
    { id: 1, name: "Black Forest", stages: [] },
    { id: 2, name: "Gnarogrim", stages: [] },
    { id: 3, name: "Stumble Steppe", stages: [] },
    { id: 4, name: "Split Canyon", stages: [] },
    { id: 5, name: "Sunburn Desert", stages: [] },
    { id: 6, name: "Skull Island", stages: [] },
    { id: 7, name: "Sprawling Jungle", stages: [] },
    { id: 8, name: "Mojo Mangroves", stages: [] },
    { id: 9, name: "Northrunt", stages: [] },
    { id: 10, name: "Shadowrock Mountain", stages: [] },
    { id: 11, name: "Plains of Oz'Korr", stages: [] },
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

function SubPageChapters() {
    const { listHeight, listRef } = useDynamicList(0, true);
    const [selectedChapter, setSelectedChapter] = useState(null);

    return (
        <>
            <div className='card w-66'>
                <div className='header-big'>Select Chapter</div>
                <div ref={listRef} className="list chapter-list flex-col" style={{ maxHeight: listHeight }}>
                    {CHAPTERS.map((chapter, chapterIndex) => <Chapter key={"chapter-" + chapterIndex} {...chapter} setSelectedChapter={setSelectedChapter} />)}
                </div>
            </div>
            <div className='card w-100'>{selectedChapter}</div>
        </>
    )
}

export default SubPageChapters