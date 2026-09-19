"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    async function copy() {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {}
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${text}`}
            className="flex w-20 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-zinc-200 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-zinc-300 active:scale-[.97] dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
        </button>
    )
}
