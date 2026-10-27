import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { CONSTANTS } from '../database/constants.jsx'
import { DEFAULT_MASTERWORK_MUTATIONS, MASTERWORK_MUTATION_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById, getItemPerkCount, getMaxMasterworkLevel } from '../database/enums.jsx'
import { iconSprites } from '../database/db_sprites.jsx'

import Button from './Button.jsx'
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

function ItemPreview({ isFullWidth = false, onToggleFullWidth, itemsRef, selectedItemId, onPerkClick, saveItem, deleteSavedItem, onEquipItem, onExportItem, setsRef }) {
    const MAIN_STAT_PERK_KEYS = {
        attack: { flat: "ATTACK_FLAT", percent: "ATTACK_PERCENT" },
        defence: { flat: "DEFENCE_FLAT", percent: "DEFENCE_PERCENT" },
        agility: { flat: "AGILITY_FLAT", percent: "AGILITY_PERCENT" }
    }
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

        setItemObj(selectedItem)
        setSelectedRarity(rarity)
        setSelectedLevel(Number(selectedItem.level) || 1)
        setSelectedMasterworkLevel(Math.max(0, Math.min(getMaxMasterworkLevel(rarity), Math.trunc(Number(selectedItem.masterworkLevel) || 0))))
        setSelectedItemDamaged(Boolean(selectedItem.isDamaged))
        setSelectedPerks(perkSlots.perks)
        setSelectedPerkValues(perkSlots.values)
        setFixedPerkValues((selectedItem.fixedPerks ?? []).map(perk => Number(perk.value ?? 0)))
        setSelectedSetBonusValues(Array.isArray(selectedItem.setBonusValues)
            ? selectedItem.setBonusValues.map(value => Number(value ?? 0))
            : [])
        setSelectedMutations({ ...DEFAULT_MASTERWORK_MUTATIONS, ...(selectedItem.mutations ?? {}) })
    }, [selectedItemId, itemsRef])

    const changeRarity = (nextRarity) => {
        if (!itemObj) return
        const minimumRarity = RARITY_DEFINITIONS.RARE.id
        const rarity = Math.max(minimumRarity, Math.min(8, Number(nextRarity) || minimumRarity))
        const perkSlots = makePerkSlots({ ...itemObj, perks: selectedPerks, perkValues: selectedPerkValues }, rarity)
        setSelectedRarity(rarity)
        setSelectedMasterworkLevel(previous => Math.max(0, Math.min(getMaxMasterworkLevel(rarity), Math.trunc(Number(previous) || 0))))
        setSelectedPerks(perkSlots.perks)
        setSelectedPerkValues(perkSlots.values)
    }

    const handlePerkSelect = (index) => {
        if (selectedItemDamaged || !onPerkClick) return
        onPerkClick(itemObj, (chosenPerk) => {
            setSelectedPerks(previous => previous.map((perk, perkIndex) => perkIndex === index ? chosenPerk : perk))
            setSelectedPerkValues(previous => previous.map((value, perkIndex) => (
                perkIndex === index && selectedPerks[index] !== chosenPerk ? 0 : value
            )))
        })
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
                <div className='header-big'>Select an Item</div>
            </div>
        )
    }

    const selectedSet = itemObj.set !== undefined && itemObj.set !== null && itemObj.set !== -1
        ? setsRef?.find(set => set.id === itemObj.set)
        : null
    const maxMasterworkLevel = getMaxMasterworkLevel(selectedRarity)
    const itemMainStat = ({ 0: "attack", 1: "defence", 2: "agility" })[Number(itemObj.mainAttribute)]
    const getPerkSpriteName = name => {
        if (name === "MAIN_STAT_FLAT") return MAIN_STAT_PERK_KEYS[itemMainStat]?.flat ?? name
        if (name === "MAIN_STAT_PERCENT") return MAIN_STAT_PERK_KEYS[itemMainStat]?.percent ?? name
        return name
    }
    const availableMutationPerks = new Set([
        ...(itemObj.fixedPerks ?? []).map(perk => Object.keys(PERK_DEFINITIONS).find(key => PERK_DEFINITIONS[key].id === perk.id)),
        ...(selectedPerks ?? []).map(perk => String(perk ?? "NOTHING").toUpperCase().replace(/\s/g, "_"))
    ].filter(Boolean))

    // MAIN_STAT perks resolve to a specific stat for each item, so expose matching
    // mutation categories in the selector when the item has that main-stat perk.
    if (itemMainStat && availableMutationPerks.has("MAIN_STAT_FLAT")) {
        availableMutationPerks.add(MAIN_STAT_PERK_KEYS[itemMainStat]?.flat)
    }
    if (itemMainStat && availableMutationPerks.has("MAIN_STAT_PERCENT")) {
        availableMutationPerks.add(MAIN_STAT_PERK_KEYS[itemMainStat]?.percent)
    }

    return (
        <div ref={listRef} className='item-preview flex-col' style={{ maxHeight: listHeight }}>
            <div className='preview-top-row flex-row'><Button title={isFullWidth ? 'Show item list' : 'Expand preview to full width'} text={isFullWidth ? 'Show List' : 'Expand'} onClick={onToggleFullWidth} color={1} /></div>
            <div className='header-big'>{itemObj.name}</div>
            <div className='flex-col'>
                <div className='flex-row'>
                    <div className={"item card selected"} data-rarity={selectedRarity} data-type={itemObj.iconType}>
                        <div className="item-icon"><img src={itemObj.iconSrc} draggable={false} /></div>
                        <div className="flex-col">
                            <div className="item-sprite"><img className="item-sprite-img" src={itemObj.itemSrc} draggable={false} /></div>
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
                        text={"Rarity - 1"}
                        disabled={selectedRarity <= RARITY_DEFINITIONS.RARE.id}
                        onClick={() => changeRarity(selectedRarity - 1)}
                        color={1}
                    />
                    <div className='rarity-heading'>
                        <div className='header'>{getEnumNameById(RARITY_DEFINITIONS, selectedRarity)}</div>
                    </div>
                    <Button
                        text={"Rarity + 1"}
                        disabled={selectedRarity >= RARITY_DEFINITIONS.ANCIENT.id}
                        onClick={() => changeRarity(selectedRarity + 1)}
                        color={1}
                    />
                </div>

                <div className='card flex-col masterwork-control'>
                    <div className='masterwork-heading'>
                        <div className='header'>Masterwork - Level {selectedMasterworkLevel} / {maxMasterworkLevel}</div>
                    </div>
                    <div className='flex-row masterwork-input-row'>
                    <Button text={"Masterwork - 1"} disabled={selectedMasterworkLevel <= 0} onClick={() => setSelectedMasterworkLevel(Math.max(0, Math.min(maxMasterworkLevel, Math.trunc(Number(selectedMasterworkLevel - 1)))))} color={1} />
                        <input
                            aria-label='Masterwork level'
                            type='number'
                            min='0'
                            max={maxMasterworkLevel}
                            step='1'
                            value={selectedMasterworkLevel}
                            onChange={event => {
                                const value = event.target.value
                                if (value === '') {
                                    setSelectedMasterworkLevel(0)
                                    return
                                }
                                setSelectedMasterworkLevel(Math.max(0, Math.min(maxMasterworkLevel, Math.trunc(Number(value) || 0))))
                            }}
                        />
                    <Button text={"Masterwork + 1"} disabled={selectedMasterworkLevel >= maxMasterworkLevel} onClick={() => setSelectedMasterworkLevel(Math.max(0, Math.min(maxMasterworkLevel, Math.trunc(Number(selectedMasterworkLevel + 1)))))} color={1} />
                    </div>
                    <div className='text masterwork-summary'>
                        All item perk values: +{selectedMasterworkLevel * 10}% ({(1 + selectedMasterworkLevel / 10).toFixed(1)}×)
                    </div>
                    <label className='flex-row masterwork-damaged-toggle'>
                        <input
                            type='checkbox'
                            checked={selectedItemDamaged}
                            onChange={event => setSelectedItemDamaged(event.target.checked)}
                        />
                        <div className='text'>Damaged item (locks perk changes)</div>
                    </label>
                    <div className='card flex-col masterwork-mutation-controls'>
                    <div className='header'>Masterwork Mutations</div>
                    {[5, 10].map(milestone => (
                        <div className='flex-col masterwork-mutation-select' key={milestone}>
                            <span className='text'>Level {milestone} mutation</span>
                            <select className='text'
                                value={selectedMutations[milestone] ? `${selectedMutations[milestone].perkKey}:${selectedMutations[milestone].id}` : ""}
                                disabled={selectedMasterworkLevel < milestone || maxMasterworkLevel < milestone}
                                onChange={event => {
                                    const [perkKey, id] = event.target.value.split(":")
                                    setSelectedMutations(previous => ({ ...previous, [milestone]: event.target.value ? { perkKey, id: Number(id) } : null }))
                                }}
                            >
                                <option value="">No mutation</option>
                                {Object.entries(MASTERWORK_MUTATION_DEFINITIONS)
                                    .filter(([perkKey]) => availableMutationPerks.has(perkKey) || (perkKey === "HEAL_RECOVERY" && availableMutationPerks.has("HEALING_RECEIVED")))
                                    .flatMap(([perkKey, mutations]) => mutations.map(mutation => (
                                        <option key={`${perkKey}:${mutation.id}`} value={`${perkKey}:${mutation.id}`}>
                                            {`${perkKey.replace(/_/g, " ")} — ${mutation.name}`}
                                        </option>
                                    )))}
                            </select>
                        </div>
                    ))}
                    <small className='text'>Conditional mutations contribute to MAX; permanent mutations affect the calculated value.</small>
                </div>

                <div className='flex-row masterwork-milestones'>
                        <div className={selectedMasterworkLevel >= 5 ? 'masterwork-milestone unlocked' : 'masterwork-milestone'}>
                            <div className='header'>Level 5</div>
                            <div className='text'>{maxMasterworkLevel < 5 ? 'Unavailable at this rarity' : selectedMasterworkLevel >= 5 ? 'Perk mutation unlocked' : 'Perk mutation at 5'}</div>
                        </div>
                        <div className={selectedMasterworkLevel >= 10 ? 'masterwork-milestone unlocked' : 'masterwork-milestone'}>
                            <div className='header'>Level 10</div>
                            <div className='text'>{maxMasterworkLevel < 10 ? 'Unavailable at this rarity' : selectedMasterworkLevel >= 10 ? 'Perk mutation unlocked' : 'Perk mutation at 10'}</div>
                        </div>
                    </div>
                </div>

                {itemObj.unique && itemObj.unique !== 0 && itemObj.unique.description && <div className='card'>
                    <div className='text flex-col'>
                        <div className='flex-row'>
                            <img src={iconSprites["unique"]} />
                            <div className='header'>Weapon Effect</div>
                            <img src={iconSprites["unique"]} />
                        </div>
                        {(() => {
                            const effect = getUniqueEffectDisplay(itemObj.unique, selectedRarity)
                            const displayedValue = (((effect.value ?? 1) - 1) * 100).toFixed(2) + "%"
                            const [descriptionBefore, descriptionAfter = ""] = itemObj.unique.description.split("$e")
                            return <span className='text'>
                                {descriptionBefore}
                                {displayedValue}
                                {effect.usesHighestAvailableValue && <span title="No value is defined for this rarity yet; showing the highest available value."> (?)</span>}
                                {descriptionAfter}
                            </span>
                        })()}
                    </div>
                </div>}

                {itemObj.fixedPerks?.length > 0 && <>
                    <div className='header'>Fixed Item Perks</div>
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
                    <div className='header'>Set Bonus</div>
                    {selectedSet.setBonus.map((bonus, index) => (
                        <ItemPerk
                            key={"setperk_" + bonus.id + "_" + index}
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
                    ))}
                </>}

                <div className='header'>Perks</div>
                {selectedPerks.length === 0
                    ? <div>No perks available</div>
                    : selectedPerks.map((perk, index) => (
                        <ItemPerk
                            key={"perk_" + index}
                            name={(perk || "NOTHING").toUpperCase().replace(/\s/g, '_')}
                            spriteName={getPerkSpriteName((perk || "NOTHING").toUpperCase().replace(/\s/g, '_'))}
                            value={selectedPerkValues[index] ?? 0}
                            multiplier={1 + selectedMasterworkLevel / 10}
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

                {(saveItem || onEquipItem || deleteSavedItem || (onExportItem && deleteSavedItem)) && <div className='flex-row'>
                    {saveItem && <Button text={"Save Item"} onClick={handleSaveItem} color={"confirm"} />}
                    {onEquipItem && <Button text={"Equip Item"} onClick={handleEquipItem} color={1} />}
                    {onExportItem && deleteSavedItem && <Button text={"Export Item"} onClick={() => onExportItem(getConfiguredItem())} color={1} />}
                    {deleteSavedItem && <Button text={"Delete Saved Item"} onClick={handleDeleteSavedItem} color={"cancel"} />}
                </div>}
            </div>
        </div>
    )
}

export default ItemPreview
