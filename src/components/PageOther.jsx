import { useMemo, useState } from "react"
import Button from "./Button.jsx"
import SubPageDrops from "./SubPageDrops.jsx"

const EMPTY_ITEM_DATA = {}

function PageOther({ itemsRef }) {
    const [activeTab, setActiveTab] = useState("drops")
    const itemData = itemsRef?.current?.BASE_ITEMS ?? EMPTY_ITEM_DATA
const sets = itemsRef?.current?.ITEM_SETS ?? []

    const overview = useMemo(() => {
        const items = Object.values(itemData).flatMap(value => Array.isArray(value) ? value : [])
        const bySlot = Object.entries(itemData)
            .filter(([, value]) => Array.isArray(value))
            .map(([slot, value]) => ({ slot, count: value.length }))
        const withLocation = items.filter(item => Array.isArray(item.dropLocation) ? item.dropLocation.length > 0 : Boolean(item.dropLocation))
        const withoutLocation = items.length - withLocation.length
        return { items, bySlot, withLocation: withLocation.length, withoutLocation }
    }, [itemData])

    return (
        <div
            id="page-other-layout"
            style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 0",
                minHeight: 0,
                minWidth: 0,
                width: "100%",
                gap: "10px"
            }}
        >
            <div className="sub-nav-bar flex-row" style={{ flex: "0 0 auto" }}>
                <div className="pagination flex-row card w-100">
                    <Button text="Drop Catalogue" color={5} active={activeTab === "drops"} onClick={() => setActiveTab("drops")} />
                    <Button text="Item Overview" color={5} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                </div>
            </div>

            <div
                id="page-other"
                className="page flex-row w-100"
                style={{
                    flex: "1 1 0",
                    minHeight: 0,
                    minWidth: 0,
                    overflowY: "auto",
                    alignContent: "start"
                }}
            >
                {activeTab === "drops" && (
                    <SubPageDrops itemsRef={itemData} setsRef={sets} />
                )}
                {activeTab === "overview" && (
                    <section className="card flex-col w-100" style={{ gap: "12px" }}>
                        <div className="header-big">Item Overview</div>
                        <div className="flex-row flex-wrap" style={{ gap: "10px" }}>
                            <div className="card flex-col" style={{ flex: "1 1 150px" }}>
                                <div className="header">Total items</div>
                                <div className="header-big">{overview.items.length}</div>
                            </div>
                            <div className="card flex-col" style={{ flex: "1 1 150px" }}>
                                <div className="header">Item sets</div>
                                <div className="header-big">{sets.length}</div>
                            </div>
                            <div className="card flex-col" style={{ flex: "1 1 150px" }}>
                                <div className="header">Items with a location</div>
                                <div className="header-big">{overview.withLocation}</div>
                            </div>
                            <div className="card flex-col" style={{ flex: "1 1 150px" }}>
                                <div className="header">Items without a location</div>
                                <div className="header-big">{overview.withoutLocation}</div>
                            </div>
                        </div>
                        <div className="header">Items by slot</div>
                        <div className="flex-row flex-wrap" style={{ gap: "8px" }}>
                            {overview.bySlot.map(({ slot, count }) => (
                                <div className="card flex-row" key={slot} style={{ flex: "1 1 180px", justifyContent: "space-between" }}>
                                    <span className="text">{slot}</span>
                                    <span className="header">{count}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text">This overview reflects the current item database. It does not infer missing drop locations.</div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default PageOther
