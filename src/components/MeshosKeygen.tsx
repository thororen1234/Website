'use client'

import { useState } from 'react'

function gen(id: string) {
    const s = id.replace(/[:\- \\]/g, '')
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0
    const b = [
        ((h >>> 24) & 0xff) ^ 0x4d,
        ((h >>> 16) & 0xff) ^ 0x43,
        ((h >>> 8) & 0xff) ^ 0x50,
        (h & 0xff) ^ 0x50,
    ]
    return b.map((x) => x.toString(16).padStart(2, '0')).join('')
}

export default function MeshosKeygen() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')

    function run() {
        const v = input.trim()
        setOutput(v ? gen(v) : '// enter an id')
    }

    return (
        <>
            <input
                type="text"
                placeholder="Android ID / Device ID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') run()
                }}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-neutral-800 outline-none focus:border-neutral-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-neutral-200 dark:focus:border-neutral-500"
            />

            <button
                onClick={run}
                className="w-full cursor-pointer rounded-lg border border-zinc-300 bg-zinc-200 p-3 font-bold tracking-widest text-neutral-800 transition-colors hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"
            >
                Generate
            </button>

            <div className="mt-2 flex min-h-12 items-center justify-center rounded-lg bg-zinc-200 p-3 text-center tracking-widest break-all text-neutral-800 dark:bg-zinc-950 dark:text-neutral-200">
                {output}
            </div>
        </>
    )
}
