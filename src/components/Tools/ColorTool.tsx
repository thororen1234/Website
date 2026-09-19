"use client"

import { useEffect, useState } from "react"
import Box from "@/components/Base/Box"
import CopyButton from "@/components/Tools/CopyButton"
import { fieldClass, labelClass } from "@/components/Tools/fields"
import {
    parseDecimal,
    parseHex,
    parseHsl,
    parseRgb,
    rgbToHsl,
    toDecimal,
    toHex,
    type Rgb,
} from "@/lib/color"

interface Field {
    key: string
    label: string
    hint?: string
    format: (rgb: Rgb) => string
    parse: (text: string) => Rgb | null
}

const fields: Field[] = [
    { key: "hex", label: "Hex", format: toHex, parse: parseHex },
    {
        key: "decimal",
        label: "Decimal",
        hint: "the number Discord embeds use",
        format: (rgb) => String(toDecimal(rgb)),
        parse: parseDecimal,
    },
    {
        key: "rgb",
        label: "RGB",
        format: ({ r, g, b }) => `${r}, ${g}, ${b}`,
        parse: parseRgb,
    },
    {
        key: "hsl",
        label: "HSL",
        format: (rgb) => {
            const { h, s, l } = rgbToHsl(rgb)
            return `${h}, ${s}%, ${l}%`
        },
        parse: parseHsl,
    },
]

const channels = [
    { key: "r", label: "Red" },
    { key: "g", label: "Green" },
    { key: "b", label: "Blue" },
] as const

interface EyeDropperResult {
    sRGBHex: string
}

interface EyeDropper {
    open: () => Promise<EyeDropperResult>
}

type EyeDropperConstructor = new () => EyeDropper

const getEyeDropper = () =>
    (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper

export default function ColorTool() {
    const [rgb, setRgb] = useState<Rgb>({ r: 0x97, g: 0, b: 0 })
    const [draft, setDraft] = useState<{ key: string; text: string } | null>(
        null,
    )
    const [supportsEyeDropper, setSupportsEyeDropper] = useState(false)

    const hex = toHex(rgb)

    useEffect(() => {
        setSupportsEyeDropper(Boolean(getEyeDropper()))
    }, [])

    function edit(field: Field, text: string) {
        setDraft({ key: field.key, text })
        const parsed = field.parse(text)
        if (parsed) setRgb(parsed)
    }

    async function pickFromScreen() {
        const EyeDropper = getEyeDropper()
        if (!EyeDropper) return

        try {
            const { sRGBHex } = await new EyeDropper().open()
            const picked = parseHex(sRGBHex)
            if (picked) setRgb(picked)
        } catch {
            // Closing the system picker is expected and needs no message.
        }
    }

    return (
        <div className="grid items-start gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <Box compact className="flex flex-col gap-3">
                <div
                    style={{ backgroundColor: hex }}
                    className="h-32 rounded-xl ring-1 ring-black/10 dark:ring-white/10"
                />

                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700">
                        <input
                            type="color"
                            value={hex}
                            onChange={(event) => {
                                const picked = parseHex(event.target.value)
                                if (picked) setRgb(picked)
                            }}
                            aria-label="Choose a color"
                            className="size-5 cursor-pointer border-0 bg-transparent p-0"
                        />
                        Choose color
                    </label>
                    {supportsEyeDropper && (
                        <button
                            type="button"
                            onClick={pickFromScreen}
                            className="cursor-pointer rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-zinc-300 active:scale-[.97] dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"
                        >
                            Pick from screen
                        </button>
                    )}
                </div>

                <div className="flex overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                    <div
                        style={{ backgroundColor: hex }}
                        className="w-1 shrink-0"
                    />
                    <div className="flex flex-col gap-0.5 px-3 py-2">
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Embed title
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            This is the color bar on the side of an embed.
                        </span>
                    </div>
                </div>
            </Box>

            <Box compact className="flex flex-col gap-4">
                {fields.map((field) => {
                    const editing = draft?.key === field.key
                    const invalid = editing && !field.parse(draft.text)

                    return (
                        <div key={field.key} className="flex flex-col gap-1">
                            <label
                                htmlFor={`color-${field.key}`}
                                className={labelClass}
                            >
                                {field.label}
                                {field.hint && ` (${field.hint})`}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id={`color-${field.key}`}
                                    value={
                                        editing ? draft.text : field.format(rgb)
                                    }
                                    onChange={(e) =>
                                        edit(field, e.target.value)
                                    }
                                    onBlur={() => setDraft(null)}
                                    aria-invalid={invalid}
                                    spellCheck={false}
                                    className={fieldClass}
                                />
                                <CopyButton text={field.format(rgb)} />
                            </div>
                        </div>
                    )
                })}

                <div className="flex flex-col gap-2 border-t border-zinc-300 pt-4 dark:border-zinc-800">
                    {channels.map(({ key, label }) => (
                        <label
                            key={key}
                            className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400"
                        >
                            {label}
                            <input
                                type="range"
                                min={0}
                                max={255}
                                value={rgb[key]}
                                onChange={(e) =>
                                    setRgb({
                                        ...rgb,
                                        [key]: Number(e.target.value),
                                    })
                                }
                                className="w-full accent-rose-600"
                            />
                            <span className="text-right tabular-nums">
                                {rgb[key]}
                            </span>
                        </label>
                    ))}
                </div>
            </Box>
        </div>
    )
}
