import { useState } from "react"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import SimulatorEntryList from "./SimulatorEntryList.jsx"

const TOWERS = [
    { id: 0, name: "Lighthouse", stages: [] },
    { id: 1, name: "Abandoned Tower", stages: [] },
    { id: 2, name: "Obelisk", stages: [] },
    { id: 3, name: "Serpents Steeple", stages: [] },
    { id: 4, name: "Peppermint Pillar", stages: [] },
    { id: 5, name: "Yggdrasil", stages: [] },
    { id: 6, name: "Decayed Cocoon", stages: [] },
    { id: 7, name: "Crystal Bore", stages: [] },
]

function SubPageTowers() {
    const { listHeight, listRef, events } = useDynamicList(0, true)
    const [selectedTower, setSelectedTower] = useState(null)

    return (
        <div className="simulator-selection-layout page flex-row w-100">
            <section className="card w-66 simulator-selection-list">
                <div className="header-big">Select Tower</div>
                <div ref={listRef} {...events} className="list tower-list flex-col" style={{ maxHeight: listHeight }}>
                    {TOWERS.map(tower => (
                        <button type="button" className="tower card flex-col" data-id={tower.id}
                            key={tower.id} onClick={() => setSelectedTower(tower)}>
                            <span className="header">{tower.name}</span>
                        </button>
                    ))}
                </div>
            </section>
            <section className="card w-100 simulator-selection-detail">
                {selectedTower ? (
                    <>
                        <div className="header-big">{selectedTower.name}</div>
                        <SimulatorEntryList entries={selectedTower.stages} entryLabel="Stage" />
                    </>
                ) : (
                    <div className="header-big">Select a Tower</div>
                )}
            </section>
        </div>
    )
}

export default SubPageTowers
