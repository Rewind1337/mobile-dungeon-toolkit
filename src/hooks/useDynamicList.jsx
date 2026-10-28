import { useState, useRef, useLayoutEffect } from 'react';
import { useDraggable } from 'react-use-draggable-scroll-safe';
import { CONSTANTS } from '../database/constants';

export function useDynamicList(extraHeight = 0, enableDraggable = true) {
    const [listHeight, setListHeight] = useState(500);
    const listRef = useRef(null);
    const { events } = useDraggable(listRef, { applyRubberBandEffect: false, active: enableDraggable});

    useLayoutEffect(() => {
        function onResize() {
            let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
            if (window.matchMedia('(max-width: 900px)').matches) {
                newHeight = window.innerHeight - (CONSTANTS.listHeightMobile + (listRef.current?.offsetTop || 0)) + extraHeight;
            } else {
                newHeight = window.innerHeight - (CONSTANTS.listHeightDefault + (listRef.current?.offsetTop || 0)) + extraHeight;
            }
            setListHeight(newHeight);
        }

        window.addEventListener('resize', onResize);
        onResize();

        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
        const list = listRef.current;
        if (list) {
            observer?.observe(list);
            if (list.parentElement) observer?.observe(list.parentElement);
            let sibling = list.previousElementSibling;
            while (sibling) {
                observer?.observe(sibling);
                sibling = sibling.previousElementSibling;
            }
        }

        return () => {
            window.removeEventListener('resize', onResize);
            observer?.disconnect();
        };
    }, [extraHeight]);

    return { listHeight, listRef, events: enableDraggable ? events : {} };
}