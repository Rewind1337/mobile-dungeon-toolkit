import React from 'react';
import { createPortal } from 'react-dom';
import '../css/modal.scss'; // Assuming you have or will create a modal-specific stylesheet
import Button from './Button';

function Modal({ isVisible, onClose, position = 'left', hasCloseButton,  children }) {
    if (!isVisible) return null;

    return createPortal(
        <>
            <div
                className={`modal modal-backdrop${isVisible ? ' visible' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className={`modal modal-${position} card${isVisible ? ' visible' : ''}`}
            >
                {children}
                {hasCloseButton && <div className={`modal-footer${isVisible ? ' visible' : ''}`}>
                    <Button className="w-25" text={"Close"} color={"cancel"} onClick={() => {onClose();}} />
                </div>}
            </div>
        </>,
        document.body
    );
}

export default Modal;