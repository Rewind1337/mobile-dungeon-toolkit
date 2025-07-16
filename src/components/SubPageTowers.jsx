import { useLayoutEffect, useRef, useState } from "react"

import Hero from "./Hero.jsx"
import { CONSTANTS } from "../database/constants.jsx";

function SubPageTowers({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const listRef = useRef(null)
    const [listHeight, setListHeight] = useState(500)

    function onResize() {
        let newHeight = 0;
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

    function Tower(id, name) {
        return <div className="tower card flex-col" data-id={id} >
            <div className="header">{name}</div>
        </div>
    }

    function TowerStage(id, towerId) {
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        for (let i = 0; i < 15; i++) {
            let r = Math.floor(Math.random() * heroesRef.current.length);
            let heroObj = heroesRef.current[r];
            let _hero = <Hero heroObj={heroObj} level={1} />
            if (i < 5)
                arr1.push(_hero)
            else if (i >= 5 && i < 10)
                arr2.push(_hero)
            else
                arr3.push(_hero)
        }
        return <div className="tower-stage card flex-col" data-id={id} >
            <div className="header">Lighthouse {towerId + 1} - {id + 1}</div>
            <div className="flex-row header-row">
                <div className="header wave">Wave 1</div>
                <div className="header wave">Wave 2</div>
                <div className="header wave">Wave 3</div>
            </div>
            <div className="flex-row hero-row">
                <div className="flex-row card">
                    {arr1}
                </div>
                <div className="flex-row card">
                    {arr2}
                </div>
                <div className="flex-row card">
                    {arr3}
                </div>
            </div>
        </div>
    }

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Tower</div>
                <div ref={listRef} className="list tower-list flex-col" style={{ maxHeight: listHeight }}>
                    {Tower(0, "Lighthouse")}
                    {Tower(1, "Abandoned Tower")}
                    {Tower(2, "Obelisk")}
                    {Tower(3, "Serpents Steeple")}
                    {Tower(4, "Peppermint Pillar")}
                    {Tower(5, "Yggdrasil")}
                    {Tower(6, "Decayed Cocoon")}
                </div>
            </div>
            <div className='card w-100'>
                <div className='header-big'>Select Stage</div>
                <div className="list tower-stage-list flex-col" style={{ maxHeight: listHeight }}>
                    {TowerStage(0, 0)}
                    {TowerStage(1, 0)}
                </div>
            </div>
        </>
    )
}

export default SubPageTowers