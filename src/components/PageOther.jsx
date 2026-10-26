import { useState } from "react"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import Button from "./Button.jsx"
import SubPageItemCatalogue from "./SubPageItemCatalogue.jsx"
import SubPageHeroCatalogue from "./SubPageHeroCatalogue.jsx"
import SubPageStatusCatalogue from "./SubPageStatusCatalogue.jsx"

import "../css/other.scss"
import "../css/hero.scss"

const EMPTY_ITEM_DATA = {}

function PageOther({ itemsRef, heroesRef }) {
    const [activeTab, setActiveTab] = useState("drops")
    const { listRef, events } = useDynamicList(0)
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
                    <Button text="Status Catalogue" color={5} active={activeTab === "statuses"} onClick={() => setActiveTab("statuses")} />
                </div>
            </div>

            <div
                id="page-other"
                className="page card w-100"
                ref={listRef}
                {...events}
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
                    <SubPageItemCatalogue itemsRef={itemData} setsRef={sets} />
                )}
                {activeTab === "heroes" && (
                    <SubPageHeroCatalogue heroesRef={heroes} />
                )}
                {activeTab === "statuses" && <SubPageStatusCatalogue />}
            </div>
        </div>
    )
}

export default PageOther
