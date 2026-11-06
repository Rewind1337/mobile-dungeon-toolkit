import { useState } from "react"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { ELEMENT_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { SimulatorEntryDetails, SimulatorElementChips } from "./SimulatorEntryList.jsx"

const TITANS = [
    { id: 0, element: 0, name: "Scorchwing" },
    { id: 1, element: 1, name: "Azuretide" },
    { id: 2, element: 2, name: "Mossquake" },
    { id: 3, element: 3, name: "Throne" },
    { id: 4, element: 4, name: "Shadowmaw" },
]

function SubPageTitans() {
    const t = useTranslate()
    const { listHeight, listRef, events } = useDynamicList(0, true)
    const [selectedTitan, setSelectedTitan] = useState(null)

    return (
        <div className="simulator-selection-layout page flex-row w-100">
            <section className="card w-25 simulator-selection-list">
                <div className="header-big">{t("app.pages.simulatorEntries.selectTitan")}</div>
                <div ref={listRef} {...events} className="list titan-list flex-col" style={{ maxHeight: listHeight }}>
                    {TITANS.map(titan => (
                        <button type="button" className="titan card flex-col" data-id={titan.id}
                            key={titan.id} onClick={() => setSelectedTitan(titan)}>
                            <div className="simulator-selection-chips">
                                <span className="catalogue-chip text simulator-selection-name-chip">{titan.name}</span>
                                <SimulatorElementChips elementIds={[titan.element]} size="large" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>
            <section className="card w-100 simulator-selection-detail">
                {selectedTitan ? (
                    <>
                        <SimulatorEntryDetails entry={selectedTitan} title={String(getEnumNameById(ELEMENT_DEFINITIONS, selectedTitan.element) ?? "Unknown").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()) + " Titan - " + selectedTitan.name} elementIds={[selectedTitan.element]} emptyMessage="No titan stage entries have been defined yet." />
                    </>
                ) : (
                    <div className="header-big">{t("app.pages.simulatorEntries.selectATitan")}</div>
                )}
            </section>
        </div>
    )
}

export default SubPageTitans
