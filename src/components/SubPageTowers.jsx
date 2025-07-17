import { useState } from "react"

import Hero from "./Hero.jsx"
import { CONSTANTS } from "../database/constants.jsx";
import { useDynamicList } from "../hooks/useDynamicList.jsx";

const TOWERS = [
    { id: 0, name: "Lighthouse", stages: Array(30) },
    { id: 1, name: "Abandoned Tower", stages: Array(30) },
    { id: 2, name: "Obelisk", stages: Array(30) },
    { id: 3, name: "Serpents Steeple", stages: Array(30) },
    { id: 4, name: "Peppermint Pillar", stages: Array(30) },
    { id: 5, name: "Yggdrasil", stages: Array(30) },
    { id: 6, name: "Decayed Cocoon", stages: Array(30) },
]

function Tower({ id, name, setSelectedTower }) {
    return <div className="tower card flex-col" data-id={id} onClick={() => { setSelectedTower(id) }}>
        <div className="header">{name}</div>
    </div>
}

function TowerStage({ id, towerId, setSelectedStage, heroesRef }) {
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
    return <div className="tower-stage card flex-col" data-id={id} onClick={() => { setSelectedStage(id) }}>
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

function SubPageTowers({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef }) {
    const { listHeight, listRef, events } = useDynamicList(() => { }, 0, CONSTANTS.listHeightSubPage);
    const [selectedTower, setSelectedTower] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);

    return (
        <>
            <div className='card w-25'>
                <div className='header-big'>Select Tower</div>
                <div ref={listRef} className="list tower-list flex-col"  {...events} style={{ maxHeight: listHeight }}>
                    {TOWERS.map(tower => <Tower {...tower} setSelectedTower={setSelectedTower} />)}
                </div>
            </div>
            <div className='card w-100'>
                <div className='header-big'>Select Stage</div>
                <div className="list tower-stage-list flex-col"  {...events} style={{ maxHeight: listHeight }}>
                    {selectedTower} - {selectedStage}
                    <TowerStage id={0} towerId={0} setSelectedStage={setSelectedStage} heroesRef={heroesRef} />
                    <TowerStage id={1} towerId={0} setSelectedStage={setSelectedStage} heroesRef={heroesRef} />
                    <TowerStage id={2} towerId={0} setSelectedStage={setSelectedStage} heroesRef={heroesRef} />
                    <TowerStage id={3} towerId={0} setSelectedStage={setSelectedStage} heroesRef={heroesRef} />
                </div>
            </div>
        </>
    )
}

export default SubPageTowers