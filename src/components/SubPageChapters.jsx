import { useLayoutEffect, useRef, useState } from "react"
import { CONSTANTS } from "../database/constants";

function SubPageChapters({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const listRef = useRef(null)
    const [listHeight, setListHeight] = useState(500)

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
        if (window.matchMedia("(max-width: 900px)").matches === true) {
            newHeight = window.innerHeight - (CONSTANTS.listHeightSubPage + listRef.current.offsetTop)
        } else {
            newHeight = window.innerHeight - (CONSTANTS.listHeightDefault + listRef.current.offsetTop)
        }
        setListHeight(newHeight)
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    function Chapter(id, name) {
        return <div className="chapter card flex-row" data-id={id} >
            <div className="text">{id + 1}</div>
            <div className="header">{name}</div>
        </div>
    }

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Chapter</div>
                <div ref={listRef} className="list chapter-list flex-col" style={{ maxHeight: listHeight }}>
                    {Chapter(0, "Maerwynn")}
                    {Chapter(1, "Black Forest")}
                    {Chapter(2, "Gnarogrim")}
                    {Chapter(3, "Stumble Steppe")}
                    {Chapter(4, "Split Canyon")}
                    {Chapter(5, "Sunburn Desert")}
                    {Chapter(6, "Skull Island")}
                    {Chapter(7, "Sprawling Jungle")}
                    {Chapter(8, "Mojo Mangroves")}
                    {Chapter(9, "Northrunt")}
                    {Chapter(10, "Shadowrock Mountain")}
                    {Chapter(11, "Plains of Oz'Korr")}
                    {Chapter(12, "Nevermoor")}
                    {Chapter(13, "Rotten Lands")}
                    {Chapter(14, "Busted Lands")}
                </div>
            </div>
            <div className='card w-100'>Chapter Content</div>
        </>
    )
}

export default SubPageChapters