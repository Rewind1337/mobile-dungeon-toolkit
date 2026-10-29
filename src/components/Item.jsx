import { memo, useState } from 'react'

function Item({ itemObj, selected, level, onClick, loading = 'lazy' }) {
    const [hover, setHover] = useState(false);
    return (
        <div className={"item card" + (hover ? " hover" : "") + (selected ? " selected" : "")} data-rarity={itemObj.rarity} data-type={itemObj.iconType} onMouseEnter={() => { setHover(1) }} onMouseLeave={() => { setHover(0) }} title={itemObj.name} onClick={onClick}>
            <div className="item-icon"><img src={itemObj.iconSrc} loading={loading} decoding="async" draggable={false} alt="" /></div>
            <div className="flex-col">
                <div className="item-sprite"><img className="item-sprite-img" draggable={false} src={itemObj.itemSrc} loading={loading} decoding="async" alt="" /></div>
                {level !== null && <div className="text">{level}</div>}
            </div>
        </div>
    )
}

export default memo(Item)