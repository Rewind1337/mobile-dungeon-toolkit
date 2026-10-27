import { useDynamicList } from "../hooks/useDynamicList.jsx"
import Button from "./Button.jsx"
import SubPageItemCatalogue from "./SubPageItemCatalogue.jsx"
import SubPageHeroCatalogue from "./SubPageHeroCatalogue.jsx"
import SubPageStatusCatalogue from "./SubPageStatusCatalogue.jsx"

import "../css/other.scss"
import "../css/hero.scss"

const EMPTY_ITEM_DATA = {}

function PageOther({ itemsRef, heroesRef, activeTab = "item-catalogue", onTabChange }) {
    const setActiveTab = (tab) => {
        onTabChange?.(tab)
    }
    const { listRef, events } = useDynamicList(0)
    const itemData = itemsRef?.current?.BASE_ITEMS ?? EMPTY_ITEM_DATA
    const sets = itemsRef?.current?.ITEM_SETS ?? []
    const heroes = heroesRef?.current ?? []

    return (
        <div id="page-other-layout">
            <div className="sub-nav-bar flex-row" style={{ flex: "0 0 auto" }}>
                <div className="pagination flex-row card w-100">
                    <Button text="Item Catalogue" color={5} active={activeTab === "item-catalogue"} onClick={() => setActiveTab("item-catalogue")} />
                    <Button text="Hero Catalogue" color={5} active={activeTab === "hero-catalogue"} onClick={() => setActiveTab("hero-catalogue")} />
                    <Button text="Status Catalogue" color={5} active={activeTab === "status-catalogue"} onClick={() => setActiveTab("status-catalogue")} />
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
                {activeTab === "item-catalogue" && (
                    <SubPageItemCatalogue itemsRef={itemData} setsRef={sets} />
                )}
                {activeTab === "hero-catalogue" && (
                    <SubPageHeroCatalogue heroesRef={heroes} />
                )}
                {activeTab === "status-catalogue" && <SubPageStatusCatalogue />}
            </div>
        </div>
    )
}

export default PageOther
