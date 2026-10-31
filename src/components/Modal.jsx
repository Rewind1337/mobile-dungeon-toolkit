import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../css/modal.scss';
import Button from './Button';

const openModals = []
let modalEscapeHandler = null

function Modal({ isVisible, onClose, position = 'left', hasCloseButton, children }) {
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose
    const modalEntryRef = useRef(null)
    if (!modalEntryRef.current) modalEntryRef.current = { close: null }

    useEffect(() => {
        if (!isVisible) return undefined
        const entry = modalEntryRef.current
        entry.close = () => onCloseRef.current?.()
        openModals.push(entry)

        if (!modalEscapeHandler) {
            modalEscapeHandler = event => {
                if (event.key !== 'Escape' || openModals.length === 0) return
                event.preventDefault()
                event.stopPropagation()
                event.stopImmediatePropagation()
                ;[...openModals].reverse().forEach(modal => modal.close?.())
            }
            document.addEventListener('keydown', modalEscapeHandler, true)
        }

        return () => {
            const index = openModals.lastIndexOf(entry)
            if (index !== -1) openModals.splice(index, 1)
            if (openModals.length === 0 && modalEscapeHandler) {
                document.removeEventListener('keydown', modalEscapeHandler, true)
                modalEscapeHandler = null
            }
        }
    }, [isVisible])

    if (!isVisible) return null

    return createPortal(
        <>
            <div className="modal modal-backdrop visible" onClick={event => {
                event.stopPropagation()
                onClose?.()
            }} />
            <div className={`modal modal-${position} card visible`}>
                {children}
                {hasCloseButton && (
                    <div className="modal-footer visible">
                        <Button className="w-25" text="Close" color="cancel" onClick={() => onClose?.()} />
                    </div>
                )}
            </div>
        </>,
        document.body
    )
}

export default Modal
