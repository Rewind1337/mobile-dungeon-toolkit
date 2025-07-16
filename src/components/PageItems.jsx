import { useEffect, useRef, useState } from "react"
import ItemList from "./ItemList.jsx"
import Button from "./Button.jsx"
import ItemPreview from "./ItemPreview.jsx"
import ItemPerk from "./ItemPerk.jsx"
import { POSSIBLE_PERKS } from "../database/enums.jsx"

function PageItems({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction }) {
    const [pageContent, setPageContent] = useState(0)
    const [selectedItemId, setSelectedItemId] = useState({ slot: null, id: null })
    const [selectedSavedItemId, setSelectedSavedItemId] = useState({ slot: null, id: null })

    const [itemPerks, setItemPerks] = useState([]);
    const [selectedPerkSlot, setSelectedPerkSlot] = useState(null);
    const [perkSelectionVisible, setPerkSelectionVisible] = useState(false)
    const [possiblePerks, setPossiblePerks] = useState([])

    const [forceUpdate, setForceUpdate] = useState({}) // workaround for now

    const handlePerkClick = () => {
        let itemObj = itemsRef.current.BASE_ITEMS[slotIndexToNameMap[selectedItemId.slot]]?.[selectedItemId.id]
        setPossiblePerks(getPossiblePerks(itemObj))
        setPerkSelectionVisible(true)
    }

    const getPossiblePerks = (itemObj) => {
        const slotToNameMap = ["WEAPONS", "HELMETS", "ARMORS", "RINGS", "NECKLACES", "OTHER"]
        let slot = slotToNameMap[itemObj.slot]
        return POSSIBLE_PERKS[slot]
    }

    const handleSelectPerkClick = (perk) => {
        console.log(perk, itemPerks)
        let temp = itemPerks;
        temp[selectedPerkSlot] = perk
        setItemPerks(temp)
        setPerkSelectionVisible(false)
        setForceUpdate({})
    }

    useEffect(() => {
        console.log(itemPerks)
    }, [forceUpdate])

    const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS" }
    const saveItem = (itemObj) => {
        console.log("Saving " + itemObj.name + " to " + itemObj.slot)
        let slotArray = slotIndexToNameMap[itemObj.slot]
        itemObj.saveId = savedItemsRef.current[slotArray].length
        itemObj.perks = itemPerks;
        savedItemsRef.current[slotArray].push(itemObj)
    }

    return (
        <>
            <div className={"modal modal-backdrop" + (perkSelectionVisible ? " visible" : "")} onClick={(e) => { e.stopPropagation(); setPerkSelectionVisible(false) }}></div>
            <div className={"modal modal-left card" + (perkSelectionVisible ? " visible" : "")}>
                <div className='header-big'>Select Perk</div>
                <div className="list perk-list flex-col">
                    {possiblePerks.map((perk) => <ItemPerk name={perk} value={(Math.random() * 10).toFixed(2) + "%"} onClick={() => { handleSelectPerkClick(perk) }} buttonText={"Choose"} />)}
                </div>
            </div>

            <div className="flex-row" style={{ justifyContent: "space-between", order: window.matchMedia("(max-width: 900px)").matches ? 1 : 0 }}>
                <div className="pagination flex-row card w-100">
                    <Button text={"All Items"} color={0} onClick={() => { setPageContent(0) }} />
                    <Button text={"Your Saved Items"} color={1} onClick={() => { setPageContent(1) }} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>

            <div id={'page-items'} className='page flex-row w-100'>
                {pageContent === 0 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedItemId.slot === null) ? "300%" : "50%" }}>
                            <ItemList setForceUpdate={setForceUpdate} headerText={"All Items"} itemsRef={itemsRef.current.BASE_ITEMS} setSelectedItemId={setSelectedItemId} />
                        </div>
                        <div className='card w-50'>
                            <ItemPreview setSelectedPerkSlot={setSelectedPerkSlot} itemsRef={itemsRef.current.BASE_ITEMS} selectedItemId={selectedItemId} onPerkClick={handlePerkClick} saveItem={saveItem} />
                        </div>
                    </>
                }
                {pageContent === 1 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedSavedItemId.slot === null) ? "300%" : "50%" }}>
                            <ItemList setForceUpdate={setForceUpdate} savedItems headerText={"Saved Items"} itemsRef={savedItemsRef.current} setSelectedItemId={setSelectedSavedItemId} />
                        </div>
                        <div className='card w-50'>
                            <ItemPreview setSelectedPerkSlot={setSelectedPerkSlot} itemsRef={savedItemsRef.current} selectedItemId={selectedSavedItemId} onPerkClick={handlePerkClick} />
                        </div>
                    </>
                }
            </div >
        </>
    )
}

export default PageItems