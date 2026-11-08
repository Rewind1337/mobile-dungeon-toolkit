import { useLayoutEffect, useState } from "react"
import { CONSTANTS } from "../database/constants.jsx"
import { getPreviewListHeight } from "../js/previewUtils.js"

/** Keep preview list height in sync with the viewport and the list's position. */
export function usePreviewListHeight(listRef, initialHeight = 500) {
    const [listHeight, setListHeight] = useState(initialHeight)

    useLayoutEffect(() => {
        const updateHeight = () => {
            const isMobile = window.matchMedia("(max-width: 900px)").matches
            setListHeight(getPreviewListHeight(listRef.current, window.innerHeight, isMobile, CONSTANTS))
        }

        window.addEventListener("resize", updateHeight)
        updateHeight()
        return () => window.removeEventListener("resize", updateHeight)
    }, [listRef])

    return listHeight
}
