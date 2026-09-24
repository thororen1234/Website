import { type ReactNode, useEffect, useRef, useState } from "react"
interface VirtualListProps {
    count: number
    rowHeight: number
    overscan?: number
    scrollToIndex?: number | null
    renderRow(index: number): ReactNode
    className?: string
}

export default function VirtualList({
    count,
    rowHeight,
    overscan = 10,
    scrollToIndex,
    renderRow,
    className = "",
}: VirtualListProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [viewportHeight, setViewportHeight] = useState(0)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const updateHeight = () => setViewportHeight(container.clientHeight)
        const observer = new ResizeObserver(updateHeight)

        updateHeight()
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (
            !container ||
            scrollToIndex == null ||
            scrollToIndex < 0 ||
            scrollToIndex >= count
        ) {
            return
        }

        const rowTop = scrollToIndex * rowHeight
        if (
            rowTop < container.scrollTop ||
            rowTop + rowHeight > container.scrollTop + container.clientHeight
        ) {
            container.scrollTop = Math.max(
                0,
                rowTop - container.clientHeight / 2 + rowHeight / 2,
            )
        }
    }, [scrollToIndex, rowHeight, count])

    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const endIndex = Math.min(
        count,
        Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan,
    )

    const rows = Array.from({ length: endIndex - startIndex }, (_, offset) => {
        const index = startIndex + offset

        return (
            <div
                key={index}
                className="absolute inset-x-0"
                style={{ top: index * rowHeight, height: rowHeight }}
            >
                {renderRow(index)}
            </div>
        )
    })

    return (
        <div
            ref={containerRef}
            onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
            className={`min-h-0 scrollbar-none overflow-y-auto [&::-webkit-scrollbar]:hidden ${className}`}
        >
            <div className="relative" style={{ height: count * rowHeight }}>
                {rows}
            </div>
        </div>
    )
}
