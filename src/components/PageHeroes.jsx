import { useEffect, useState } from "react"
import ItemList from "./ItemList.jsx"
import ItemPreview from "./ItemPreview.jsx"
import HeroList from "./HeroList.jsx"
import HeroPreview from "./HeroPreview.jsx"
import Button from "./Button.jsx"
import Modal from "./Modal.jsx"
import { POSSIBLE_PERKS } from "../database/enums.jsx"

function PageHeroes({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction }) {
    const [pageContent, setPageContent] = useState(0)
    const [forceUpdate, setForceUpdate] = useState({})

    // Hero Stuff
    const [selectedHeroId, setSelectedHeroId] = useState(null)
    const [selectedSavedHeroId, setSelectedSavedHeroId] = useState(null)

    const clearHeroSelection = () => { setSelectedHeroId(null) }

    const saveHero = (heroObj) => {
        for (let i = 0; i < savedHeroesRef.current.length; i++) {
            if (heroObj.name === savedHeroesRef.current[i].name) return false
        }
        heroObj.saveId = savedHeroesRef.current.length
        heroObj.items = []
        savedHeroesRef.current.push(heroObj)
        clearHeroSelection()
    }

    // Item Stuff
    const [selectedItemId, setSelectedItemId] = useState({ slot: null, id: null })
    const [selectedSavedItemId, setSelectedSavedItemId] = useState({ slot: null, id: null })

    const [itemSelectionVisible, setItemSelectionVisible] = useState(false)
    const [itemSelectionType, setItemSelectionType] = useState(null)
    const [itemSelectionModalMode, setItemSelectionModalMode] = useState(1)

    const handleItemClick = (slot) => {
        setItemSelectionVisible(true)
        setItemSelectionType(slot)
    }

    const clearItemSelection = () => { setSelectedItemId({ slot: null, id: null }); setSelectedSavedItemId({ slot: null, id: null }) }

    const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS" }
    const saveItem = (itemObj) => {
        console.log("Saving " + itemObj.name + " to " + itemObj.slot);
        let slotArray = slotIndexToNameMap[itemObj.slot];
        itemObj.saveId = savedItemsRef.current[slotArray].length;
        savedItemsRef.current[slotArray].push(itemObj);
        setSavedItemsUpdated((prev) => prev + 1); // Trigger re-render
    };

    return (
        <>
            <Modal position="left" isVisible={itemSelectionVisible} onClose={() => { setItemSelectionVisible(false); clearItemSelection(); }}>
                <div className="flex-row card w-100" style={{ marginBottom: "10px" }}>
                    <Button disabled text={"All Items"} color={1} onClick={() => setItemSelectionModalMode(0)} />
                    <Button text={"Your Saved Items"} color={1} onClick={() => setItemSelectionModalMode(1)} />
                </div>
                {itemSelectionModalMode === 0 ?
/* NOT ACTIVE    */ <ItemList setsRef={itemsRef.current.ITEM_SETS} extraHeight={75} filtersOffset={"65px"} headerText={"All Items"} itemsRef={itemsRef.current.BASE_ITEMS} itemType={itemSelectionType} setSelectedItemId={setSelectedItemId} /> :
                    <ItemList setsRef={itemsRef.current.ITEM_SETS} extraHeight={75} filtersOffset={"65px"} savedItems headerText={"Saved Items"} itemsRef={savedItemsRef.current} itemType={itemSelectionType} setSelectedItemId={setSelectedSavedItemId} />
                }
            </Modal>
            <Modal position="right" isVisible={selectedItemId.slot !== null || selectedSavedItemId.slot !== null} onClose={() => { setItemSelectionVisible(false); clearItemSelection(); }}>
                {itemSelectionModalMode === 0 ?
/* NOT ACTIVE    */ <ItemPreview setsRef={itemsRef.current.ITEM_SETS} itemsRef={itemsRef.current.BASE_ITEMS} selectedItemId={selectedItemId} saveItem={saveItem} /> :
                    <ItemPreview setsRef={itemsRef.current.ITEM_SETS} itemsRef={savedItemsRef.current} selectedItemId={selectedSavedItemId} saveItem={saveItem} />
                }
            </Modal>


            <div className="flex-row" style={{ justifyContent: "space-between", order: window.matchMedia("(max-width: 900px)").matches ? 0 : 0 }}>
                <div className="pagination flex-row card w-100">
                    <Button text={"All Heroes"} color={0} onClick={() => { setPageContent(0) }} />
                    <Button text={"Your Saved Heroes"} color={0} onClick={() => { setPageContent(1) }} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>

            <div id='page-heroes' className='page flex-row w-100'>
                {pageContent === 0 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedHeroId === null) ? "300%" : "50%" }}>
                            <HeroList setForceUpdate={setForceUpdate} headerText={"All Heroes"} heroesRef={heroesRef.current} selectedHeroId={selectedHeroId} setSelectedHeroId={setSelectedHeroId} />
                        </div>
                        <div className='card w-50'>
                            <HeroPreview setForceUpdate={setForceUpdate} heroesRef={heroesRef.current} selectedHeroId={selectedHeroId} saveHero={saveHero} onItemClick={handleItemClick} />
                        </div>
                    </>
                }
                {pageContent === 1 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedSavedHeroId === null) ? "300%" : "50%" }}>
                            <HeroList setForceUpdate={setForceUpdate} savedHeroes headerText={"Saved Heroes"} heroesRef={savedHeroesRef.current} selectedHeroId={selectedSavedHeroId} setSelectedHeroId={setSelectedSavedHeroId} />
                        </div>
                        <div className='card w-50'>
                            <HeroPreview setForceUpdate={setForceUpdate} heroesRef={savedHeroesRef.current} selectedHeroId={selectedSavedHeroId} onItemClick={handleItemClick} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default PageHeroes