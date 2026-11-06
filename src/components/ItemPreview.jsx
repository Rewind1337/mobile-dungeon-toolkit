import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { CONSTANTS } from '../database/constants.jsx'
import { DEFAULT_MASTERWORK_MUTATIONS, MASTERWORK_MUTATION_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, ATTRIBUTE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, getEnumNameById, getItemPerkCount, getMaxMasterworkLevel } from '../database/enums.jsx'
import { attributeSprites, iconSprites } from '../database/db_sprites.jsx'
import { getActiveSetBonusCount } from '../utils/calculatedStats.js'
import ExpandSrc from '../sprites/expand.webp'
import CrossSrc from '../sprites/cross.png'
import DamagedItemIndicator from './DamagedItemIndicator.jsx'
import MasterworkSrc from '../sprites/masterwork.webp'

import Button from './Button.jsx'
import { useTranslate } from '../hooks/useTranslate.jsx'
import ItemPerk from './ItemPerk.jsx'

import '../css/item.scss'

const SLOT_INDEX_TO_NAME_MAP = {
    0: "WEAPONS",
    1: "HELMETS",
    2: "ARMORS",
    3: "NECKLACES",
    4: "RINGS"
}

function hasSetBonusOrUniqueEffect(item) {
    return (
        (item?.unique !== undefined && item?.unique !== null && item.unique !== 0) ||
        (item?.set !== undefined && item?.set !== null && item.set !== -1)
    )
}

function makePerkSlots(item, rarity) {
    const count = getItemPerkCount(rarity, hasSetBonusOrUniqueEffect(item))
    const existingPerks = Array.isArray(item?.perks) ? item.perks : []
    const existingValues = Array.isArray(item?.perkValues) ? item.perkValues : []

    return {
        perks: Array.from({ length: count }, (_, index) => existingPerks[index] || "NOTHING"),
        values: Array.from({ length: count }, (_, index) => Number(existingValues[index] ?? 0))
    }
}

const MAIN_STAT_PERK_KEYS = {
    attack: { flat: "ATTACK_FLAT", percent: "ATTACK_PERCENT" },
    defence: { flat: "DEFENCE_FLAT", percent: "DEFENCE_PERCENT" },
    agility: { flat: "AGILITY_FLAT", percent: "AGILITY_PERCENT" }
}

function getAvailableMutationPerks(perks, mainAttribute) {
    const available = new Set(
        (perks ?? [])
            .map(perk => String(perk ?? "NOTHING").toUpperCase().replace(/\s/g, "_"))
            .filter(key => key !== "NOTHING" && PERK_DEFINITIONS[key])
    )
    const mainStat = ({ 0: "attack", 1: "defence", 2: "agility" })[Number(mainAttribute)]
    if (mainStat && available.has("MAIN_STAT_FLAT")) available.add(MAIN_STAT_PERK_KEYS[mainStat].flat)
    if (mainStat && available.has("MAIN_STAT_PERCENT")) available.add(MAIN_STAT_PERK_KEYS[mainStat].percent)
    return available
}

function normalizeMutationSelections(mutations, masterworkLevel, maxMasterworkLevel, perks, mainAttribute) {
    const normalized = { ...DEFAULT_MASTERWORK_MUTATIONS, ...(mutations ?? {}) }
    const available = getAvailableMutationPerks(perks, mainAttribute)
    for (const milestone of [5, 10]) {
        const selection = normalized[milestone]
        const hasValidTarget = selection && (
            available.has(selection.perkKey) ||
            (selection.perkKey === "HEAL_RECOVERY" && available.has("HEALING_RECEIVED"))
        )
        if (masterworkLevel < milestone || maxMasterworkLevel < milestone || !hasValidTarget) {
            normalized[milestone] = null
        }
    }
    const first = normalized[5]
    const second = normalized[10]
    if (first && second && first.perkKey === second.perkKey && Number(first.id) === Number(second.id)) {
        normalized[10] = null
    }
    return normalized
}

function ItemPreview({ isFullWidth = false, onToggleFullWidth, onClosePreview, itemsRef, selectedItemId, onPerkClick, saveItem, deleteSavedItem, onEquipItem, onExportItem, setsRef, equippedItems = [] }) {
    const t = useTranslate()
    const [itemObj, setItemObj] = useState(null)
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const [selectedRarity, setSelectedRarity] = useState(null)
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [selectedMasterworkLevel, setSelectedMasterworkLevel] = useState(0)
    const [selectedItemDamaged, setSelectedItemDamaged] = useState(false)
    const [selectedPerks, setSelectedPerks] = useState([])
    const [selectedPerkValues, setSelectedPerkValues] = useState([])
    const [fixedPerkValues, setFixedPerkValues] = useState([])
    const [selectedSetBonusValues, setSelectedSetBonusValues] = useState([])
    const [selectedMutations, setSelectedMutations] = useState({ ...DEFAULT_MASTERWORK_MUTATIONS })

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5
        if (window.matchMedia("(max-width: 900px)").matches === true) {
            newHeight = window.innerHeight - CONSTANTS.listHeightDefault + 77
        }
        if (listRef.current !== null) {
            if (window.matchMedia("(max-width: 900px)").matches === true) {
                newHeight = window.innerHeight - (CONSTANTS.listHeightMobile + listRef.current.offsetTop)
            } else {
                newHeight = window.innerHeight - (CONSTANTS.listHeightDefault + listRef.current.offsetTop)
            }
        }
        setListHeight(newHeight)
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize)
        onResize()
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useLayoutEffect(() => {
        if (listRef.current) listRef.current.scrollTop = 0
    }, [selectedItemId.slot, selectedItemId.id, itemsRef])

    const getPerkKey = (perk) => Object.keys(PERK_DEFINITIONS).find(key => PERK_DEFINITIONS[key].id === perk.id) ?? "NOTHING"

    useEffect(() => {
        if (selectedItemId.slot === null || selectedItemId.id === null) {
            setItemObj(null)
            return
        }

        const slotName = SLOT_INDEX_TO_NAME_MAP[selectedItemId.slot]
        const selectedItem = slotName ? itemsRef[slotName]?.find(item => item.id === selectedItemId.id) : null
        if (!selectedItem) {
            setItemObj(null)
            return
        }

        const minimumRarity = RARITY_DEFINITIONS.RARE.id
        const rarity = Math.max(minimumRarity, Math.min(8, Number(selectedItem.rarity ?? minimumRarity)))
        const perkSlots = makePerkSlots(selectedItem, rarity)
        const masterworkLevel = Math.max(0, Math.min(getMaxMasterworkLevel(rarity), Math.trunc(Number(selectedItem.masterworkLevel) || 0)))
        const mutations = normalizeMutationSelections(
            selectedItem.mutations,
            masterworkLevel,
            getMaxMasterworkLevel(rarity),
            perkSlots.perks,
            selectedItem.mainAttribute
        )

        setItemObj(selectedItem)
        setSelectedRarity(rarity)
        setSelectedLevel(Number(selectedItem.level) || 1)
        setSelectedMasterworkLevel(masterworkLevel)
        setSelectedItemDamaged(Boolean(selectedItem.isDamaged))
        setSelectedPerks(perkSlots.perks)
        setSelectedPerkValues(perkSlots.values)
        setFixedPerkValues((selectedItem.fixedPerks ?? []).map(perk => Number(perk.value ?? 0)))
        setSelectedSetBonusValues(Array.isArray(selectedItem.setBonusValues)
            ? selectedItem.setBonusValues.map(value => Number(value ?? 0))
            : [])
        setSelectedMutations(mutations)
    }, [selectedItemId, itemsRef])

    const updateMasterworkLevel = (value, maxLevel = getMaxMasterworkLevel(selectedRarity), perks = selectedPerks) => {
        const nextLevel = Math.max(0, Math.min(maxLevel, Math.trunc(Number(value) || 0)))
        setSelectedMasterworkLevel(nextLevel)
        setSelectedMutations(previous => normalizeMutationSelections(
            previous,
            nextLevel,
            maxLevel,
            perks,
            itemObj?.mainAttribute
        ))
    }

    const changeRarity = (nextRarity) => {
        if (!itemObj) return
        const minimumRarity = RARITY_DEFINITIONS.RARE.id
        const rarity = Math.max(minimumRarity, Math.min(8, Number(nextRarity) || minimumRarity))
        const perkSlots = makePerkSlots({ ...itemObj, perks: selectedPerks, perkValues: selectedPerkValues }, rarity)
        setSelectedRarity(rarity)
        updateMasterworkLevel(selectedMasterworkLevel, getMaxMasterworkLevel(rarity), perkSlots.perks)
        setSelectedPerks(perkSlots.perks)
        setSelectedPerkValues(perkSlots.values)
    }

    const handlePerkSelect = (index) => {
        if (selectedItemDamaged || !onPerkClick) return
        onPerkClick(itemObj, (chosenPerk) => {
            const nextPerks = selectedPerks.map((perk, perkIndex) => perkIndex === index ? chosenPerk : perk)
            setSelectedPerks(nextPerks)
            setSelectedPerkValues(previous => previous.map((value, perkIndex) => (
                perkIndex === index && selectedPerks[index] !== chosenPerk ? 0 : value
            )))
            setSelectedMutations(previous => normalizeMutationSelections(
                previous,
                selectedMasterworkLevel,
                getMaxMasterworkLevel(selectedRarity),
                nextPerks,
                itemObj.mainAttribute
            ))
        }, selectedPerks.filter((_, perkIndex) => perkIndex !== index))
    }

    const getConfiguredItem = () => {
        if (!itemObj) return null
        const minimumRarity = RARITY_DEFINITIONS.RARE.id
        const rarity = Math.max(minimumRarity, Math.min(8, Number(selectedRarity) || minimumRarity))
        return {
            ...itemObj,
            level: Math.max(1, Number(selectedLevel) || 1),
            masterworkLevel: Math.max(0, Math.min(getMaxMasterworkLevel(rarity), Math.trunc(Number(selectedMasterworkLevel) || 0))),
            isDamaged: selectedItemDamaged,
            mutations: { ...DEFAULT_MASTERWORK_MUTATIONS, ...selectedMutations },
            rarity,
            fixedPerks: (itemObj.fixedPerks ?? []).map((perk, index) => ({
                ...perk,
                value: Number(fixedPerkValues[index] ?? 0)
            })),
            setBonusValues: [...selectedSetBonusValues].map(value => Number(value) || 0),
            perks: [...selectedPerks],
            perkValues: selectedPerkValues.map(value => Number(value) || 0)
        }
    }

    const handleSaveItem = () => {
        if (!saveItem) return
        const configuredItem = getConfiguredItem()
        if (configuredItem) saveItem(configuredItem)
    }

    const handleEquipItem = () => {
        if (!onEquipItem) return
        const configuredItem = getConfiguredItem()
        if (configuredItem) onEquipItem(configuredItem)
    }

    const handleDeleteSavedItem = () => {
        if (!deleteSavedItem || !itemObj) return
        deleteSavedItem(itemObj)
    }

    const getUniqueEffectDisplay = (unique, rarity) => {
        const effects = unique?.rarityEffect
        if (!Array.isArray(effects) || effects.length === 0) {
            return { value: 1, usesHighestAvailableValue: false }
        }

        // Existing rarityEffect arrays begin at RARE and currently end at MYTHIC.
        // Higher rarities reuse the last known value until more data is available.
        const rarityIndex = Math.max(0, Number(rarity) - RARITY_DEFINITIONS.RARE.id)
        const effectIndex = Math.min(rarityIndex, effects.length - 1)
        return {
            value: effects[effectIndex],
            usesHighestAvailableValue: rarityIndex >= effects.length
        }
    }

    const noSelection = selectedItemId.slot === null || selectedItemId.id === null

    if (noSelection || itemObj === null) {
        return (
            <div className='item-preview'>
                <div className='header-big'>{t("app.pages.items.preview.selectItem")}</div>
            </div>
        )
    }

    const selectedSet = itemObj.set !== undefined && itemObj.set !== null && itemObj.set !== -1
        ? setsRef?.find(set => set.id === itemObj.set)
        : null
    const equippedSetPieceCount = selectedSet
        ? (equippedItems ?? []).reduce((count, equippedItem, slotIndex) => (
            slotIndex !== Number(itemObj.slot) && equippedItem?.set === selectedSet.id ? count + 1 : count
        ), 0) + 1
        : 0
    const activeSetBonusCount = getActiveSetBonusCount(selectedSet, equippedSetPieceCount)
    const isEquipping = typeof onEquipItem === "function"
    const maxMasterworkLevel = getMaxMasterworkLevel(selectedRarity)
    const itemMainStat = ({ 0: "attack", 1: "defence", 2: "agility" })[Number(itemObj.mainAttribute)]
    const getPerkSpriteName = name => {
        if (name === "MAIN_STAT_FLAT") return MAIN_STAT_PERK_KEYS[itemMainStat]?.flat ?? name
        if (name === "MAIN_STAT_PERCENT") return MAIN_STAT_PERK_KEYS[itemMainStat]?.percent ?? name
        return name
    }
    const availableMutationPerks = getAvailableMutationPerks(selectedPerks, itemObj.mainAttribute)

    return (
        <div ref={listRef} className='item-preview flex-col' style={{ maxHeight: listHeight }}>
            <div className='preview-top-row flex-row sticky-top'>
                <Button className='preview-back-button preview-action-chip' prefix={<img className="preview-direction-icon" src={ExpandSrc} alt="" style={{ transform: isFullWidth ? 'rotate(-90deg)' : 'rotate(90deg)' }} />} title={isFullWidth ? t("app.shared.showItemList") : t("app.shared.expandPreview")} text={isFullWidth ? t("app.shared.showList") : t("app.shared.expand")} onClick={onToggleFullWidth} color={1} />
                <Button className='preview-close-button preview-action-chip' prefix={<img className="preview-close-icon" src={CrossSrc} alt="" />} title={t("app.shared.deselectItemClosePreview")} text={t("app.shared.deselectItem")} onClick={onClosePreview} color='cancel' />
            </div>
            <div className='item-preview-metadata'>
                <span className='catalogue-chip text item-preview-slot'>
                    {iconSprites[String(SLOT_INDEX_TO_NAME_MAP[itemObj.slot] ?? '').toLowerCase()] && <img className='catalogue-chip-icon' src={iconSprites[String(SLOT_INDEX_TO_NAME_MAP[itemObj.slot] ?? '').toLowerCase()]} alt='' />}
                    {getEnumNameById(EQUIPMENT_SLOT_DEFINITIONS, Number(itemObj.slot)) ?? SLOT_INDEX_TO_NAME_MAP[itemObj.slot] ?? 'Unknown slot'}
                </span>
                <div className='catalogue-chip text header item-preview-name' data-rarity={selectedRarity}>{itemObj.name}</div>
                {Number(itemObj.attributeRequirement) === ATTRIBUTE_DEFINITIONS.NONE.id
                    ? <span className="catalogue-chip text item-preview-attribute item-preview-attribute-all">
                        {[ATTRIBUTE_DEFINITIONS.STRENGTH.id, ATTRIBUTE_DEFINITIONS.DEXTERITY.id, ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id].map(attributeId => (
                            <img className="catalogue-chip-icon" key={attributeId} src={attributeSprites[attributeId]} alt="" />
                        ))}
                        All
                    </span>
                    : <span className={'catalogue-chip text item-preview-attribute ' + (Number(itemObj.attributeRequirement) === 1 ? 'catalogue-chip-attribute-strength' : Number(itemObj.attributeRequirement) === 2 ? 'catalogue-chip-attribute-dexterity' : Number(itemObj.attributeRequirement) === 3 ? 'catalogue-chip-attribute-intelligence' : '')}>
                        {attributeSprites[Number(itemObj.attributeRequirement)] && <img className='catalogue-chip-icon' src={attributeSprites[Number(itemObj.attributeRequirement)]} alt='' />}
                        {getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(itemObj.attributeRequirement)) ?? 'Attribute not specified'}
                    </span>}
            </div>
            <div className='flex-col'>
                <div className='flex-row'>
                    <div className={"item card selected" + (selectedItemDamaged ? " is-damaged" : "")} data-rarity={selectedRarity} data-type={itemObj.iconType}>
                        <div className="item-icon"><img src={itemObj.iconSrc} draggable={false} alt="" /></div>
                        {selectedItemDamaged && (
                            <div className="item-icon item-icon-damaged">
                                <DamagedItemIndicator loading="eager" />
                            </div>
                        )}
                        <div className="flex-col">
                            <div className="item-sprite"><img className="item-sprite-img" src={itemObj.itemSrc} draggable={false} alt="" /></div>
                            <div className="input-wrapper">
                                    <input
                                        type='number'
                                        min='1'
                                        className=''
                                        value={selectedLevel}
                                        onChange={event => setSelectedLevel(event.target.value)}
                                    />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card flex-row justify-evenly rarity-control'>
                    <Button
                        text={t("app.pages.items.preview.rarityDecrease")}
                        disabled={selectedRarity <= RARITY_DEFINITIONS.RARE.id}
                        onClick={() => changeRarity(selectedRarity - 1)}
                        color={1}
                    />
                    <div className='rarity-heading'>
                        <div className='header'>{getEnumNameById(RARITY_DEFINITIONS, selectedRarity)}</div>
                    </div>
                    <Button
                        text={t("app.pages.items.preview.rarityIncrease")}
                        disabled={selectedRarity >= RARITY_DEFINITIONS.ANCIENT.id}
                        onClick={() => changeRarity(selectedRarity + 1)}
                        color={1}
                    />
                </div>

                <div className='card flex-col masterwork-control'>
                    <div className='masterwork-heading'>
                        <div className='header'>{t("app.pages.items.preview.masterworkLevel", { level: selectedMasterworkLevel, maxLevel: maxMasterworkLevel })}</div>
                    </div>
                    <div className='flex-row masterwork-input-row'>
                    <Button text={t("app.pages.items.preview.masterworkDecrease")} disabled={selectedMasterworkLevel <= 0} onClick={() => updateMasterworkLevel(selectedMasterworkLevel - 1)} color={1} />
                        <div className="masterwork-art-control">
                            <img className="masterwork-artwork" src={MasterworkSrc} alt="" draggable={false} />
                            <input
                                className="masterwork-level-input"
                                aria-label={t("app.pages.items.preview.masterworkAriaLabel")}
                                type='number'
                                min='0'
                                max={maxMasterworkLevel}
                                step='1'
                                value={selectedMasterworkLevel}
                                onChange={event => {
                                    const value = event.target.value
                                    updateMasterworkLevel(value)
                                }}
                            />
                        </div>
                    <Button text={t("app.pages.items.preview.masterworkIncrease")} disabled={selectedMasterworkLevel >= maxMasterworkLevel} onClick={() => updateMasterworkLevel(selectedMasterworkLevel + 1)} color={1} />
                    </div>
                    <div className='text masterwork-summary'>
                        Fixed item stats only: +{selectedMasterworkLevel * 10}% ({(1 + selectedMasterworkLevel / 10).toFixed(1)}×)
                    </div>
                    <label className='flex-row masterwork-damaged-toggle'>
                        <input
                            type='checkbox'
                            checked={selectedItemDamaged}
                            onChange={event => setSelectedItemDamaged(event.target.checked)}
                        />
                        <div className='text'>{t("app.pages.items.preview.damagedItem")}</div>
                    </label>
                    <div className='card flex-col masterwork-mutation-controls'>
                    <div className='header'>{t("app.pages.items.preview.masterworkMutations")}</div>
                    {[5, 10].map(milestone => (
                        <div className='flex-col masterwork-mutation-select' key={milestone}>
                            <span className='text'>{milestone === 5 ? t("app.pages.items.preview.firstMutation") : t("app.pages.items.preview.secondMutation")}</span>
                            <select className='text'
                                value={selectedMutations[milestone] ? `${selectedMutations[milestone].perkKey}:${selectedMutations[milestone].id}` : ""}
                                disabled={selectedMasterworkLevel < milestone || maxMasterworkLevel < milestone}
                                onChange={event => {
                                    const [perkKey, id] = event.target.value.split(":")
                                    const otherSelection = selectedMutations[milestone === 5 ? 10 : 5]
                                    if (event.target.value && otherSelection?.perkKey === perkKey && Number(otherSelection.id) === Number(id)) return
                                    setSelectedMutations(previous => ({ ...previous, [milestone]: event.target.value ? { perkKey, id: Number(id) } : null }))
                                }}
                            >
                                <option value="">{t("app.pages.items.preview.unlockedAtMasterwork", { level: milestone })}</option>
                                {Object.entries(MASTERWORK_MUTATION_DEFINITIONS)
                                    .filter(([perkKey]) => availableMutationPerks.has(perkKey) || (perkKey === "HEAL_RECOVERY" && availableMutationPerks.has("HEALING_RECEIVED")))
                                    .flatMap(([perkKey, mutations]) => mutations
                                        .filter(mutation => {
                                            const otherSelection = selectedMutations[milestone === 5 ? 10 : 5]
                                            return !otherSelection || otherSelection.perkKey !== perkKey || Number(otherSelection.id) !== Number(mutation.id)
                                        })
                                        .map(mutation => (
                                            <option key={`${perkKey}:${mutation.id}`} value={`${perkKey}:${mutation.id}`}>
                                                {`${perkKey.replace(/_/g, " ")} — ${mutation.name}`}
                                            </option>
                                        ))
                                    )}
                            </select>
                        </div>
                    ))}
                    <small className='text'>{t("app.pages.items.preview.conditionalMutationNote")}</small>
                </div>

                </div>

                {itemObj.unique && itemObj.unique !== 0 && itemObj.unique.description && <div className='card'>
                    <div className='text flex-col'>
                        <div className='flex-row'>
                            <img src={iconSprites["unique"]} />
                            <div className='header'>{t("app.pages.items.preview.weaponEffect")}</div>
                            <img src={iconSprites["unique"]} />
                        </div>
                        {(() => {
                            const effect = getUniqueEffectDisplay(itemObj.unique, selectedRarity)
                            const displayedValue = (((effect.value ?? 1) - 1) * 100).toFixed(2) + "%"
                            const [descriptionBefore, descriptionAfter = ""] = itemObj.unique.description.split("$e")
                            return <span className='text'>
                                {descriptionBefore}
                                {displayedValue}
                                {effect.usesHighestAvailableValue && <span title={t("app.pages.items.preview.missingRarityValue")}> (?)</span>}
                                {descriptionAfter}
                            </span>
                        })()}
                    </div>
                </div>}

                {itemObj.fixedPerks?.length > 0 && <>
                    <div className='header'>{t("app.pages.items.preview.fixedItemPerks")}</div>
                    {itemObj.fixedPerks.map((perk, index) => (
                        <ItemPerk
                            key={"fixedperk_" + perk.id}
                            name={getPerkKey(perk)}
                            spriteName={getPerkSpriteName(getPerkKey(perk))}
                            value={fixedPerkValues[index] ?? 0}
                            multiplier={1 + selectedMasterworkLevel / 10}
                            editable={true}
                            onValueChange={value => setFixedPerkValues(previous => previous.map((oldValue, perkIndex) => (
                                perkIndex === index ? value : oldValue
                            )))}
                        />
                    ))}
                </>}

                {selectedSet?.setBonus && <>
                    <div className='header'>{t("app.pages.items.preview.setBonus")}</div>
                    {selectedSet.setBonus.map((bonus, index) => {
                        const isActive = isEquipping && index < activeSetBonusCount
                        return (
                            <div className={"item-set-bonus-state" + (isEquipping ? (isActive ? " is-active" : " is-inactive") : "")} key={"setperk_" + bonus.id + "_" + index}>
                                <ItemPerk
                                    name={getPerkKey(bonus)}
                                    spriteName={getPerkSpriteName(getPerkKey(bonus))}
                                    value={selectedSetBonusValues[index] ?? 0}
                                    editable={true}
                                    onValueChange={value => setSelectedSetBonusValues(previous => {
                                        const nextValues = [...previous]
                                        nextValues[index] = value
                                        return nextValues
                                    })}
                                />
                                {isEquipping && <span className="text item-set-bonus-status">{isActive ? t("app.pages.items.preview.active") : t("app.pages.items.preview.inactive")}</span>}
                            </div>
                        )
                    })}
                </>}

                <div className='header'>{t("app.shared.perks")}</div>
                {selectedPerks.length === 0
                    ? <div>{t("app.pages.items.preview.noPerks")}</div>
                    : selectedPerks.map((perk, index) => (
                        <ItemPerk
                            key={"perk_" + index}
                            name={(perk || "NOTHING").toUpperCase().replace(/\s/g, '_')}
                            spriteName={getPerkSpriteName((perk || "NOTHING").toUpperCase().replace(/\s/g, '_'))}
                            value={selectedPerkValues[index] ?? 0}
                            perkSlot={index + 1}
                            editable={true}
                            onValueChange={value => setSelectedPerkValues(previous => previous.map((oldValue, perkIndex) => (
                                perkIndex === index ? value : oldValue
                            )))}
                            onClick={!onEquipItem ? () => handlePerkSelect(index) : undefined}
                            changeDisabled={selectedItemDamaged}
                            hideChangeButton={Boolean(onEquipItem)}
                        />
                    ))
                }

                {(saveItem || onEquipItem || deleteSavedItem || (onExportItem && deleteSavedItem)) && <div className='flex-row sticky-bottom'>
                    {saveItem && <Button text={t("app.shared.saveItem")} onClick={handleSaveItem} color={"confirm"} />}
                    {onEquipItem && <Button text={t("app.shared.equipItem")} onClick={handleEquipItem} color={1} />}
                    {onExportItem && deleteSavedItem && <Button text={t("app.shared.exportItem")} onClick={() => onExportItem(getConfiguredItem())} color={1} />}
                    {deleteSavedItem && <Button text={t("app.shared.deleteSavedItem")} onClick={handleDeleteSavedItem} color={"cancel"} />}
                </div>}
            </div>
        </div>
    )
}

export default ItemPreview
