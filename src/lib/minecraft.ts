export interface ColorCode {
    code: string
    name: string
    hex: string
}

export const MINECRAFT_COLORS: ColorCode[] = [
    { code: "0", name: "Black", hex: "#000000" },
    { code: "1", name: "Dark Blue", hex: "#0000aa" },
    { code: "2", name: "Dark Green", hex: "#00aa00" },
    { code: "3", name: "Dark Aqua", hex: "#00aaaa" },
    { code: "4", name: "Dark Red", hex: "#aa0000" },
    { code: "5", name: "Dark Purple", hex: "#aa00aa" },
    { code: "6", name: "Gold", hex: "#ffaa00" },
    { code: "7", name: "Gray", hex: "#aaaaaa" },
    { code: "8", name: "Dark Gray", hex: "#555555" },
    { code: "9", name: "Blue", hex: "#5555ff" },
    { code: "a", name: "Green", hex: "#55ff55" },
    { code: "b", name: "Aqua", hex: "#55ffff" },
    { code: "c", name: "Red", hex: "#ff5555" },
    { code: "d", name: "Light Purple", hex: "#ff55ff" },
    { code: "e", name: "Yellow", hex: "#ffff55" },
    { code: "f", name: "White", hex: "#ffffff" },
]

export const MINECRAFT_STYLES = [
    { code: "l", name: "Bold" },
    { code: "o", name: "Italic" },
    { code: "n", name: "Underline" },
    { code: "m", name: "Strikethrough" },
    { code: "k", name: "Obfuscated" },
    { code: "r", name: "Reset" },
]

export interface Segment {
    text: string
    color: string | null
    bold: boolean
    italic: boolean
    underline: boolean
    strikethrough: boolean
    obfuscated: boolean
}

type Style = Omit<Segment, "text">

const plain = (): Style => ({
    color: null,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    obfuscated: false,
})

const FLAGS: Record<string, keyof Style> = {
    l: "bold",
    o: "italic",
    n: "underline",
    m: "strikethrough",
    k: "obfuscated",
}

const COLORS = new Map(MINECRAFT_COLORS.map(({ code, hex }) => [code, hex]))

export function parseFormatting(
    input: string,
    prefixes = ["&", "§"],
): Segment[] {
    const segments: Segment[] = []
    let style = plain()
    let text = ""

    const flush = () => {
        if (text) segments.push({ text, ...style })
        text = ""
    }

    for (let i = 0; i < input.length; i++) {
        const char = input[i]

        if (prefixes.includes(char)) {
            const hex = input.slice(i + 1).match(/^#([0-9a-f]{6})/i)
            if (hex) {
                flush()
                style = { ...plain(), color: `#${hex[1].toLowerCase()}` }
                i += 7
                continue
            }

            const code = input[i + 1]?.toLowerCase()
            const color = code ? COLORS.get(code) : undefined

            if (color) {
                flush()
                style = { ...plain(), color }
                i++
                continue
            }
            if (code && FLAGS[code]) {
                flush()
                style = { ...style, [FLAGS[code]]: true }
                i++
                continue
            }
            if (code === "r") {
                flush()
                style = plain()
                i++
                continue
            }
        }

        text += char
    }

    flush()
    return segments
}
