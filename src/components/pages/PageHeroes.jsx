import { useEffect, useState } from "react"
import ItemList from "../ItemList.jsx"
import ItemPreview from "../ItemPreview.jsx"
import HeroList from "../HeroList.jsx"
import HeroPreview from "../HeroPreview.jsx"
import Button from "../Button.jsx"
import Modal from "../Modal.jsx"
import HelpButton from "../HelpButton.jsx"
import { HeroManagementGuide } from "../Guides.jsx"
import { decodeHeroShareInput, restoreSharedHero } from "../../utils/heroShare.js"
import { clearSearchFromUrl } from "../../js/search.jsx"
import { ATTRIBUTE_DEFINITIONS } from "../../database/enums.jsx"
import { createSavedItemRecord } from "../../js/ids.jsx"
import { useTranslation } from "../../hooks/useTranslation.jsx"
import { useTranslate } from "../../hooks/useTranslate.jsx"

const isItemCompatibleWithHero = (item, hero) => {
    if (!item || !hero) return false
    const requirement = item.attributeRequirement
    return requirement == null
        || Number(requirement) === ATTRIBUTE_DEFINITIONS.NONE.id
        || Number(requirement) === Number(hero.mainAttribute)
}

function PageHeroes({ heroesRef, savedHeroesRef, itemsRef, savedItemsRef, manualSaveFunction, onImportStatusChange }) {
    const t = useTranslate()
    const allHeroesHeader = useTranslation("app.shared.allHeroes")
    const savedHeroesHeader = useTranslation("app.shared.savedHeroes")
    const [pageContent, setPageContent] = useState(0)
    const switchListPage = nextPage => {
        if (pageContent !== nextPage) clearSearchFromUrl()
        setPageContent(nextPage)
    }
    useEffect(() => { setPreviewFullWidth(false) }, [pageContent])
    const [previewFullWidth, setPreviewFullWidth] = useState(false)
    const [importModalVisible, setImportModalVisible] = useState(false)
    const [heroShareInput, setHeroShareInput] = useState("")
    // Ref changes do not trigger renders, so this revision refreshes memoized hero lists after saved-hero changes.
    const [, setSavedHeroesRevision] = useState(0)

    // Hero Stuff
    const [selectedHeroId, setSelectedHeroId] = useState(null)
    const [selectedSavedHeroId, setSelectedSavedHeroId] = useState(null)
    const [equippedItems, setEquippedItems] = useState([])

    const handleHeroSelection = (clickedId, savedHeroes = false) => {
        const currentId = savedHeroes ? selectedSavedHeroId : selectedHeroId
        const nextId = currentId === clickedId ? null : clickedId

        if (savedHeroes) setSelectedSavedHeroId(nextId)
        else setSelectedHeroId(nextId)

        const isMobileViewport = window.matchMedia("(max-width: 900px)").matches
        setPreviewFullWidth(nextId !== null && (isMobileViewport || previewFullWidth))
    }

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

        const nextSavedItems = { ...savedItemsRef.current }
        const slotIndexToNameMap = {
            0: "WEAPONS",
            1: "HELMETS",
            2: "ARMORS",
            3: "NECKLACES",
            4: "RINGS",
            5: "OTHER"
        }
        for (const slotName of Object.values(slotIndexToNameMap)) {
            nextSavedItems[slotName] = Array.isArray(nextSavedItems[slotName]) ? [...nextSavedItems[slotName]] : []
        }

        const importedItems = Array.from({ length: 6 }, (_, slotIndex) => {
            const item = hero.items?.[slotIndex]
            if (!item) return null
            const slotArray = slotIndexToNameMap[Number(item.slot ?? slotIndex)]
            if (!slotArray) return null
            const savedItem = createSavedItemRecord(item)
            nextSavedItems[slotArray] = [...nextSavedItems[slotArray], savedItem]
            return savedItem
        })

        const savedHero = {
            ...hero,
            saveId: nextSaveId,
            items: importedItems
        }

        savedItemsRef.current = nextSavedItems
        savedHeroesRef.current = [...savedHeroesRef.current, savedHero]
        setSavedHeroesRevision(revision => revision + 1)
        switchListPage(1)
        setSelectedHeroId(null)
        setSelectedSavedHeroId(nextSaveId)
        setEquippedItems([...savedHero.items])
        setImportModalVisible(false)
        setHeroShareInput("")
        if (manualSaveFunction) manualSaveFunction()
    }

    const handleImportHeroLink = async (input = heroShareInput) => {
        if (!String(input ?? "").trim()) {
            window.alert(t("app.shared.pasteHeroSharePrompt"))
            return
        }
        if (onImportStatusChange) onImportStatusChange(t("app.shared.importingHero"))
        await new Promise(resolve => window.setTimeout(resolve, 0))
        try {
            const payload = decodeHeroShareInput(input)
            const hero = restoreSharedHero(payload, heroesRef.current, itemsRef.current.BASE_ITEMS)
            importHero(hero)
        } catch (error) {
            window.alert(error.message || t("app.shared.couldNotImportHero"))
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
                window.alert(error.message || t("app.shared.couldNotImportHero"))
            } finally {
                if (onImportStatusChange) onImportStatusChange("")
                params.delete("hero")
                const query = params.toString()
                const cleanUrl = window.location.pathname + (query ? `?${query}` : "") + window.location.hash
                window.history.replaceState({}, "", cleanUrl)
            }
        }, 0)
    // This effect intentionally handles a share token only once on initial page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deselectHero = () => {
        setSelectedHeroId(null)
        setSelectedSavedHeroId(null)
        setEquippedItems([])
        setPreviewFullWidth(false)
    }

    useEffect(() => {
        const handleEscape = event => {
            if (event.key !== "Escape" || event.defaultPrevented || document.querySelector(".modal-backdrop.visible")) return
            if (selectedHeroId === null && selectedSavedHeroId === null) return
            setSelectedHeroId(null)
            setSelectedSavedHeroId(null)
            setEquippedItems([])
            setPreviewFullWidth(false)
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [selectedHeroId, selectedSavedHeroId])

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
            deselectHero()
            switchListPage(1)
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
        deselectHero()
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
        if (targetSlot === null || !itemObj || itemObj.slot !== targetSlot || !isItemCompatibleWithHero(itemObj, activeHero)) return

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
                    <div className="header-big margin-auto">{t("app.shared.importHero")}</div>
                    <div className="text margin-auto">{t("app.shared.pasteHeroShare")}</div>
                    <textarea
                        rows={3}
                        value={heroShareInput}
                        onChange={event => setHeroShareInput(event.target.value)}
                        placeholder="https://…/heroes/?hero=…"
                        
                    />
                    <div className="flex-row">
                        <Button className="w-25" text={t("app.shared.importHero")} color={"confirm"} onClick={handleImportHeroLink} />
                        <Button className="w-25" text={t("app.shared.cancel")} color={"cancel"} onClick={() => setImportModalVisible(false)} />
                    </div>
                </div>
            </Modal>
            <Modal position="left" isVisible={itemSelectionVisible} onClose={() => { setItemSelectionVisible(false); clearItemSelection(); }}>
                <div className="flex-row card w-100" style={{ marginBottom: "10px" }}>
                    <Button disabled text={t("app.shared.allItems")} color={1} onClick={() => setItemSelectionModalMode(0)} />
                    <Button text={t("app.shared.yourSavedItems")} color={1} onClick={() => setItemSelectionModalMode(1)} />
                </div>
                {itemSelectionModalMode === 0 ?
/* NOT ACTIVE    */ <ItemList localSearch setsRef={itemsRef.current.ITEM_SETS} extraHeight={75} filtersOffset={"65px"} headerText={"All Items"} itemsRef={itemsRef.current.BASE_ITEMS} itemType={itemSelectionType} heroAttributeRequirement={activeHero?.mainAttribute} setSelectedItemId={setSelectedItemId} onDoubleClick={equipSelectedItem} /> :
                    <ItemList localSearch setsRef={itemsRef.current.ITEM_SETS} extraHeight={75} filtersOffset={"65px"} savedItems headerText={"Saved Items"} itemsRef={savedItemsRef.current} itemType={itemSelectionType} heroAttributeRequirement={activeHero?.mainAttribute} setSelectedItemId={setSelectedSavedItemId} onDoubleClick={equipSelectedItem} />
                }
            </Modal>
            <Modal position="right" isVisible={selectedItemId.slot !== null || selectedSavedItemId.slot !== null} onClose={() => { setItemSelectionVisible(false); clearItemSelection(); }}>
                {itemSelectionModalMode === 0 ?
/* NOT ACTIVE    */ <ItemPreview setsRef={itemsRef.current.ITEM_SETS} itemsRef={itemsRef.current.BASE_ITEMS} selectedItemId={selectedItemId} equippedItems={equippedItems} onEquipItem={equipSelectedItem}/> :
                    <ItemPreview setsRef={itemsRef.current.ITEM_SETS} itemsRef={savedItemsRef.current} selectedItemId={selectedSavedItemId} equippedItems={equippedItems} onEquipItem={equipSelectedItem}/>
                }
            </Modal>


            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <Button text={t("app.shared.allHeroes")} color={0} onClick={() => { switchListPage(0) }} />
                    <Button text={t("app.shared.savedHeroes")} color={0} onClick={() => { switchListPage(1) }} />
                    <Button text={t("app.shared.importHero")} color={0} onClick={() => setImportModalVisible(true)} />
                </div>
                <div className="options flex-row card">
                    <HelpButton title={t("app.shared.heroManagement")}>
                        <HeroManagementGuide />
                    </HelpButton>
                </div>
            </div>

            <div id='page-heroes' className={'page flex-row w-100 ' + (previewFullWidth ? 'preview-full-width-active' : '')}>
                {pageContent === 0 &&
                    <>
                        <div className='card w-50 hero-list-pane' style={{ width: (selectedHeroId === null) ? "300%" : "50%" }}>
                            <HeroList headerText={allHeroesHeader} heroesRef={heroesRef.current} selectedHeroId={selectedHeroId} setSelectedHeroId={setSelectedHeroId} onSelectHero={clickedId => handleHeroSelection(clickedId)} />
                        </div>
                        <div className='card w-50 hero-preview-pane' style={{ display: (selectedHeroId === null) ? "none" : "block" }}>
                            <HeroPreview isFullWidth={previewFullWidth} onToggleFullWidth={() => setPreviewFullWidth(value => !value)} onClosePreview={deselectHero} heroesRef={heroesRef.current} selectedHeroId={selectedHeroId} saveHero={saveHero} onItemClick={handleItemClick} equippedItems={equippedItems} setsRef={itemsRef.current.ITEM_SETS} />
                        </div>
                    </>
                }
                {pageContent === 1 &&
                    <>
                        <div className='card w-50 hero-list-pane' style={{ width: (selectedSavedHeroId === null) ? "300%" : "50%" }}>
                            <HeroList savedHeroes headerText={savedHeroesHeader} heroesRef={savedHeroesRef.current} selectedHeroId={selectedSavedHeroId} setSelectedHeroId={setSelectedSavedHeroId} onSelectHero={clickedId => handleHeroSelection(clickedId, true)} />
                        </div>
                        <div className='card w-50 hero-preview-pane' style={{ display: (selectedSavedHeroId === null) ? "none" : "block" }}>
                            <HeroPreview isFullWidth={previewFullWidth} onToggleFullWidth={() => setPreviewFullWidth(value => !value)} onClosePreview={deselectHero} heroesRef={savedHeroesRef.current} selectedHeroId={selectedSavedHeroId} saveHero={saveHero} deleteSavedHero={deleteSavedHero} onItemClick={handleItemClick} equippedItems={equippedItems} setsRef={itemsRef.current.ITEM_SETS} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default PageHeroes