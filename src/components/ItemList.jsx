import { memo, useLayoutEffect, useRef, useState } from 'react'

import '../css/item.scss'

import Item from './Item.jsx'
import Button from './Button.jsx'
import { attributeSprites, iconSprites, raritySprites } from '../database/db_sprites.jsx'
import { ATTRIBUTE } from '../database/enums.jsx'
import { useDraggable } from 'react-use-draggable-scroll'

function ItemList({ extraHeight = 0, savedItems, headerText, itemsRef, itemType = null, setSelectedItemId }) {
    const itemTypeToNameMap = ["WEAPONS", "HELMETS", "ARMORS", "RINGS", "NECKLACES", "OTHER"]
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const { events } = useDraggable(listRef);

    function onResize() {
        let newHeight = 0;
        if (window.matchMedia("(max-width: 900px)").matches === true) {
            newHeight = window.innerHeight - ((137 + listRef.current.offsetTop) - extraHeight)
        } else {
            newHeight = window.innerHeight - ((177 + listRef.current.offsetTop) - extraHeight)
        }
        setListHeight(newHeight)
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (<>
        <div className='header-big'>{headerText}</div>
        <div className='filters flex-row card'>
            <Button round text={attributeSprites[ATTRIBUTE.NONE]} />
            <Button round imgAsText text={iconSprites["twoset"]} />
            <Button round imgAsText text={iconSprites["fourset"]} />
            <Button round imgAsText text={iconSprites["unique"]} />
            <Button round imgAsText text={iconSprites["weapons"]} />
            <Button round imgAsText text={iconSprites["helmets"]} />
            <Button round imgAsText text={iconSprites["armors"]} />
            <Button round imgAsText text={iconSprites["rings"]} />
            <Button round imgAsText text={iconSprites["necklaces"]} />
            <Button round text={attributeSprites[ATTRIBUTE.STRENGTH]} />
            <Button round text={attributeSprites[ATTRIBUTE.DEXTERITY]} />
            <Button round text={attributeSprites[ATTRIBUTE.INTELLIGENCE]} />
            <Button round text={raritySprites[0]} />
            <Button round text={raritySprites[1]} />
            <Button round text={raritySprites[2]} />
            <Button round text={raritySprites[3]} />
            <Button round text={raritySprites[4]} />
            <Button round text={raritySprites[5]} />
        </div>
        <div className='list item-list flex-row' ref={listRef} {...events} style={{ maxHeight: listHeight }}>
            {itemType !== null && itemsRef[itemTypeToNameMap[itemType]].map(itemObj =>
                <Item itemObj={itemObj} key={itemObj.id} level={1} onClick={() => { setSelectedItemId({ slot: itemObj.slot, id: (savedItems ? itemObj.saveId : itemObj.id) }) }} />
            )}
            {itemType === null && <>
                {itemsRef.WEAPONS.map(itemObj =>
                    <Item itemObj={itemObj} key={itemObj.id} level={1} onClick={() => { setSelectedItemId({ slot: itemObj.slot, id: (savedItems ? itemObj.saveId : itemObj.id) }) }} />
                )}
                {itemsRef.HELMETS.map(itemObj =>
                    <Item itemObj={itemObj} key={1000 + itemObj.id} level={1} onClick={() => { setSelectedItemId({ slot: itemObj.slot, id: (savedItems ? itemObj.saveId : itemObj.id) }) }} />
                )}
                {itemsRef.ARMORS.map(itemObj =>
                    <Item itemObj={itemObj} key={2000 + itemObj.id} level={1} onClick={() => { setSelectedItemId({ slot: itemObj.slot, id: (savedItems ? itemObj.saveId : itemObj.id) }) }} />
                )}
                {itemsRef.NECKLACES.map(itemObj =>
                    <Item itemObj={itemObj} key={3000 + itemObj.id} level={1} onClick={() => { setSelectedItemId({ slot: itemObj.slot, id: (savedItems ? itemObj.saveId : itemObj.id) }) }} />
                )}
                {itemsRef.RINGS.map(itemObj =>
                    <Item itemObj={itemObj} key={4000 + itemObj.id} level={1} onClick={() => { setSelectedItemId({ slot: itemObj.slot, id: (savedItems ? itemObj.saveId : itemObj.id) }) }} />
                )}
            </>}

        </div>
    </>
    )
}

export default memo(ItemList)