import { useState } from 'react'

import '../css/button.scss'

function Button({ prefix = "", text, suffix = "", imgAsText, color, round, skillButton, slim, disabled = false, fillPercent = 1, onMouseDown = () => { }, onMouseUp = () => { }, onClick = () => { } }) {
    const [pressed, setPressed] = useState(0)

    const _onMouseDown = () => {
        if (!disabled) {
            setPressed(1)
            onMouseDown()
        }
    }

    const _onMouseUp = () => {
        if (!disabled) {
            setPressed(0)
            onMouseUp()
        }
    }

    const _onClick = () => {
        if (!disabled) {
            setPressed(1)
            onMouseDown()
            onClick();
            setPressed(0)
            onMouseUp()
        }
    }

    return (
        <button className={"" + (pressed ? ' pressed' : '') + (skillButton ? ' skill' : '') + (disabled ? ' disabled' : '') + (round ? ' round' : '') + (slim ? ' slim' : '') + (imgAsText ? ' imgOnly' : '')} disabled={disabled} data-color={color} style={{ "--data-percent": (fillPercent * 100) + "%" }} onMouseDown={_onMouseDown} onMouseUp={_onMouseUp} onClick={_onClick} onMouseLeave={_onMouseUp}>
            {prefix != "" ? <span className="icon-left">{prefix}</span> : <>&nbsp;</>}
            {imgAsText === true ? <img src={text} draggable={false}></img> : <span className="text">{text}</span>}
            {suffix != "" ? <span className="icon-right">{suffix}</span> : <>&nbsp;</>}
        </button>
    )
}

export default Button