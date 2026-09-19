export interface Rgb {
    r: number
    g: number
    b: number
}

export interface Hsl {
    h: number
    s: number
    l: number
}

const clampByte = (n: number) => Math.min(255, Math.max(0, Math.round(n)))

export function fromDecimal(value: number): Rgb | null {
    if (!Number.isInteger(value) || value < 0 || value > 0xffffff) return null
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 }
}

export const toDecimal = ({ r, g, b }: Rgb) => (r << 16) | (g << 8) | b

export const toHex = ({ r, g, b }: Rgb) =>
    `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`

export function parseHex(text: string): Rgb | null {
    const match = text
        .trim()
        .replace(/^(#|0x)/i, "")
        .match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i)
    if (!match) return null

    const hex =
        match[1].length === 3
            ? [...match[1]].map((char) => char + char).join("")
            : match[1]

    return fromDecimal(parseInt(hex, 16))
}

export function parseDecimal(text: string): Rgb | null {
    if (!/^\s*\d{1,8}\s*$/.test(text)) return null
    return fromDecimal(Number(text))
}

function parseTriple(text: string, limits: [number, number, number]) {
    const numbers = text.match(/\d+(?:\.\d+)?/g)?.map(Number)
    if (!numbers || numbers.length !== 3) return null
    return numbers.every((n, i) => n <= limits[i]) ? numbers : null
}

export function parseRgb(text: string): Rgb | null {
    const triple = parseTriple(text, [255, 255, 255])
    if (!triple) return null
    return {
        r: clampByte(triple[0]),
        g: clampByte(triple[1]),
        b: clampByte(triple[2]),
    }
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
    const hue = h % 360
    const sn = s / 100
    const ln = l / 100
    const chroma = (1 - Math.abs(2 * ln - 1)) * sn
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = ln - chroma / 2

    const [r, g, b] = [
        [chroma, x, 0],
        [x, chroma, 0],
        [0, chroma, x],
        [0, x, chroma],
        [x, 0, chroma],
        [chroma, 0, x],
    ][Math.floor(hue / 60)]

    return {
        r: clampByte((r + m) * 255),
        g: clampByte((g + m) * 255),
        b: clampByte((b + m) * 255),
    }
}

export function parseHsl(text: string): Rgb | null {
    const triple = parseTriple(text, [360, 100, 100])
    if (!triple) return null
    return hslToRgb({ h: triple[0], s: triple[1], l: triple[2] })
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
    const [rn, gn, bn] = [r, g, b].map((value) => value / 255)
    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const lightness = (max + min) / 2
    const delta = max - min

    if (delta === 0) return { h: 0, s: 0, l: Math.round(lightness * 100) }

    const saturation = delta / (1 - Math.abs(2 * lightness - 1))
    const sector =
        max === rn
            ? ((gn - bn) / delta) % 6
            : max === gn
              ? (bn - rn) / delta + 2
              : (rn - gn) / delta + 4

    return {
        h: (Math.round(sector * 60) + 360) % 360,
        s: Math.round(saturation * 100),
        l: Math.round(lightness * 100),
    }
}
