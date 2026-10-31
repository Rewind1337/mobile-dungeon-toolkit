import { useState } from "react"
import { elementSprites } from "../database/db_sprites.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { SimulatorEntryDetails } from "./SimulatorEntryList.jsx"

const GUILD_BOSSES = [
    { id: 0, name: "Elemental Weaver", elementSrcArray: [elementSprites[0], elementSprites[1], elementSprites[2]] },
    { id: 1, name: "Equinox", elementSrcArray: [elementSprites[3], elementSprites[4]] },
    { id: 2, name: "Star Breaker", elementSrcArray: [elementSprites[5]] },
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
                            <span className="header">{boss.name}</span>
                            <span className="header elements">
                                {boss.elementSrcArray.map((src, index) => <img key={index} src={src} alt="" />)}
                            </span>
                        </button>
                    ))}
                </div>
            </section>
            <section className="card boss-preview w-100 simulator-selection-detail">
                {selectedGuildBoss ? (
                    <>
                        <SimulatorEntryDetails entry={selectedGuildBoss} entryLabel="Guild Boss" />
                    </>
                ) : (
                    <div className="header-big">Select a Guild Boss</div>
                )}
            </section>
        </div>
    )
}

export default SubPageGuildBoss
