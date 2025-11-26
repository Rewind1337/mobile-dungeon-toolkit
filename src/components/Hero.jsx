import { memo, useState } from 'react'
import { iconSprites } from '../database/db_sprites.jsx';
import Button from './Button.jsx'

function Hero({ heroObj, selected, level, onClick }) {
    const [hover, setHover] = useState(false);
    console.log(heroObj)
    return (
        <div className={"hero card" + (hover ? " hover" : "") + (selected ? " selected" : "")} data-rarity={heroObj.rarity} data-element={heroObj.element} onMouseEnter={() => { setHover(1) }} onMouseLeave={() => { setHover(0) }} onClick={() => { onClick() }}>
            <div className="hero-element"><img src={heroObj.elementSrc} draggable={false} /></div>
            {heroObj.isStarred === true && <div className="hero-starred">
                <img src={iconSprites["is_starred"]} draggable={false} />
            </div>}
            <div className="flex-col">
                <div className="hero-sprite"><img className="hero-sprite" draggable={false} src={heroObj.heroSrc} /></div>
                {level !== null && <div className="text">{level}</div>}
            </div>
        </div>
    )
}

export default memo(Hero)