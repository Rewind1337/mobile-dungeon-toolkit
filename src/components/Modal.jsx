import React from 'react';
import '../css/modal.scss'; // Assuming you have or will create a modal-specific stylesheet

function Modal({ isVisible, onClose, position = 'left', children }) {
    return (
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
            </div>
        </>
    );
}

export default Modal;