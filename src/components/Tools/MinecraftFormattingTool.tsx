"use client"

import { useState } from "react"
import Box from "@/components/Base/Box"
import { buttonClass, fieldClass, labelClass } from "@/components/Tools/fields"
import {
    MINECRAFT_COLORS,
    MINECRAFT_STYLES,
    parseFormatting,
    type Segment,
} from "@/lib/minecraft"

const example = "&6Gold &lbold&r normal\n&aGreen &nunderlined&r and &#ff55ffhex"

function PreviewSegment({ segment }: { segment: Segment }) {
    const classes = [
        segment.bold && "font-bold",
        segment.italic && "italic",
        segment.underline && "underline",
        segment.strikethrough && "line-through",
        segment.obfuscated && "animate-pulse blur-[1px]",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <span className={classes} style={{ color: segment.color ?? undefined }}>
            {segment.text}
        </span>
    )
}

export default function MinecraftFormattingTool() {
    const [input, setInput] = useState(example)
    const [prefix, setPrefix] = useState<"&" | "§">("&")
    const segments = parseFormatting(input)

    function addCode(code: string) {
        setInput((value) => `${value}${prefix}${code}`)
    }

    return (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(15rem,2fr)]">
            <Box compact className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <label htmlFor="minecraft-input" className={labelClass}>
                        Formatted text
                    </label>
                    <div
                        role="group"
                        aria-label="Code prefix"
                        className="inline-flex rounded-lg bg-zinc-200 p-1 dark:bg-zinc-800"
                    >
                        {(["&", "§"] as const).map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setPrefix(value)}
                                aria-pressed={prefix === value}
                                className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium ${
                                    prefix === value
                                        ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                                        : "text-neutral-500 dark:text-neutral-400"
                                }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>

                <textarea
                    id="minecraft-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={7}
                    spellCheck={false}
                    className={`${fieldClass} resize-y font-mono`}
                />

                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Preview</span>
                    <div className="min-h-28 rounded-xl border border-black/30 bg-[#1c1c1c] px-4 py-3 font-mono text-base leading-6 break-words whitespace-pre-wrap shadow-inner">
                        {segments.length ? (
                            segments.map((segment, index) => (
                                <PreviewSegment
                                    key={`${segment.text}-${index}`}
                                    segment={segment}
                                />
                            ))
                        ) : (
                            <span className="text-neutral-500">
                                Your preview will appear here.
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Supports legacy colors and styles, plus hex colors such
                        as <code className="font-mono">&#38;#ff55ff</code>.
                    </p>
                </div>
            </Box>

            <Box compact className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Colors</span>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4">
                        {MINECRAFT_COLORS.map(({ code, name, hex }) => (
                            <button
                                key={code}
                                type="button"
                                title={`${prefix}${code} — ${name}`}
                                aria-label={`Add ${name} color code`}
                                onClick={() => addCode(code)}
                                style={{ backgroundColor: hex }}
                                className="h-9 cursor-pointer rounded-lg ring-1 ring-black/20 transition-transform hover:scale-105 active:scale-95"
                            >
                                <span className="sr-only">{name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-zinc-300 pt-4 dark:border-zinc-800">
                    <span className={labelClass}>Styles</span>
                    <div className="flex flex-wrap gap-2">
                        {MINECRAFT_STYLES.map(({ code, name }) => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => addCode(code)}
                                className={buttonClass}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </Box>
        </div>
    )
}
