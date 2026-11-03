"use client"

import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

export type DateMode = "day" | "month" | "year"

const MODES: { value: DateMode; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
]

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(undefined, { month: "short" }).format(
        new Date(2000, i, 1),
    ),
)
const monthTitle = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
})
const dayLabel = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })

const pad = (n: number) => String(n).padStart(2, "0")

export function dayKey(time: number) {
    const date = new Date(time)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function dateModeOf(value: string): DateMode {
    return value.length === 10 ? "day" : value.length === 7 ? "month" : "year"
}

export function formatDateValue(value: string) {
    const [y, m = 1, d = 1] = value.split("-").map(Number)
    const mode = dateModeOf(value)
    if (mode === "day") return dayLabel.format(new Date(y, m - 1, d))
    if (mode === "month") return monthTitle.format(new Date(y, m - 1, 1))
    return value
}

const navClass =
    "cursor-pointer rounded-lg p-1 text-neutral-500 transition-colors hover:bg-zinc-200 hover:text-neutral-900 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-zinc-800 dark:hover:text-neutral-100"

function tabClass(active: boolean) {
    return `flex-1 cursor-pointer rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
        active
            ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    }`
}

function cellClass(selected: boolean, enabled: boolean) {
    if (selected) return "bg-rose-500 font-semibold text-white"
    if (enabled)
        return "cursor-pointer font-medium text-neutral-800 hover:bg-zinc-200 dark:text-neutral-200 dark:hover:bg-zinc-800"
    return "cursor-default text-neutral-400 dark:text-neutral-600"
}

export default function DatePicker({
    value,
    onChange,
    counts,
}: {
    value: string | null
    onChange: (value: string | null) => void
    counts: Record<string, number>
}) {
    const totals = useMemo(() => {
        const sums: Record<string, number> = {}
        for (const [day, n] of Object.entries(counts)) {
            for (const key of [day, day.slice(0, 7), day.slice(0, 4)]) {
                sums[key] = (sums[key] ?? 0) + n
            }
        }
        return sums
    }, [counts])
    const years = useMemo(
        () =>
            Object.keys(totals)
                .filter((key) => key.length === 4)
                .map(Number)
                .sort((a, b) => a - b),
        [totals],
    )
    const latestDay = useMemo(() => Object.keys(counts).sort().at(-1), [counts])

    const initialView = () => {
        const key = value ?? latestDay ?? dayKey(Date.now())
        return {
            year: Number(key.slice(0, 4)),
            month: key.length >= 7 ? Number(key.slice(5, 7)) - 1 : 0,
        }
    }

    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<DateMode>(
        value ? dateModeOf(value) : "day",
    )
    const [view, setView] = useState(initialView)
    const root = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const onPointer = (e: PointerEvent) => {
            if (!root.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("pointerdown", onPointer)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("pointerdown", onPointer)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    const select = (next: string | null) => {
        onChange(next)
        setOpen(false)
    }

    const toggle = () => {
        if (!open) {
            setMode(value ? dateModeOf(value) : "day")
            setView(initialView())
        }
        setOpen(!open)
    }

    const minYear = years[0] ?? view.year
    const maxYear = years.at(-1) ?? view.year
    const position = view.year * 12 + view.month
    const canShift = (delta: number) =>
        mode === "month"
            ? delta < 0
                ? view.year > minYear
                : view.year < maxYear
            : delta < 0
              ? position > minYear * 12
              : position < maxYear * 12 + 11
    const shift = (delta: number) =>
        setView((v) => {
            if (mode === "month") return { ...v, year: v.year + delta }
            const date = new Date(v.year, v.month + delta, 1)
            return { year: date.getFullYear(), month: date.getMonth() }
        })

    const cell = (key: string, label: string | number) => {
        const n = totals[key] ?? 0
        return (
            <button
                key={key}
                type="button"
                disabled={!n}
                onClick={() => select(key)}
                aria-pressed={value === key}
                title={n ? `${n} build${n === 1 ? "" : "s"}` : "No builds"}
                className={`rounded-lg py-1.5 text-sm tabular-nums transition-colors ${cellClass(value === key, n > 0)}`}
            >
                {label}
            </button>
        )
    }

    const firstWeekday = new Date(view.year, view.month, 1).getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

    return (
        <div ref={root} className="relative w-fit">
            <div className="inline-flex items-center rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800">
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        value
                            ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                >
                    <CalendarDays size={16} />
                    {value ? formatDateValue(value) : "Any date"}
                </button>
                {value && (
                    <button
                        type="button"
                        onClick={() => select(null)}
                        aria-label="Clear date"
                        className="ml-1 cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:text-rose-500"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {open && (
                <div
                    role="dialog"
                    aria-label="Filter by date"
                    className="absolute left-0 z-30 mt-2 flex w-72 flex-col gap-3 rounded-2xl border border-zinc-300 bg-zinc-100 p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div
                        role="group"
                        aria-label="Date granularity"
                        className="flex rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800"
                    >
                        {MODES.map((m) => (
                            <button
                                key={m.value}
                                type="button"
                                aria-pressed={mode === m.value}
                                onClick={() => setMode(m.value)}
                                className={tabClass(mode === m.value)}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {mode !== "year" && (
                        <div className="flex items-center justify-between px-1">
                            <button
                                type="button"
                                aria-label="Previous"
                                disabled={!canShift(-1)}
                                onClick={() => shift(-1)}
                                className={navClass}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                {mode === "day"
                                    ? monthTitle.format(
                                          new Date(view.year, view.month, 1),
                                      )
                                    : view.year}
                            </span>
                            <button
                                type="button"
                                aria-label="Next"
                                disabled={!canShift(1)}
                                onClick={() => shift(1)}
                                className={navClass}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {mode === "day" && (
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {WEEKDAYS.map((d) => (
                                <span
                                    key={d}
                                    className="py-1 text-xs font-medium text-neutral-500"
                                >
                                    {d}
                                </span>
                            ))}
                            {Array.from({ length: firstWeekday }, (_, i) => (
                                <span key={`blank-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }, (_, i) =>
                                cell(
                                    `${view.year}-${pad(view.month + 1)}-${pad(i + 1)}`,
                                    i + 1,
                                ),
                            )}
                        </div>
                    )}

                    {mode === "month" && (
                        <div className="grid grid-cols-3 gap-1 text-center">
                            {MONTHS.map((label, i) =>
                                cell(`${view.year}-${pad(i + 1)}`, label),
                            )}
                        </div>
                    )}

                    {mode === "year" && (
                        <div className="grid grid-cols-3 gap-1 text-center">
                            {Array.from(
                                { length: maxYear - minYear + 1 },
                                (_, i) =>
                                    cell(String(minYear + i), minYear + i),
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
