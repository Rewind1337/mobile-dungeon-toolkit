import { useEffect, useState } from "react"
import ItemList from "./ItemList.jsx"
import Button from "./Button.jsx"
import ItemPreview from "./ItemPreview.jsx"
import ItemPerk from "./ItemPerk.jsx"
import { POSSIBLE_PERKS } from "../database/enums.jsx"
import { createSavedItemRecord } from "../database/ids.jsx"
import Modal from "./Modal.jsx"
import { createItemShareToken, decodeItemShareInput, decodeItemsShareInput, restoreSharedItem, restoreSharedItems } from "../utils/heroShare.js"

function PageItems({ itemsRef, savedItemsRef, manualSaveFunction, onImportStatusChange }) {
    const [pageContent, setPageContent] = useState(0)
    const [selectedItemId, setSelectedItemId] = useState({ slot: null, id: null })
    const [selectedSavedItemId, setSelectedSavedItemId] = useState({ slot: null, id: null })
    const [itemImportModalVisible, setItemImportModalVisible] = useState(false)
    const [itemShareInput, setItemShareInput] = useState("")
    const [itemShareUrl, setItemShareUrl] = useState("")
    const [itemShareLinkCopied, setItemShareLinkCopied] = useState(false)

    const [perkSelectionVisible, setPerkSelectionVisible] = useState(false)
    const [possiblePerks, setPossiblePerks] = useState([])
    const [perkSelectionMainAttribute, setPerkSelectionMainAttribute] = useState(null)
    const [pendingPerkSelection, setPendingPerkSelection] = useState(null)
    // Ref changes do not trigger renders; this revision refreshes memoized lists after save/delete.
    const [, setSavedItemsRevision] = useState(0)

    const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS" }

    const handleSelectPerkClick = (perk) => {
        if (pendingPerkSelection) {
            pendingPerkSelection(perk)
        }
        setPendingPerkSelection(null)
        setPerkSelectionVisible(false)
    }

    const handlePerkClick = (itemObj, applyPerk) => {
        const slotName = slotIndexToNameMap[itemObj?.slot]
        setPossiblePerks(POSSIBLE_PERKS[slotName] ?? [])
        setPerkSelectionMainAttribute(itemObj?.mainAttribute ?? null)
        setPendingPerkSelection(() => applyPerk)
        setPerkSelectionVisible(true)
    }

    const getPerkSpriteName = name => {
        const mainStat = perkSelectionMainAttribute == null
            ? undefined
            : ({ 0: "attack", 1: "defence", 2: "agility" })[Number(perkSelectionMainAttribute)]
        const mainStatPerkKeys = {
            attack: { MAIN_STAT_FLAT: "ATTACK_FLAT", MAIN_STAT_PERCENT: "ATTACK_PERCENT" },
            defence: { MAIN_STAT_FLAT: "DEFENCE_FLAT", MAIN_STAT_PERCENT: "DEFENCE_PERCENT" },
            agility: { MAIN_STAT_FLAT: "AGILITY_FLAT", MAIN_STAT_PERCENT: "AGILITY_PERCENT" }
        }
        return mainStatPerkKeys[mainStat]?.[name] ?? name
    }

    const saveItem = (itemObj) => {
        const slotArray = slotIndexToNameMap[itemObj.slot]
        if (!slotArray) return

        const existingItems = savedItemsRef.current[slotArray] ?? []
        const savedItem = createSavedItemRecord(itemObj)

        // Replace the root object as well as the slot array so memoized lists see the update.
        savedItemsRef.current = {
            ...savedItemsRef.current,
            [slotArray]: [...existingItems, savedItem]
        }
        setSavedItemsRevision(revision => revision + 1)

        // A saved item should be present in the local save immediately, not only after a tab change.
        if (manualSaveFunction) manualSaveFunction()
    }

    const buildItemShareUrl = (item) => {
        const baseUrl = import.meta.env.BASE_URL
        const basePath = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const url = new URL(`${basePath}items/`, window.location.origin)
        url.searchParams.set("item", createItemShareToken(item))
        return url.toString()
    }

    const handleExportItem = (item) => {
        try {
            setItemShareUrl(buildItemShareUrl(item))
            setItemShareLinkCopied(false)
        } catch (error) {
            window.alert(error.message || "Could not export this item.")
        }
    }

    const handleCopyItemLink = async () => {
        if (!itemShareUrl) return
        try {
            await navigator.clipboard.writeText(itemShareUrl)
            setItemShareLinkCopied(true)
        } catch {
            window.alert("Copying was blocked by your browser. Select and copy the link manually.")
        }
    }

    const saveImportedItems = (items) => {
        const nextSavedItems = { ...savedItemsRef.current }
        for (const item of items) {
            if (!item) continue
            const slotArray = slotIndexToNameMap[Number(item.slot)]
            if (!slotArray) continue
            nextSavedItems[slotArray] = [...(nextSavedItems[slotArray] ?? []), createSavedItemRecord(item)]
        }
        savedItemsRef.current = nextSavedItems
        setSavedItemsRevision(revision => revision + 1)
        if (manualSaveFunction) manualSaveFunction()
    }

    const handleImportItemLink = async (input = itemShareInput, forcedType = null) => {
        if (!String(input ?? "").trim()) {
            window.alert("Paste an item share link or its encoded data.")
            return
        }
        if (onImportStatusChange) onImportStatusChange("Importing Item...")
        await new Promise(resolve => window.setTimeout(resolve, 0))
        try {
            const baseItems = itemsRef.current.BASE_ITEMS
            if (forcedType === "items") {
                const payload = decodeItemsShareInput(input)
                const restoredItems = restoreSharedItems(payload, baseItems)
                saveImportedItems(restoredItems)
            } else if (forcedType === "item") {
                const payload = decodeItemShareInput(input)
                saveImportedItems([restoreSharedItem(payload, baseItems)])
            } else {
                try {
                    const payload = decodeItemsShareInput(input)
                    saveImportedItems(restoreSharedItems(payload, baseItems))
                } catch {
                    const payload = decodeItemShareInput(input)
                    saveImportedItems([restoreSharedItem(payload, baseItems)])
                }
            }
            setItemImportModalVisible(false)
            setItemShareInput("")
        } catch (error) {
            window.alert(error.message || "Could not import this item.")
        } finally {
            if (onImportStatusChange) onImportStatusChange("")
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const itemToken = params.get("item")
        const itemsToken = params.get("items")
        if (!itemToken && !itemsToken) return

        const token = itemsToken ?? itemToken
        const type = itemsToken ? "items" : "item"
        handleImportItemLink(token, type).finally(() => {
            params.delete("item")
            params.delete("items")
            const query = params.toString()
            const cleanUrl = window.location.pathname + (query ? `?${query}` : "") + window.location.hash
            window.history.replaceState({}, "", cleanUrl)
        })
    }, [])

    const deleteSavedItem = (itemObj) => {
        const slotArray = slotIndexToNameMap[itemObj?.slot]
        if (!slotArray || !itemObj) return

        const existingItems = savedItemsRef.current[slotArray] ?? []
        const itemKey = itemObj.saveId ?? itemObj.id
        const nextItems = existingItems.filter(savedItem => (savedItem.saveId ?? savedItem.id) !== itemKey)

        if (nextItems.length === existingItems.length) return

        savedItemsRef.current = {
            ...savedItemsRef.current,
            [slotArray]: nextItems
        }

        if (selectedSavedItemId.id === itemObj.id) {
            setSelectedSavedItemId({ slot: null, id: null })
        }

        setSavedItemsRevision(revision => revision + 1)
        if (manualSaveFunction) manualSaveFunction()
    }

    return (
        <>
            <Modal position="center" isVisible={itemImportModalVisible} onClose={() => setItemImportModalVisible(false)}>
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">Import Item</div>
                    <div className="text margin-auto">Paste an item share link, an equipped-items link, or the encoded data itself.</div>
                    <textarea
                        rows={3}
                        value={itemShareInput}
                        onChange={event => setItemShareInput(event.target.value)}
                        placeholder="https://…/items/?item=…"
                        aria-label="Item share link"
                    />
                    <div className="flex-row">
                        <Button className="w-25" text={"Import Item"} color={"confirm"} onClick={() => handleImportItemLink()} />
                        <Button className="w-25" text={"Cancel"} color={"cancel"} onClick={() => setItemImportModalVisible(false)} />
                    </div>
                </div>
            </Modal>
            <Modal position="center" isVisible={Boolean(itemShareUrl)} onClose={() => setItemShareUrl("")}>
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">Export Item</div>
                    <div className="text margin-auto">Share this link to import this configured item into Saved Items.</div>
                    <textarea rows={3} value={itemShareUrl} readOnly onFocus={event => event.target.select()} aria-label="Item share link" />
                    <div className="flex-row">
                        <Button className="w-25" text={itemShareLinkCopied ? "Link Copied!" : "Copy Item Link"} color={"confirm"} onClick={handleCopyItemLink} />
                        <Button className="w-25" text={"Close"} color={"cancel"} onClick={() => setItemShareUrl("")} />
                    </div>
                </div>
            </Modal>
            <Modal position="center" isVisible={perkSelectionVisible} onClose={() => {
                setPendingPerkSelection(null)
                setPerkSelectionVisible(false)
            }}>
                <div className='flex-row header-big'>Select Perk</div>
                <div className="list perk-list flex-row flex-wrap">
                    {possiblePerks.map(perk => (
                        <ItemPerk
                            key={perk}
                            name={perk}
                            spriteName={getPerkSpriteName(perk)}
                            noValue={true}
                            onClick={() => handleSelectPerkClick(perk)}
                            buttonText={"Choose"}
                        />
                    ))}
                </div>
            </Modal>

            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <Button text={"All Items"} color={1} onClick={() => { setPageContent(0) }} />
                    <Button text={"Your Saved Items"} color={1} onClick={() => { setPageContent(1) }} />
                    <Button text={"Import Item"} color={1} onClick={() => setItemImportModalVisible(true)} />
                </div>
                <div className="options flex-row card">
                    <Button text={"Manual Save"} color={5} onClick={() => { manualSaveFunction() }} />
                </div>
            </div>

            <div id={'page-items'} className='page flex-row w-100'>
                {pageContent === 0 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedItemId.slot === null) ? "300%" : "50%" }}>
                            <ItemList
                                headerText={"All Items"}
                                filtersOffset={"5px"}
                                itemsRef={itemsRef.current.BASE_ITEMS}
                                setSelectedItemId={setSelectedItemId}
                                setsRef={itemsRef.current.BASE_SETS}
                            />
                        </div>
                        <div className='card w-50' style={{ display: (selectedItemId.slot === null) ? "none" : "block" }}>
                            <ItemPreview
                                itemsRef={itemsRef.current.BASE_ITEMS}
                                setsRef={itemsRef.current.ITEM_SETS}
                                selectedItemId={selectedItemId}
                                onPerkClick={handlePerkClick}
                                saveItem={saveItem}
                                onExportItem={handleExportItem}
                            />
                        </div>
                    </>
                }
                {pageContent === 1 &&
                    <>
                        <div className='card w-50' style={{ width: (selectedSavedItemId.slot === null) ? "300%" : "50%" }}>
                            <ItemList
                                savedItems
                                headerText={"Saved Items"}
                                filtersOffset={"5px"}
                                itemsRef={savedItemsRef.current}
                                setSelectedItemId={setSelectedSavedItemId}
                                setsRef={itemsRef.current.ITEM_SETS}
                            />
                        </div>
                        <div className='card w-50' style={{ display: (selectedSavedItemId.slot === null) ? "none" : "block" }}>
                            <ItemPreview
                                itemsRef={savedItemsRef.current}
                                setsRef={itemsRef.current.ITEM_SETS}
                                selectedItemId={selectedSavedItemId}
                                onPerkClick={handlePerkClick}
                                saveItem={saveItem}
                                deleteSavedItem={deleteSavedItem}
                                onExportItem={handleExportItem}
                            />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default PageItems
