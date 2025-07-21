import { useLayoutEffect, useRef, useState } from 'react'

import '../css/item.scss'
import Item from './Item'
import Button from './Button'
import ItemPerk from './ItemPerk'
import { formatNumber } from '../js/util'
import { CONSTANTS } from '../database/constants.jsx'
import { iconSprites } from '../database/db_sprites.jsx'

function ItemPreview({ itemsRef, selectedItemId, onPerkClick, saveItem, setSelectedPerkSlot, setsRef, itemPerks }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
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

    const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS" }
    let itemObj = null
    if (selectedItemId.slot !== null && slotIndexToNameMap[selectedItemId.slot]) {
        itemObj = itemsRef[slotIndexToNameMap[selectedItemId.slot]]?.[selectedItemId.id]
    }

    let noSelection = false
    if (selectedItemId.slot === null || selectedItemId.id === null) {
        noSelection = true
    }

    if (noSelection) {
        return (
            <div className='item-preview'>
                <div className='header-big'>Select an Item</div>
            </div>
        )
    } else {
        return (
            <div ref={listRef} className='item-preview' style={{ maxHeight: listHeight }}>
                <div className='header-big'>{itemObj.name}</div>
                <div className='flex-col'>
                    <div className='flex-row'>
                        <div className={"item card selected"} data-rarity={itemObj.rarity} data-type={itemObj.iconType} onClick={() => { onClick() }}>
                            <div className="item-icon"><img src={itemObj.iconSrc} draggable={false} /></div>
                            <div className="flex-col">
                                <div className="item-sprite"><img className="item-sprite" src={itemObj.itemSrc} draggable={false} /></div>
                                <div className="text">1</div>
                            </div>
                        </div>
                    </div>
                    <div className='text'></div>
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

                    <div className='header'>Item Attributes</div>
                    {itemObj.set !== null && itemObj.attribute.length > 0 && itemObj.attribute.map(attr =>
                        <ItemPerk
                            key={"setperk_" + attr.id}
                            name={attr.name.toUpperCase().replace(/\s/g, '_') || "NOTHING"}
                            value={(Math.random() * 10).toFixed(2) + "%"}
                        />
                    )}

                    <div className='header'>Set Bonus</div>
                    {itemObj.set && setsRef[itemObj.set].setBonus.map(bonus =>
                        <ItemPerk
                            key={"perk_" + bonus}
                            name={bonus.name.toUpperCase().replace(/\s/g, '_') || "NOTHING"}
                            value={(Math.random() * 10).toFixed(2) + "%"}
                        />
                    )}

                    <div className='header'>Perks</div>
                    {(itemPerks && itemPerks.length > 0)
                        ? itemPerks.map((perk, index) => (
                            <ItemPerk
                                key={"perk_" + index}
                                name={perk.toUpperCase().replace(/\s/g, '_') || "NOTHING"}
                                value={(Math.random() * 10).toFixed(2) + "%"}
                                perkSlot={index + 1}
                                onClick={() => { setSelectedPerkSlot(index); onPerkClick() }}
                            />
                        ))
                        : <div>No perks available</div>
                    }
                    <div className='flex-row'>
                        <Button text={"Save Item"} onClick={() => { saveItem(itemObj) }} color={0} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ItemPreview