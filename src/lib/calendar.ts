const pad = (n: number) => String(n).padStart(2, "0")

export const dayKey = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const isSameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b)

export const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1)

export const startOfMinute = (date: Date) =>
    new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
    )

export const addDays = (date: Date, days: number) =>
    new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days,
        date.getHours(),
        date.getMinutes(),
    )

export function addMonths(date: Date, months: number) {
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
    const daysInTarget = new Date(
        target.getFullYear(),
        target.getMonth() + 1,
        0,
    ).getDate()

    return new Date(
        target.getFullYear(),
        target.getMonth(),
        Math.min(date.getDate(), daysInTarget),
        date.getHours(),
        date.getMinutes(),
    )
}

export function monthGrid(month: Date) {
    const first = startOfMonth(month)
    const start = addDays(first, -first.getDay())
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}
