import { memo, useState } from 'react'
import Button from './Button.jsx'

function TextCard({ text, prefix, suffix, title, onClick, className, children }) {
    return (
        <div className={'text-card flex-col ' + className} title={title}>
            <div className='flex-row w-100'>
                {prefix && <div className='text'>{prefix}</div>}
                <div className='text flex-grow'>{text}</div>
                {suffix && <div className='text'>{suffix}</div>}
            </div>
            {children}
        </div>
    )
}

export default TextCard