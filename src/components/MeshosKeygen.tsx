"use client"

import { useState } from "react"
import { buttonClass, fieldClass } from "@/components/Tools/fields"

function gen(id: string) {
    const s = id.replace(/[:\- \\]/g, "")
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0
    const b = [
        ((h >>> 24) & 0xff) ^ 0x4d,
        ((h >>> 16) & 0xff) ^ 0x43,
        ((h >>> 8) & 0xff) ^ 0x50,
        (h & 0xff) ^ 0x50,
    ]
    return b.map((x) => x.toString(16).padStart(2, "0")).join("")
}

export default function MeshosKeygen() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")

    function run() {
        const v = input.trim()
        setOutput(v ? gen(v) : "Please enter an ID")
    }

    return (
        <>
            <input
                type="text"
                aria-label="Android ID or device ID"
                placeholder="Android ID / Device ID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") run()
                }}
                className={fieldClass}
            />

            <button type="button" onClick={run} className={buttonClass}>
                Generate
            </button>

            <div
                aria-live="polite"
                className={`mt-2 flex min-h-12 items-center justify-center rounded-xl bg-zinc-200 px-3 py-2 text-center font-mono text-sm tracking-widest break-all dark:bg-zinc-800 ${
                    output
                        ? "text-neutral-800 dark:text-neutral-200"
                        : "text-neutral-500 dark:text-neutral-400"
                }`}
            >
                {output || "Your device key will appear here."}
            </div>
        </>
    )
}
