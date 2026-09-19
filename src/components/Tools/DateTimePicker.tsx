"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import {
    addDays,
    addMonths,
    dayKey,
    isSameDay,
    monthGrid,
    startOfMonth,
} from "@/lib/calendar"

interface Props {
    value: Date | null
    onChange: (date: Date) => void
}

const triggerFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
})
const dayLabelFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
})
const monthFormat = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
})
const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
        new Date(2021, 7, 1 + i),
    ),
)

const hours12 = Array.from({ length: 12 }, (_, i) => i + 1)
const hours24 = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)

const twoDigits = (n: number) => String(n).padStart(2, "0")

const keySteps: Record<string, (date: Date) => Date> = {
    ArrowLeft: (date) => addDays(date, -1),
    ArrowRight: (date) => addDays(date, 1),
    ArrowUp: (date) => addDays(date, -7),
    ArrowDown: (date) => addDays(date, 7),
    PageUp: (date) => addMonths(date, -1),
    PageDown: (date) => addMonths(date, 1),
    Home: (date) => addDays(date, -date.getDay()),
    End: (date) => addDays(date, 6 - date.getDay()),
}

const selectClass =
    "cursor-pointer rounded-lg bg-zinc-200 px-2 py-1.5 text-sm text-neutral-800 ring-1 ring-transparent outline-none focus:ring-rose-500 dark:bg-zinc-800 dark:text-neutral-200"

const iconButtonClass =
    "flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-zinc-200 hover:text-rose-500 dark:text-neutral-400 dark:hover:bg-zinc-800"

function dayClass(selected: boolean, outside: boolean, today: boolean) {
    const base =
        "flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm tabular-nums transition-colors"

    if (selected) return `${base} bg-rose-600 font-medium text-white`

    return [
        base,
        "hover:bg-zinc-200 dark:hover:bg-zinc-800",
        outside
            ? "text-neutral-400 dark:text-neutral-600"
            : "text-neutral-800 dark:text-neutral-200",
        today ? "ring-1 ring-rose-500/70" : "",
    ].join(" ")
}

export default function DateTimePicker({ value, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState(() => startOfMonth(new Date()))
    const [focused, setFocused] = useState(() => new Date())
    const root = useRef<HTMLDivElement>(null)
    const trigger = useRef<HTMLButtonElement>(null)
    const moveFocus = useRef(false)

    useEffect(() => {
        if (!open) return

        function onPointerDown(event: PointerEvent) {
            if (!root.current?.contains(event.target as Node)) setOpen(false)
        }

        document.addEventListener("pointerdown", onPointerDown)
        return () => document.removeEventListener("pointerdown", onPointerDown)
    }, [open])

    useEffect(() => {
        if (!open || !moveFocus.current) return

        moveFocus.current = false
        root.current
            ?.querySelector<HTMLButtonElement>(
                `[data-date="${dayKey(focused)}"]`,
            )
            ?.focus()
    }, [open, focused, view])

    function toggle() {
        if (open) {
            setOpen(false)
            return
        }

        const start = value ?? new Date()
        setFocused(start)
        setView(startOfMonth(start))
        moveFocus.current = true
        setOpen(true)
    }

    function onRootKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape" && open) {
            event.stopPropagation()
            setOpen(false)
            trigger.current?.focus()
        }
    }

    function onGridKeyDown(event: KeyboardEvent) {
        const step = keySteps[event.key]
        if (!step) return

        event.preventDefault()
        const jumpsYear =
            event.shiftKey &&
            (event.key === "PageUp" || event.key === "PageDown")
        const next = jumpsYear
            ? addMonths(focused, event.key === "PageUp" ? -12 : 12)
            : step(focused)
        moveFocus.current = true
        setFocused(next)
        setView(startOfMonth(next))
    }

    function shiftMonth(delta: number) {
        const next = addMonths(focused, delta)
        setFocused(next)
        setView(startOfMonth(next))
    }

    function pickDay(day: Date) {
        const base = value ?? new Date()
        onChange(
            new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                base.getHours(),
                base.getMinutes(),
            ),
        )
        setFocused(day)
        setView(startOfMonth(day))
    }

    function setTime(hours: number, mins: number) {
        const base = value ?? new Date()
        onChange(
            new Date(
                base.getFullYear(),
                base.getMonth(),
                base.getDate(),
                hours,
                mins,
            ),
        )
    }

    const current = value ?? new Date()
    const today = new Date()
    const uses12Hour = open
        ? Boolean(
              new Intl.DateTimeFormat(undefined, {
                  hour: "numeric",
              }).resolvedOptions().hour12,
          )
        : false
    const hour12 = current.getHours() % 12 || 12
    const pm = current.getHours() >= 12

    return (
        <div ref={root} onKeyDown={onRootKeyDown} className="relative">
            <button
                ref={trigger}
                type="button"
                onClick={toggle}
                disabled={!value}
                aria-haspopup="dialog"
                aria-expanded={open}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-200 px-3 py-2 text-sm text-neutral-800 ring-1 ring-transparent transition-colors outline-none hover:bg-zinc-300 focus-visible:ring-rose-500 disabled:cursor-default dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"
            >
                <CalendarDays size={16} className="shrink-0" />
                <span className="min-h-5 tabular-nums">
                    {value ? triggerFormat.format(value) : ""}
                </span>
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Choose a date and time"
                    className="absolute top-full left-0 z-30 mt-2 w-72 rounded-2xl border border-zinc-300 bg-zinc-100 p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => shiftMonth(-12)}
                                aria-label="Previous year"
                                className={iconButtonClass}
                            >
                                <ChevronsLeft size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => shiftMonth(-1)}
                                aria-label="Previous month"
                                className={iconButtonClass}
                            >
                                <ChevronLeft size={18} />
                            </button>
                        </div>

                        <span
                            aria-live="polite"
                            className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                        >
                            {monthFormat.format(view)}
                        </span>

                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => shiftMonth(1)}
                                aria-label="Next month"
                                className={iconButtonClass}
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => shiftMonth(12)}
                                aria-label="Next year"
                                className={iconButtonClass}
                            >
                                <ChevronsRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-1 grid grid-cols-7 gap-0.5">
                        {weekdays.map((name) => (
                            <span
                                key={name}
                                className="flex h-7 items-center justify-center text-xs text-neutral-500 dark:text-neutral-400"
                            >
                                {name}
                            </span>
                        ))}
                    </div>

                    <div
                        onKeyDown={onGridKeyDown}
                        className="grid grid-cols-7 gap-0.5"
                    >
                        {monthGrid(view).map((day) => {
                            const selected = value
                                ? isSameDay(day, value)
                                : false

                            return (
                                <button
                                    key={dayKey(day)}
                                    type="button"
                                    data-date={dayKey(day)}
                                    tabIndex={isSameDay(day, focused) ? 0 : -1}
                                    onClick={() => pickDay(day)}
                                    aria-label={dayLabelFormat.format(day)}
                                    aria-pressed={selected}
                                    aria-current={
                                        isSameDay(day, today)
                                            ? "date"
                                            : undefined
                                    }
                                    className={dayClass(
                                        selected,
                                        day.getMonth() !== view.getMonth(),
                                        isSameDay(day, today),
                                    )}
                                >
                                    {day.getDate()}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-3 flex items-center gap-2 border-t border-zinc-300 pt-3 dark:border-zinc-800">
                        <span className="mr-auto text-sm text-neutral-600 dark:text-neutral-400">
                            Time
                        </span>

                        <select
                            aria-label="Hour"
                            value={uses12Hour ? hour12 : current.getHours()}
                            onChange={(e) => {
                                const hour = Number(e.target.value)
                                setTime(
                                    uses12Hour
                                        ? (hour % 12) + (pm ? 12 : 0)
                                        : hour,
                                    current.getMinutes(),
                                )
                            }}
                            className={selectClass}
                        >
                            {(uses12Hour ? hours12 : hours24).map((hour) => (
                                <option key={hour} value={hour}>
                                    {uses12Hour ? hour : twoDigits(hour)}
                                </option>
                            ))}
                        </select>

                        <span className="text-neutral-500 dark:text-neutral-400">
                            :
                        </span>

                        <select
                            aria-label="Minute"
                            value={current.getMinutes()}
                            onChange={(e) =>
                                setTime(
                                    current.getHours(),
                                    Number(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            {minutes.map((minute) => (
                                <option key={minute} value={minute}>
                                    {twoDigits(minute)}
                                </option>
                            ))}
                        </select>

                        {uses12Hour && (
                            <select
                                aria-label="AM or PM"
                                value={pm ? "PM" : "AM"}
                                onChange={(e) =>
                                    setTime(
                                        (hour12 % 12) +
                                            (e.target.value === "PM" ? 12 : 0),
                                        current.getMinutes(),
                                    )
                                }
                                className={selectClass}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false)
                            trigger.current?.focus()
                        }}
                        className="mt-3 w-full cursor-pointer rounded-xl bg-rose-600 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-500 active:scale-[.98]"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    )
}
