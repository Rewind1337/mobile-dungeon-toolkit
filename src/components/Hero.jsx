import { memo, useState } from 'react'
import Button from './Button.jsx'

function Hero({ heroObj, selected, level, onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <div className={"hero card" + (hover ? " hover" : "") + (selected ? " selected" : "")} data-rarity={heroObj.rarity} data-element={heroObj.element} onMouseEnter={() => { setHover(1) }} onMouseLeave={() => { setHover(0) }} onClick={() => { onClick() }}>
            <div className="hero-element"><img src={heroObj.elementSrc} draggable={false} /></div>
            <div className="flex-col">
                <div className="hero-sprite"><img className="hero-sprite" draggable={false} src={heroObj.heroSrc} /></div>
                <div className="text">{level}</div>
            </div>
        </div>
    )
}

export default memo(Hero)