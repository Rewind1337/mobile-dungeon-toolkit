import { useLayoutEffect, useMemo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

function getItemKey(item, index) {
    const value = item?.id ?? item?.saveId ?? item?.key ?? item?.name ?? index
    return String(value)
}

function VirtualizedHorizontalList({
    items = [],
    renderItem,
    scrollElementRef,
    itemWidth = 116,
    gap = 8,
    overscan = 3,
}) {
    const itemSignature = useMemo(
        () => items.map((item, index) => getItemKey(item, index)).join("|"),
        [items]
    )

    const virtualizer = useVirtualizer({
        horizontal: true,
        count: items.length,
        getScrollElement: () => scrollElementRef?.current ?? null,
        estimateSize: () => itemWidth,
        getItemKey: index => getItemKey(items[index], index),
        overscan,
        gap,
        useFlushSync: false,
    })

    // Re-measure item positions whenever the rendered result collection changes.
    useLayoutEffect(() => {
        virtualizer.measure()
    }, [itemSignature, itemWidth, virtualizer])

    return (
        <div
            className="magic-toilet-horizontal-spacer"
            style={{
                position: "relative",
                width: virtualizer.getTotalSize(),
                height: "100%",
            }}
        >
            {virtualizer.getVirtualItems().map(virtualItem => (
                <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    className="magic-toilet-horizontal-item"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: virtualItem.size,
                        height: "100%",
                        transform: `translateX(${virtualItem.start}px)`,
                    }}
                >
                    {renderItem(items[virtualItem.index], virtualItem.index)}
                </div>
            ))}
        </div>
    )
}

export default VirtualizedHorizontalList
