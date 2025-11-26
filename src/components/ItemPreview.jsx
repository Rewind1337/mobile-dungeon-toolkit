import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { formatNumber } from '../js/util.jsx'
import { CONSTANTS } from '../database/constants.jsx'
import { RARITY, RARITY_NAME_MAP } from '../database/enums.jsx'
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
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [minRarity, setMinRarity] = useState(null) // unused at the moment
    const selectedPerks = useRef()
    const [selectedPerkValues, setSelectedPerkValues] = useState([0])

    const handlePerkSelect = (perk, index) => {
        console.log(perk, index)
        selectedPerks.current[index] = perk;
        onPerkClick();
    }

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
        if (window.matchMedia("(max-width: 900px)").matches === true) {
            newHeight = window.innerHeight - CONSTANTS.listHeightDefault + 77;
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
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (selectedItemId.slot !== null && slotIndexToNameMap[selectedItemId.slot]) {
            let _itemObj = itemsRef[slotIndexToNameMap[selectedItemId.slot]]?.[selectedItemId.id]
            console.log(_itemObj)
            let _rarity = _itemObj.rarity
            let _minRarity = _itemObj.rarity
            setItemObj(_itemObj)
            setSelectedRarity(_rarity)
            setMinRarity(_minRarity) // unused for now
            setSelectedLevel(Number(_itemObj.level) || 1)
        }
    }, [selectedItemId])

    useEffect(() => {
        if (itemObj) {
            let numPerks = Math.min(Math.max(0, selectedRarity - 1), 3)
            if (selectedRarity >= 1) {
                numPerks += ((itemObj.unique === 0 || itemObj.set === -1) ? 1 : 0)
            }
            let perks = Array(numPerks).fill("NOTHING")
            for (let i = 0; i < selectedPerks.length; i++) {
                if (selectedPerks[i] !== "NOTHING")
                    perks[i] = selectedPerks[i]
            }
            selectedPerks.current = perks;
            setSelectedPerkValues(Array(perks.length).fill(0))
        }
    }, [selectedRarity])

    let noSelection = false
    if (selectedItemId.slot === null || selectedItemId.id === null) {
        noSelection = true
    }

    if (noSelection || itemObj === null) {
        return (
            <div className='item-preview'>
                <div className='header-big'>Select an Item</div>
            </div>
        )
    } else {
        return (
            <div ref={listRef} className='item-preview flex-col' style={{ maxHeight: listHeight }}>
                <div className='header-big'>{itemObj.name}</div>
                <div className='flex-col'>
                    <div className='flex-row'>
                        <div className={"item card selected"} data-rarity={selectedRarity} data-type={itemObj.iconType} onClick={() => { onClick() }}>
                            <div className="item-icon"><img src={itemObj.iconSrc} draggable={false} /></div>
                            <div className="flex-col">
                                <div className="item-sprite"><img className="item-sprite" src={itemObj.itemSrc} draggable={false} /></div>
                                <div className="text">
                                    <input type='number' className='text' value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card flex-row'>
                        <Button text={"Rarity Down"} onClick={() => { setSelectedRarity(r => Math.max(0, r -= 1)) }} color={0} />
                        <div className='header'>{RARITY_NAME_MAP[selectedRarity]}</div>
                        <Button text={"Rarity Up"} onClick={() => { setSelectedRarity(r => Math.min(5, r += 1)) }} color={0} />
                    </div>

                    {itemObj.unique && <div className='card'>
                        <div className='text flex-col'>
                            <div className='flex-row'>
                                <img src={iconSprites["unique"]} />
                                <div className='header'>Weapon Effect</div>
                                <img src={iconSprites["unique"]} />
                            </div>
                            {itemObj.unique.description.replace("$e", ((itemObj.unique.rarityEffect[itemObj.rarity] - 1) * 100).toFixed(2) + "%")}
                        </div>
                    </div>}

                    {itemObj.set !== null && itemObj.attribute.length > 0 && <>
                        <div className='header'>Item Attributes</div>
                        {itemObj.attribute.map(attr =>
                            <ItemPerk
                                key={"setperk_" + attr.id}
                                name={attr.name.toUpperCase().replace(/\s/g, '_') || "NOTHING"}
                                value={(Math.random() * 10).toFixed(2)}
                                editable={true}
                            />
                        )}
                    </>}

                    {itemObj.set && <>
                        <div className='header'>Set Bonus</div>
                        {setsRef[itemObj.set].setBonus.map(bonus =>
                            <ItemPerk
                                key={"perk_" + bonus}
                                name={bonus.name.toUpperCase().replace(/\s/g, '_') || "NOTHING"}
                                value={(Math.random() * 10).toFixed(2)}
                                editable={true}
                            />
                        )}
                    </>}
                    {selectedPerks.current && <>
                        <div className='header'>Perks</div>
                        {selectedPerks.current.length === 0 && <>
                            <div>No perks available</div>
                        </>}
                        {selectedPerks.current.length >= 0 && <>
                            {selectedPerks.current.map((perk, index) => (
                                <ItemPerk
                                    key={"perk_" + index}
                                    name={perk.toUpperCase().replace(/\s/g, '_') || "NOTHING"}
                                    value={selectedPerkValues[index]}
                                    perkSlot={index + 1}
                                    editable={true}
                                    onClick={() => { handlePerkSelect(perk, index) }}
                                />
                            ))}
                        </>}
                    </>}

                    {saveItem &&
                        <div className='flex-row'>
                            <Button text={"Save Item"} onClick={() => { saveItem(itemObj) }} color={0} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ItemPreview