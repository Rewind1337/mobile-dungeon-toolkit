import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { CONSTANTS } from '../database/constants.jsx'
import { PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById, getItemPerkCount } from '../database/enums.jsx'
import { iconSprites } from '../database/db_sprites.jsx'

import Button from './Button.jsx'
import ItemPerk from './ItemPerk.jsx'

import '../css/item.scss'

function ItemPreview({ itemsRef, selectedItemId, onPerkClick, saveItem, setsRef }) {
    const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS" }
    const [itemObj, setItemObj] = useState(null)
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const [selectedRarity, setSelectedRarity] = useState(null)
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [selectedPerks, setSelectedPerks] = useState([])
    const [selectedPerkValues, setSelectedPerkValues] = useState([])
    const [fixedPerkValues, setFixedPerkValues] = useState([])

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

    const hasSetBonusOrUniqueEffect = (item) => (
        (item?.unique !== undefined && item?.unique !== null && item.unique !== 0) ||
        (item?.set !== undefined && item?.set !== null && item.set >= 0)
    )

    const getPerkKey = (perk) => Object.keys(PERK_DEFINITIONS).find(key => PERK_DEFINITIONS[key].id === perk.id) ?? "NOTHING"

    const makePerkSlots = (item, rarity) => {
        const count = getItemPerkCount(rarity, hasSetBonusOrUniqueEffect(item))
        const existingPerks = Array.isArray(item?.perks) ? item.perks : []
        const existingValues = Array.isArray(item?.perkValues) ? item.perkValues : []
        return {
            perks: Array.from({ length: count }, (_, index) => existingPerks[index] || "NOTHING"),
            values: Array.from({ length: count }, (_, index) => Number(existingValues[index] ?? 0))
        }
    }

    useEffect(() => {
        if (selectedItemId.slot === null || selectedItemId.id === null) {
            setItemObj(null)
            return
        }

        const slotName = slotIndexToNameMap[selectedItemId.slot]
        const selectedItem = slotName ? itemsRef[slotName]?.[selectedItemId.id] : null
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
        setSelectedPerks(perkSlots.perks)
        setSelectedPerkValues(perkSlots.values)
        setFixedPerkValues((selectedItem.fixedPerks ?? []).map(perk => Number(perk.value ?? 0)))
    }, [selectedItemId, itemsRef])

    const changeRarity = (nextRarity) => {
        if (!itemObj) return
        const minimumRarity = RARITY_DEFINITIONS.RARE.id
        const rarity = Math.max(minimumRarity, Math.min(8, Number(nextRarity) || minimumRarity))
        const perkSlots = makePerkSlots({ ...itemObj, perks: selectedPerks, perkValues: selectedPerkValues }, rarity)
        setSelectedRarity(rarity)
        setSelectedPerks(perkSlots.perks)
        setSelectedPerkValues(perkSlots.values)
    }

    const handlePerkSelect = (index) => {
        if (!onPerkClick) return
        onPerkClick(itemObj, (chosenPerk) => {
            setSelectedPerks(previous => previous.map((perk, perkIndex) => perkIndex === index ? chosenPerk : perk))
            setSelectedPerkValues(previous => previous.map((value, perkIndex) => (
                perkIndex === index && selectedPerks[index] !== chosenPerk ? 0 : value
            )))
        })
    }

    const handleSaveItem = () => {
        if (!itemObj || !saveItem) return
        const minimumRarity = RARITY_DEFINITIONS.RARE.id
        const rarity = Math.max(minimumRarity, Math.min(8, Number(selectedRarity) || minimumRarity))
        saveItem({
            ...itemObj,
            level: Math.max(1, Number(selectedLevel) || 1),
            rarity,
            fixedPerks: (itemObj.fixedPerks ?? []).map((perk, index) => ({
                ...perk,
                value: Number(fixedPerkValues[index] ?? 0)
            })),
            perks: [...selectedPerks],
            perkValues: selectedPerkValues.map(value => Number(value) || 0)
        })
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

    const selectedSet = itemObj.set !== undefined && itemObj.set !== null && itemObj.set >= 0
        ? setsRef?.[itemObj.set]
        : null

    return (
        <div ref={listRef} className='item-preview flex-col' style={{ maxHeight: listHeight }}>
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

                <div className='card flex-row'>
                    <Button text={"Rarity Down"} onClick={() => changeRarity(selectedRarity - 1)} color={0} />
                    <div className='header'>{getEnumNameById(RARITY_DEFINITIONS, selectedRarity)}</div>
                    <Button text={"Rarity Up"} onClick={() => changeRarity(selectedRarity + 1)} color={0} />
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
                            return <>
                                {itemObj.unique.description.replace("$e", displayedValue)}
                                {effect.usesHighestAvailableValue && <span title="No value is defined for this rarity yet; showing the highest available value."> (?)</span>}
                            </>
                        })()}
                    </div>
                </div>}

                {itemObj.fixedPerks?.length > 0 && <>
                    <div className='header'>Fixed Item Perks</div>
                    {itemObj.fixedPerks.map((perk, index) => (
                        <ItemPerk
                            key={"fixedperk_" + perk.id}
                            name={getPerkKey(perk)}
                            value={fixedPerkValues[index] ?? 0}
                            editable={true}
                            onValueChange={value => setFixedPerkValues(previous => previous.map((oldValue, perkIndex) => (
                                perkIndex === index ? value : oldValue
                            )))}
                        />
                    ))}
                </>}

                {selectedSet?.setBonus && <>
                    <div className='header'>Set Bonus</div>
                    {selectedSet.setBonus.map(bonus => (
                        <ItemPerk
                            key={"setperk_" + bonus.id}
                            name={getPerkKey(bonus)}
                            noValue={true}
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
                            value={selectedPerkValues[index] ?? 0}
                            perkSlot={index + 1}
                            editable={true}
                            onValueChange={value => setSelectedPerkValues(previous => previous.map((oldValue, perkIndex) => (
                                perkIndex === index ? value : oldValue
                            )))}
                            onClick={() => handlePerkSelect(index)}
                        />
                    ))
                }

                {saveItem && <div className='flex-row'>
                    <Button text={"Save Item"} onClick={handleSaveItem} color={0} />
                </div>}
            </div>
        </div>
    )
}

export default ItemPreview
