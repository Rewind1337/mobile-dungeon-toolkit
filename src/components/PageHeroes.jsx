import { useEffect, useState } from "react"
import ItemList from "./ItemList.jsx"
import ItemPreview from "./ItemPreview.jsx"
import HeroList from "./HeroList.jsx"
import HeroPreview from "./HeroPreview.jsx"
import Button from "./Button.jsx"
import Modal from "./Modal.jsx"
import { decodeHeroShareInput, restoreSharedHero } from "../utils/heroShare.js"

function PageHeroes({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction, onImportStatusChange }) {
    const [pageContent, setPageContent] = useState(0)
    const [importModalVisible, setImportModalVisible] = useState(false)
    const [heroShareInput, setHeroShareInput] = useState("")
    // Ref changes do not trigger renders, so this revision refreshes memoized hero lists after saved-hero changes.
    const [, setSavedHeroesRevision] = useState(0)

    // Hero Stuff
    const [selectedHeroId, setSelectedHeroId] = useState(null)
    const [selectedSavedHeroId, setSelectedSavedHeroId] = useState(null)
    const [equippedItems, setEquippedItems] = useState([])

    const activeHero = pageContent === 0
        ? heroesRef.current.find(hero => hero.id === selectedHeroId)
        : savedHeroesRef.current.find(hero => hero.saveId === selectedSavedHeroId)

    useEffect(() => {
        setEquippedItems(Array.isArray(activeHero?.items) ? [...activeHero.items] : [])
    }, [pageContent, selectedHeroId, selectedSavedHeroId, activeHero?.items])


    const importHero = (hero) => {
        const nextSaveId = Math.max(
            -1,
            ...savedHeroesRef.current
                .map(savedHero => Number(savedHero.saveId))
                .filter(Number.isFinite)
        ) + 1

        const savedHero = {
            ...hero,
            saveId: nextSaveId,
            items: Array.isArray(hero.items) ? [...hero.items] : []
        }

        savedHeroesRef.current = [...savedHeroesRef.current, savedHero]
        setSavedHeroesRevision(revision => revision + 1)
        setPageContent(1)
        setSelectedHeroId(null)
        setSelectedSavedHeroId(nextSaveId)
        setEquippedItems([...savedHero.items])
        setImportModalVisible(false)
        setHeroShareInput("")
        if (manualSaveFunction) manualSaveFunction()
    }

    const handleImportHeroLink = async (input = heroShareInput) => {
        if (!String(input ?? "").trim()) {
            window.alert("Paste a hero share link or its encoded data.")
            return
        }
        if (onImportStatusChange) onImportStatusChange("Importing Hero...")
        await new Promise(resolve => window.setTimeout(resolve, 0))
        try {
            const payload = decodeHeroShareInput(input)
            const hero = restoreSharedHero(payload, heroesRef.current, itemsRef.current.BASE_ITEMS)
            importHero(hero)
        } catch (error) {
            window.alert(error.message || "Could not import this hero link.")
        } finally {
            if (onImportStatusChange) onImportStatusChange("")
        }
    }


    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("hero")
        if (!token) return

        if (onImportStatusChange) onImportStatusChange("Importing Hero...")
        window.setTimeout(() => {
            try {
                const payload = decodeHeroShareInput(token)
                const hero = restoreSharedHero(payload, heroesRef.current, itemsRef.current.BASE_ITEMS)
                importHero(hero)
            } catch (error) {
                window.alert(error.message || "Could not import this hero link.")
            } finally {
                if (onImportStatusChange) onImportStatusChange("")
                params.delete("hero")
                const query = params.toString()
                const cleanUrl = window.location.pathname + (query ? `?${query}` : "") + window.location.hash
                window.history.replaceState({}, "", cleanUrl)
            }
        }, 0)
    }, [])

    const clearHeroSelection = () => { setSelectedHeroId(null) }

    const saveHero = (heroObj) => {
        const existingSaveId = heroObj?.saveId
        const existingIndex = savedHeroesRef.current.findIndex(hero => hero.saveId === existingSaveId)

        if (existingIndex !== -1) {
            savedHeroesRef.current = savedHeroesRef.current.map(hero => (
                hero.saveId === existingSaveId
                    ? { ...hero, ...heroObj, saveId: existingSaveId, items: [...(heroObj.items ?? [])] }
                    : hero
            ))
            setSavedHeroesRevision(revision => revision + 1)
            setSelectedSavedHeroId(existingSaveId)
            setPageContent(1)
            if (manualSaveFunction) manualSaveFunction()
            return
        }

        const nextSaveId = Math.max(
            -1,
            ...savedHeroesRef.current
                .map(hero => Number(hero.saveId))
                .filter(Number.isFinite)
        ) + 1
        const savedHero = {
            ...heroObj,
            saveId: nextSaveId,
            items: [...(heroObj.items ?? [])]
        }
        savedHeroesRef.current = [...savedHeroesRef.current, savedHero]
        setSavedHeroesRevision(revision => revision + 1)
        clearHeroSelection()
        if (manualSaveFunction) manualSaveFunction()
    }

    const deleteSavedHero = (heroObj) => {
        const saveId = heroObj?.saveId ?? selectedSavedHeroId
        if (saveId === null || saveId === undefined) return

        const currentSavedHeroes = savedHeroesRef.current
        const nextSavedHeroes = currentSavedHeroes.filter(hero => hero.saveId !== saveId)
        if (nextSavedHeroes.length === currentSavedHeroes.length) return

        savedHeroesRef.current = nextSavedHeroes

        if (selectedSavedHeroId === saveId) {
            setSelectedSavedHeroId(null)
            setEquippedItems([])
        }

        setSavedHeroesRevision(revision => revision + 1)
        if (manualSaveFunction) manualSaveFunction()
    }

    // Item Stuff
    const [selectedItemId, setSelectedItemId] = useState({ slot: null, id: null })
    const [selectedSavedItemId, setSelectedSavedItemId] = useState({ slot: null, id: null })

    const [itemSelectionVisible, setItemSelectionVisible] = useState(false)
    const [itemSelectionType, setItemSelectionType] = useState(null)
    const [itemSelectionModalMode, setItemSelectionModalMode] = useState(1)

    const handleItemClick = (slot) => {
        setItemSelectionType(slot)
        setSelectedItemId({ slot: null, id: null })
        setSelectedSavedItemId({ slot: null, id: null })
        setItemSelectionVisible(true)
    }

    const equipSelectedItem = (itemObj) => {
        const targetSlot = itemSelectionType
        if (targetSlot === null || !itemObj || itemObj.slot !== targetSlot) return

        const nextItems = [...equippedItems]
        nextItems[targetSlot] = { ...itemObj }
        setEquippedItems(nextItems)

        if (pageContent === 1 && selectedSavedHeroId !== null) {
            savedHeroesRef.current = savedHeroesRef.current.map(hero => (
                hero.saveId === selectedSavedHeroId
                    ? { ...hero, items: [...nextItems] }
                    : hero
            ))
            if (manualSaveFunction) manualSaveFunction()
        }

        setItemSelectionVisible(false)
        clearItemSelection()
    }

    const clearItemSelection = () => { setSelectedItemId({ slot: null, id: null }); setSelectedSavedItemId({ slot: null, id: null }) }

    return (
        <>
            <Modal position="center" isVisible={importModalVisible} onClose={() => setImportModalVisible(false)}>
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">Import Hero</div>
                    <div className="text margin-auto">Paste a hero share link below. You can also paste the encoded data by itself.</div>
                    <textarea
                        rows={3}
                        value={heroShareInput}
                        onChange={event => setHeroShareInput(event.target.value)}
                        placeholder="https://…/heroes/?hero=…"
                        aria-label="Hero share link"
                    />
                    <div className="flex-row">
                        <Button className="w-25" text={"Import Hero"} color={"confirm"} onClick={handleImportHeroLink} />
                        <Button className="w-25" text={"Cancel"} color={"cancel"} onClick={() => setImportModalVisible(false)} />
                    </div>
                </div>
            </Modal>
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
/* NOT ACTIVE    */ <ItemPreview setsRef={itemsRef.current.ITEM_SETS} itemsRef={itemsRef.current.BASE_ITEMS} selectedItemId={selectedItemId} onEquipItem={equipSelectedItem}/> :
                    <ItemPreview setsRef={itemsRef.current.ITEM_SETS} itemsRef={savedItemsRef.current} selectedItemId={selectedSavedItemId} onEquipItem={equipSelectedItem}/>
                }
            </Modal>


            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <Button text={"All Heroes"} color={0} onClick={() => { setPageContent(0) }} />
                    <Button text={"Saved Heroes"} color={0} onClick={() => { setPageContent(1) }} />
                    <Button text={"Import Hero"} color={0} onClick={() => setImportModalVisible(true)} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>

            <div id='page-heroes' className='page flex-row w-100'>
                {pageContent === 0 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedHeroId === null) ? "300%" : "50%" }}>
                            <HeroList headerText={"All Heroes"} heroesRef={heroesRef.current} selectedHeroId={selectedHeroId} setSelectedHeroId={setSelectedHeroId} />
                        </div>
                        <div className='card w-50' style={{ display: (selectedHeroId === null) ? "none" : "block" }}>
                            <HeroPreview heroesRef={heroesRef.current} selectedHeroId={selectedHeroId} saveHero={saveHero} onItemClick={handleItemClick} equippedItems={equippedItems} setsRef={itemsRef.current.ITEM_SETS} />
                        </div>
                    </>
                }
                {pageContent === 1 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedSavedHeroId === null) ? "300%" : "50%" }}>
                            <HeroList savedHeroes headerText={"Saved Heroes"} heroesRef={savedHeroesRef.current} selectedHeroId={selectedSavedHeroId} setSelectedHeroId={setSelectedSavedHeroId} />
                        </div>
                        <div className='card w-50' style={{ display: (selectedSavedHeroId === null) ? "none" : "block" }}>
                            <HeroPreview heroesRef={savedHeroesRef.current} selectedHeroId={selectedSavedHeroId} saveHero={saveHero} deleteSavedHero={deleteSavedHero} onItemClick={handleItemClick} equippedItems={equippedItems} setsRef={itemsRef.current.ITEM_SETS} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default PageHeroes