import { useLayoutEffect, useRef, useState } from "react"

import { elementSprites } from "../database/db_sprites.jsx"

function SubPageTitans({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
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

    function Titan(id, name, elementSrc) {
        return <div className="titan card flex-col" data-id={id} >
            <div className="header">{name}</div>
            <div className="header elements"><img src={elementSrc} /></div>
        </div>
    }

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Titan</div>
                <div ref={listRef} className="list titan-list flex-col" style={{ maxHeight: listHeight }}>
                    {Titan(3, "Throne", elementSprites[3])}
                    {Titan(4, "Shadowmaw", elementSprites[4])}
                    {Titan(0, "Scorchwing", elementSprites[0])}
                    {Titan(2, "Mossquake", elementSprites[2])}
                    {Titan(1, "Azuretide", elementSprites[1])}
                </div>
            </div>
            <div className='card w-100'>test</div>
        </>
    )
}

export default SubPageTitans