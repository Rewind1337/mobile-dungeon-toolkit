import { useEffect, useRef, useState } from "react"
import ItemList from "./ItemList.jsx"
import Button from "./Button.jsx"
import ItemPreview from "./ItemPreview.jsx"
import ItemPerk from "./ItemPerk.jsx"
import { POSSIBLE_PERKS } from "../database/enums.jsx"
import Modal from "./Modal.jsx"

function PageItems({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction }) {
    const [pageContent, setPageContent] = useState(0)
    const [selectedItemId, setSelectedItemId] = useState({ slot: null, id: null })
    const [selectedSavedItemId, setSelectedSavedItemId] = useState({ slot: null, id: null })

    const [itemPerks, setItemPerks] = useState([]);
    const [selectedPerkSlot, setSelectedPerkSlot] = useState(null);
    const [perkSelectionVisible, setPerkSelectionVisible] = useState(false)
    const [possiblePerks, setPossiblePerks] = useState([])

    const [forceUpdate, setForceUpdate] = useState({})

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
        setItemPerks((prevPerks) => {
            const newPerks = [...prevPerks];
            newPerks[selectedPerkSlot] = perk;
            return newPerks;
        });
        setPerkSelectionVisible(false);
    };

    useEffect(() => {
        if (selectedItemId.slot !== null && selectedItemId.id !== null) {
            const slot = slotIndexToNameMap[selectedItemId.slot];
            const itemObj = itemsRef.current.BASE_ITEMS[slot]?.[selectedItemId.id];
            setItemPerks(itemObj?.perks || []); // Initialize with existing perks or empty array
        } else {
            setItemPerks([]); // Reset when no item is selected
        }
    }, [selectedItemId, itemsRef]);

    const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS" }
    const saveItem = (itemObj) => {
        console.log("Saving " + itemObj.name + " to " + itemObj.slot);
        let slotArray = slotIndexToNameMap[itemObj.slot];
        itemObj.saveId = savedItemsRef.current[slotArray].length;
        itemObj.perks = itemPerks;
        savedItemsRef.current[slotArray].push(itemObj);
        setSavedItemsUpdated((prev) => prev + 1); // Trigger re-render
    };

    return (
        <>
            <Modal position="left" isVisible={perkSelectionVisible} onClose={() => setPerkSelectionVisible(false)}>
                <div className='header-big'>Select Perk</div>
                <div className="list perk-list flex-col">
                    {possiblePerks.map((perk) => (
                        <ItemPerk
                            key={perk}
                            name={perk}
                            value={(Math.random() * 10).toFixed(2) + "%"}
                            onClick={() => handleSelectPerkClick(perk)}
                            buttonText={"Choose"}
                        />
                    ))}
                </div>
            </Modal>

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
                            <ItemList setForceUpdate={setForceUpdate} headerText={"All Items"} itemsRef={itemsRef.current.BASE_ITEMS} setSelectedItemId={setSelectedItemId} setsRef={itemsRef.current.BASE_SETS} />
                        </div>
                        <div className='card w-50'>
                            <ItemPreview setForceUpdate={setForceUpdate} itemPerks={itemPerks} setSelectedPerkSlot={setSelectedPerkSlot} itemsRef={itemsRef.current.BASE_ITEMS} setsRef={itemsRef.current.ITEM_SETS} selectedItemId={selectedItemId} onPerkClick={handlePerkClick} saveItem={saveItem} />
                        </div>
                    </>
                }
                {pageContent === 1 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedSavedItemId.slot === null) ? "300%" : "50%" }}>
                            <ItemList setForceUpdate={setForceUpdate} savedItems headerText={"Saved Items"} itemsRef={savedItemsRef.current} setSelectedItemId={setSelectedSavedItemId} setsRef={itemsRef.current.BASE_SETS} />
                        </div>
                        <div className='card w-50'>
                            <ItemPreview setForceUpdate={setForceUpdate} itemPerks={itemPerks} setSelectedPerkSlot={setSelectedPerkSlot} itemsRef={savedItemsRef.current} setsRef={itemsRef.current.ITEM_SETS} selectedItemId={selectedSavedItemId} onPerkClick={handlePerkClick} />
                        </div>
                    </>
                }
            </div >
        </>
    )
}

export default PageItems