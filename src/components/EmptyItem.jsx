import { memo, useState } from 'react'
import { itemSprites } from '../database/db_sprites.jsx';

function EmptyItem({ onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <div className={"item card" + (hover ? " hover" : "")} onMouseEnter={() => { setHover(1) }} onMouseLeave={() => { setHover(0) }} onClick={() => { onClick() }}>
            <div className="flex-col">
                <div className="item-sprite"><img className="item-sprite" src={itemSprites["null"]} draggable={false} /></div>
                <div className="text">?</div>
            </div>
        </div>
    )
}

export default memo(EmptyItem)