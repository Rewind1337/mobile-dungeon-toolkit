import { useLayoutEffect, useRef, useState } from 'react'

import '../css/item.scss'
import Item from './Item'
import Button from './Button'
import ItemPerk from './ItemPerk'
import { formatNumber } from '../js/util'

function ItemPreview({ itemsRef, selectedItemId, onPerkClick, saveItem }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)

    function onResize() {
        let newHeight = window.innerHeight - 182;
        if (listRef.current !== null) {
            if (window.matchMedia("(max-width: 900px)").matches === true) {
                newHeight = window.innerHeight - (137 + listRef.current.offsetTop)
            } else {
                newHeight = window.innerHeight - (177 + listRef.current.offsetTop)
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
                    <div className={"item card selected"} data-rarity={itemObj.rarity} data-type={itemObj.iconType} onClick={() => { onClick() }}>
                        <div className="item-icon"><img src={itemObj.iconSrc} draggable={false} /></div>
                        <div className="flex-col">
                            <div className="item-sprite"><img className="item-sprite" src={itemObj.itemSrc} draggable={false} /></div>
                            <div className="text">1</div>
                        </div>
                    </div>
                    <ItemPerk name={"ATTACK_PERCENT"} value={"7.2%"} onClick={onPerkClick} />
                    <ItemPerk name={"ATTACK_PERCENT"} value={"7.2%"} onClick={onPerkClick} />
                    <ItemPerk name={"ATTACK_PERCENT"} value={"7.2%"} onClick={onPerkClick} />
                    <div className='flex-row'>
                        <Button text={"Save Item"} onClick={() => { saveItem(itemObj) }} color={0} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ItemPreview