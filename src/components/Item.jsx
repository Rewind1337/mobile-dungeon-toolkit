import { memo, useState } from 'react'
import Button from './Button.jsx'

function Item({ itemObj, selected, level, onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <div className={"item card" + (hover ? " hover" : "") + (selected ? " selected" : "")} data-rarity={itemObj.rarity} data-type={itemObj.iconType} onMouseEnter={() => { setHover(1) }} onMouseLeave={() => { setHover(0) }} onClick={() => { onClick() }}>
            <div className="item-icon"><img src={itemObj.iconSrc} draggable={false} /></div>
            <div className="flex-col">
                <div className="item-sprite"><img className="item-sprite" draggable={false} src={itemObj.itemSrc} /></div>
                {level !== null && <div className="text">{level}</div>}
            </div>
        </div>
    )
}

export default memo(Item)