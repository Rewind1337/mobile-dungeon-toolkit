import { useState } from "react"
import Button from "./Button.jsx"
import SubPageDrops from "./SubPageDrops.jsx"
import SubPageHeroes from "./SubPageHeroes.jsx"

const EMPTY_ITEM_DATA = {}

function PageOther({ itemsRef, heroesRef }) {
    const [activeTab, setActiveTab] = useState("drops")
    const itemData = itemsRef?.current?.BASE_ITEMS ?? EMPTY_ITEM_DATA
    const sets = itemsRef?.current?.ITEM_SETS ?? []
    const heroes = heroesRef?.current ?? []

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
                    <Button text="Item Catalogue" color={5} active={activeTab === "drops"} onClick={() => setActiveTab("drops")} />
                    <Button text="Hero Catalogue" color={5} active={activeTab === "heroes"} onClick={() => setActiveTab("heroes")} />
                </div>
            </div>

            <div
                id="page-other"
                className="page card w-100"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    flex: "1 1 0",
                    minHeight: 0,
                    minWidth: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    alignContent: "start"
                }}
            >
                {activeTab === "drops" && (
                    <SubPageDrops itemsRef={itemData} setsRef={sets} />
                )}
                {activeTab === "heroes" && (
                    <SubPageHeroes heroesRef={heroes} />
                )}
            </div>
        </div>
    )
}

export default PageOther
