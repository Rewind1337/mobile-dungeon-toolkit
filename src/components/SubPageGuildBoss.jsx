import { useState } from "react"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { SimulatorEntryDetails, SimulatorElementChips } from "./SimulatorEntryList.jsx"

const GUILD_BOSSES = [
    { id: 0, name: "Elemental Weaver", elementIds: [0, 1, 2] },
    { id: 1, name: "Equinox", elementIds: [4, 3] },
    { id: 2, name: "Star Breaker", elementIds: [5] },
]

function SubPageGuildBoss() {
    const { listHeight, listRef, events } = useDynamicList(0, true)
    const [selectedGuildBoss, setSelectedGuildBoss] = useState(null)

    return (
        <div className="simulator-selection-layout page flex-row w-100">
            <section className="card w-25 simulator-selection-list">
                <div className="header-big">Select Guild Boss</div>
                <div ref={listRef} {...events} className="list guildboss-list flex-col" style={{ maxHeight: listHeight }}>
                    {GUILD_BOSSES.map(boss => (
                        <button type="button" className="guildboss card flex-col" data-id={boss.id}
                            key={boss.id} onClick={() => setSelectedGuildBoss(boss)}>
                            <div className="simulator-selection-chips">
                                <span className="catalogue-chip text simulator-selection-name-chip">{boss.name}</span>
                                <SimulatorElementChips elementIds={boss.elementIds} size="large" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>
            <section className="card boss-preview w-100 simulator-selection-detail">
                {selectedGuildBoss ? (
                    <>
                        <SimulatorEntryDetails entry={selectedGuildBoss} title={"Guild Boss - " + selectedGuildBoss.name} elementIds={selectedGuildBoss.elementIds} emptyMessage="No guild boss stage entries have been defined yet." />
                    </>
                ) : (
                    <div className="header-big">Select a Guild Boss</div>
                )}
            </section>
        </div>
    )
}

export default SubPageGuildBoss
