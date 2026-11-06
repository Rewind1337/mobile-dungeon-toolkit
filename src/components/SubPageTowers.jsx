import { useState } from "react"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { SimulatorEntryDetails } from "./SimulatorEntryList.jsx"

const TOWERS = [
    { id: 0, name: "Lighthouse" },
    { id: 1, name: "Abandoned Tower" },
    { id: 2, name: "Obelisk" },
    { id: 3, name: "Serpents Steeple" },
    { id: 4, name: "Peppermint Pillar" },
    { id: 5, name: "Yggdrasil" },
    { id: 6, name: "Decayed Cocoon" },
    { id: 7, name: "Crystal Bore" },
]

function SubPageTowers() {
    const t = useTranslate()
    const { listHeight, listRef, events } = useDynamicList(0, true)
    const [selectedTower, setSelectedTower] = useState(null)

    return (
        <div className="simulator-selection-layout page flex-row w-100">
            <section className="card w-66 simulator-selection-list">
                <div className="header-big">{t("app.pages.simulatorEntries.selectTower")}</div>
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
                        <SimulatorEntryDetails entry={selectedTower} title={t("app.pages.simulatorEntries.towerTitle", { number: selectedTower.id + 1, name: selectedTower.name })} emptyMessage={t("app.pages.simulatorEntries.noTowerStages")} />
                    </>
                ) : (
                    <div className="header-big">{t("app.pages.simulatorEntries.selectATower")}</div>
                )}
            </section>
        </div>
    )
}

export default SubPageTowers
