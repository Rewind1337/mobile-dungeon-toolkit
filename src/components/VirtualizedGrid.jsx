import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

/**
 * Virtualizes a responsive grid a row at a time. Measuring whole rows keeps
 * multi-column cards aligned while supporting cards with different heights.
 * scrollElementRef can point at the list itself or at a page-level scroll pane.
 */
function getVirtualItemKey(item, index) {
    const value = item?.saveId ?? item?.id ?? item?.key ?? item?.name ?? index
    return `${item?.slot ?? ""}-${value}`
}

function VirtualizedGrid({
    items = [],
    renderItem,
    scrollElementRef,
    className = "",
    rowClassName = "",
    minColumnWidth = 110,
    mobileMinColumnWidth = null,
    maxColumns = Infinity,
    columnGap = 10,
    rowGap = 10,
    estimatedRowHeight = 180,
    overscan = 2,
    alignItems = "start"
}) {
    const spacerRef = useRef(null)
    const [columns, setColumns] = useState(1)
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" && typeof window.matchMedia === "function"
            ? window.matchMedia("(max-width: 900px)").matches
            : false
    )
    const [scrollMargin, setScrollMargin] = useState(0)

    const itemSignature = useMemo(
        () => items.map((item, index) => String(getVirtualItemKey(item, index))).join("|"),
        [items]
    )

    useEffect(() => {
        if (mobileMinColumnWidth == null || typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return
        }

        const mediaQuery = window.matchMedia("(max-width: 900px)")
        const updateMobile = () => setIsMobile(mediaQuery.matches)
        updateMobile()

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", updateMobile)
            return () => mediaQuery.removeEventListener("change", updateMobile)
        }

        if (typeof mediaQuery.addListener === "function") {
            mediaQuery.addListener(updateMobile)
            return () => mediaQuery.removeListener(updateMobile)
        }
    }, [mobileMinColumnWidth])

    const activeMinColumnWidth = mobileMinColumnWidth != null && isMobile
        ? mobileMinColumnWidth
        : minColumnWidth

    const measureLayout = useCallback(() => {
        const spacer = spacerRef.current
        if (!spacer) return

        const width = spacer.clientWidth
        if (width > 0) {
            const nextColumns = Math.max(1, Math.min(
                maxColumns,
                Math.floor((width + columnGap) / (activeMinColumnWidth + columnGap))
            ))
            setColumns(current => current === nextColumns ? current : nextColumns)
        }

        const scrollElement = scrollElementRef?.current
        if (scrollElement) {
            const spacerRect = spacer.getBoundingClientRect()
            const scrollRect = scrollElement.getBoundingClientRect()
            const nextMargin = Math.max(
                0,
                spacerRect.top - scrollRect.top - scrollElement.clientTop + scrollElement.scrollTop
            )
            setScrollMargin(current => Math.abs(current - nextMargin) < 1 ? current : nextMargin)
        }
    }, [activeMinColumnWidth, columnGap, maxColumns, scrollElementRef])

    // Recalculate on parent renders too: expanding the filter controls above a
    // catalogue changes its scrollMargin even if the scroll pane itself stays
    // the same size.
    useLayoutEffect(() => {
        measureLayout()
    })

    useLayoutEffect(() => {
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureLayout)
        if (spacerRef.current) observer?.observe(spacerRef.current)
        if (scrollElementRef?.current && scrollElementRef.current !== spacerRef.current) {
            observer?.observe(scrollElementRef.current)
        }
        window.addEventListener("resize", measureLayout)
        return () => {
            observer?.disconnect()
            window.removeEventListener("resize", measureLayout)
        }
    }, [measureLayout, scrollElementRef])

    const rows = useMemo(() => {
        const result = []
        for (let index = 0; index < items.length; index += columns) {
            result.push(items.slice(index, index + columns))
        }
        return result
    }, [items, columns])

    const rowKeys = useMemo(
        () => rows.map((row, rowIndex) => row.map((item, index) =>
            String(getVirtualItemKey(item, rowIndex * columns + index))
        ).join("::")),
        [rows, columns]
    )

    const getRowKey = useCallback(index => rowKeys[index] ?? index, [rowKeys])

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollElementRef?.current ?? null,
        estimateSize: () => estimatedRowHeight,
        getItemKey: getRowKey,
        overscan,
        gap: rowGap,
        scrollMargin,
        useFlushSync: false
    })

    useLayoutEffect(() => {
        virtualizer.measure()
    }, [columns, itemSignature, virtualizer])

    useEffect(() => {
        if (scrollElementRef?.current) scrollElementRef.current.scrollTop = 0
        virtualizer.scrollToOffset(0)
    }, [itemSignature, scrollElementRef, virtualizer])

    return (
        <div
            ref={spacerRef}
            className={["virtualized-grid-spacer", className].filter(Boolean).join(" ")}
            style={{
                position: "relative",
                width: "100%",
                height: virtualizer.getTotalSize()
            }}
        >
            {virtualizer.getVirtualItems().map(virtualRow => (
                <div
                    key={virtualRow.key}
                    ref={virtualizer.measureElement}
                    data-index={virtualRow.index}
                    className={["virtualized-grid-row", rowClassName].filter(Boolean).join(" ")}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        columnGap: `${columnGap}px`,
                        alignItems
                    }}
                >
                    {rows[virtualRow.index].map((item, index) => (
                        <div className="virtualized-grid-cell" key={getVirtualItemKey(item, virtualRow.index * columns + index)}>
                            {renderItem(item, virtualRow.index * columns + index)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default VirtualizedGrid
