const DISCORD_EPOCH = 1420070400000n
const MAX_SNOWFLAKE = 2n ** 64n

export interface Snowflake {
    id: string
    timestamp: number
    worker: number
    process: number
    increment: number
}

export function decodeSnowflake(id: string): Snowflake | null {
    if (!/^\d{1,20}$/.test(id)) return null

    const value = BigInt(id)
    if (value >= MAX_SNOWFLAKE) return null

    return {
        id,
        timestamp: Number((value >> 22n) + DISCORD_EPOCH),
        worker: Number((value & 0x3e0000n) >> 17n),
        process: Number((value & 0x1f000n) >> 12n),
        increment: Number(value & 0xfffn),
    }
}

export function findSnowflakes(text: string) {
    return [...new Set(text.match(/(?<!\d)\d{17,20}(?!\d)/g) ?? [])]
}

export interface TimestampStyle {
    style: string
    name: string
    options: Intl.DateTimeFormatOptions
}

export const TIMESTAMP_STYLES: TimestampStyle[] = [
    { style: "t", name: "Short time", options: { timeStyle: "short" } },
    { style: "T", name: "Long time", options: { timeStyle: "medium" } },
    { style: "d", name: "Short date", options: { dateStyle: "short" } },
    { style: "D", name: "Long date", options: { dateStyle: "long" } },
    {
        style: "f",
        name: "Short date and time",
        options: { dateStyle: "long", timeStyle: "short" },
    },
    {
        style: "F",
        name: "Long date and time",
        options: { dateStyle: "full", timeStyle: "short" },
    },
]

export const timestampCode = (unixSeconds: number, style: string) =>
    `<t:${unixSeconds}:${style}>`

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
]

export function formatRelative(targetMs: number, nowMs: number) {
    const seconds = Math.round((targetMs - nowMs) / 1000)
    const [unit, size] =
        RELATIVE_UNITS.find(([, size]) => Math.abs(seconds) >= size) ??
        RELATIVE_UNITS[RELATIVE_UNITS.length - 1]

    return new Intl.RelativeTimeFormat(undefined, { numeric: "always" }).format(
        Math.trunc(seconds / size),
        unit,
    )
}
