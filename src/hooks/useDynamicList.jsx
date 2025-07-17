import { useState, useRef, useLayoutEffect } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import { CONSTANTS } from '../database/constants';

export function useDynamicList(setForceUpdate = () => { }, extraHeight = 0, enableDraggable = true) {
    const [listHeight, setListHeight] = useState(500);
    const listRef = useRef(null);
    const { events } = useDraggable(listRef, { applyRubberBandEffect: false, active: enableDraggable && !!listRef.current });

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
        if (window.matchMedia('(max-width: 900px)').matches) {
            newHeight = window.innerHeight - (CONSTANTS.listHeightMobile + (listRef.current?.offsetTop || 0)) + extraHeight;
        } else {
            newHeight = window.innerHeight - (CONSTANTS.listHeightDefault + (listRef.current?.offsetTop || 0)) + extraHeight;
        }
        setForceUpdate({});
        setListHeight(newHeight);
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, [extraHeight, setForceUpdate]);

    return { listHeight, listRef, events: enableDraggable ? events : {} };
}