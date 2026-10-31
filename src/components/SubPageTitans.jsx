import { useState } from "react"
import { elementSprites } from "../database/db_sprites.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import SimulatorEntryList from "./SimulatorEntryList.jsx"

const TITANS = [
    { id: 0, name: "Scorchwing", stages: [] },
    { id: 1, name: "Azuretide", stages: [] },
    { id: 2, name: "Mossquake", stages: [] },
    { id: 3, name: "Throne", stages: [] },
    { id: 4, name: "Shadowmaw", stages: [] },
]

function SubPageTitans() {
    const { listHeight, listRef, events } = useDynamicList(0, true)
    const [selectedTitan, setSelectedTitan] = useState(null)

    return (
        <div className="simulator-selection-layout page flex-row w-100">
            <section className="card w-25 simulator-selection-list">
                <div className="header-big">Select Titan</div>
                <div ref={listRef} {...events} className="list titan-list flex-col" style={{ maxHeight: listHeight }}>
                    {TITANS.map(titan => (
                        <button type="button" className="titan card flex-col" data-id={titan.id}
                            key={titan.id} onClick={() => setSelectedTitan(titan)}>
                            <span className="header">{titan.name}</span>
                            <span className="header elements"><img src={elementSprites[titan.id]} alt="" /></span>
                        </button>
                    ))}
                </div>
            </section>
            <section className="card w-100 simulator-selection-detail">
                {selectedTitan ? (
                    <>
                        <div className="header-big">{selectedTitan.name}</div>
                        <SimulatorEntryList entries={selectedTitan.stages} entryLabel="Stage" />
                    </>
                ) : (
                    <div className="header-big">Select a Titan</div>
                )}
            </section>
        </div>
    )
}

export default SubPageTitans
