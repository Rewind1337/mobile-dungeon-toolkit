import { memo, useState } from 'react'
import Button from './Button.jsx'

function TextCard({ text, prefix, suffix, title, onClick }) {
    return (
        <div className='text-card flex-row' title={title}>
            {prefix && <div className='text'>{prefix}</div>}
            <div className='text'>{text}</div>
            {suffix && <div className='text'>{suffix}</div>}
        </div>
    )
}

export default TextCard