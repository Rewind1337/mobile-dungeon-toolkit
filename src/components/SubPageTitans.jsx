import { useState } from "react"
import { elementSprites } from "../database/db_sprites.jsx"
import { ELEMENT_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { SimulatorEntryDetails } from "./SimulatorEntryList.jsx"

const TITANS = [
    { id: 0, element: 0, name: "Scorchwing" },
    { id: 1, element: 1, name: "Azuretide" },
    { id: 2, element: 2, name: "Mossquake" },
    { id: 3, element: 3, name: "Throne" },
    { id: 4, element: 4, name: "Shadowmaw" },
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
                            <span className="header elements"><img src={elementSprites[titan.element]} alt="" /></span>
                        </button>
                    ))}
                </div>
            </section>
            <section className="card w-100 simulator-selection-detail">
                {selectedTitan ? (
                    <>
                        <SimulatorEntryDetails entry={selectedTitan} title={getEnumNameById(ELEMENT_DEFINITIONS, selectedTitan.element) + " Titan - " + selectedTitan.name} elementIds={[selectedTitan.element]} emptyMessage="No titan stage entries have been defined yet." />
                    </>
                ) : (
                    <div className="header-big">Select a Titan</div>
                )}
            </section>
        </div>
    )
}

export default SubPageTitans
