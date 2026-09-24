import { type ReactNode, useEffect, useRef, useState } from "react"
import { hiddenScrollbarClass } from "./styles"

interface Props {
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
}: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new ResizeObserver(() => setHeight(el.clientHeight))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el || scrollToIndex == null || scrollToIndex < 0) return

        const top = scrollToIndex * rowHeight
        if (
            top < el.scrollTop ||
            top + rowHeight > el.scrollTop + el.clientHeight
        ) {
            el.scrollTop = top - el.clientHeight / 2 + rowHeight / 2
        }
    }, [scrollToIndex, rowHeight, count])

    const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const last = Math.min(
        count,
        Math.ceil((scrollTop + height) / rowHeight) + overscan,
    )

    const rows = []
    for (let i = first; i < last; i++) {
        rows.push(
            <div
                key={i}
                className="absolute inset-x-0"
                style={{ top: i * rowHeight, height: rowHeight }}
            >
                {renderRow(i)}
            </div>,
        )
    }

    return (
        <div
            ref={ref}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            className={`min-h-0 overflow-y-auto ${hiddenScrollbarClass} ${className}`}
        >
            <div className="relative" style={{ height: count * rowHeight }}>
                {rows}
            </div>
        </div>
    )
}
