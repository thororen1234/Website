"use client"

import { useEffect, useState } from "react"
import Box from "@/components/Base/Box"
import CopyButton from "@/components/Tools/CopyButton"
import SegmentedControl from "@/components/Tools/SegmentedControl"
import { fieldClass, labelClass } from "@/components/Tools/fields"
import {
    HASH_ALGORITHMS,
    base64Decode,
    base64Encode,
    formatJson,
    hashHex,
} from "@/lib/devtools"

function Output({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <span className={labelClass}>{label}</span>
                <CopyButton text={value} />
            </div>
            <textarea
                value={value}
                readOnly
                rows={6}
                spellCheck={false}
                aria-label={label}
                className={`${fieldClass} resize-y`}
            />
        </div>
    )
}

function Problem({ children }: { children: string }) {
    return <p className="text-sm text-rose-500">{children}</p>
}

function Base64Tool() {
    const [mode, setMode] = useState<"encode" | "decode">("encode")
    const [urlSafe, setUrlSafe] = useState(false)
    const [input, setInput] = useState("")

    const decoded = mode === "decode" ? base64Decode(input) : null
    const output =
        mode === "encode" ? base64Encode(input, urlSafe) : (decoded ?? "")
    const invalid = mode === "decode" && input.trim() !== "" && decoded === null

    return (
        <Box compact className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <SegmentedControl
                    label="Direction"
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: "encode", label: "Encode" },
                        { value: "decode", label: "Decode" },
                    ]}
                />

                {mode === "encode" && (
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <input
                            type="checkbox"
                            checked={urlSafe}
                            onChange={(e) => setUrlSafe(e.target.checked)}
                            className="size-4 accent-rose-600"
                        />
                        URL-safe
                    </label>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="base64-input" className={labelClass}>
                    {mode === "encode" ? "Text" : "Base64"}
                </label>
                <textarea
                    id="base64-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={5}
                    spellCheck={false}
                    className={`${fieldClass} resize-y`}
                />
            </div>

            {invalid && <Problem>That isn&apos;t valid Base64 text.</Problem>}

            <Output
                label={mode === "encode" ? "Base64" : "Text"}
                value={output}
            />
        </Box>
    )
}

function JsonTool() {
    const [mode, setMode] = useState<"format" | "minify">("format")
    const [indent, setIndent] = useState<"2" | "4" | "tab">("2")
    const [input, setInput] = useState("")

    const result = input.trim()
        ? formatJson(
              input,
              mode === "minify" ? 0 : indent === "tab" ? "tab" : Number(indent),
          )
        : null

    return (
        <Box compact className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <SegmentedControl
                    label="Action"
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: "format", label: "Format" },
                        { value: "minify", label: "Minify" },
                    ]}
                />

                {mode === "format" && (
                    <SegmentedControl
                        label="Indent"
                        value={indent}
                        onChange={setIndent}
                        options={[
                            { value: "2", label: "2 spaces" },
                            { value: "4", label: "4 spaces" },
                            { value: "tab", label: "Tab" },
                        ]}
                    />
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="json-input" className={labelClass}>
                    JSON
                </label>
                <textarea
                    id="json-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={6}
                    spellCheck={false}
                    aria-invalid={result !== null && !result.ok}
                    className={`${fieldClass} resize-y`}
                />
            </div>

            {result && !result.ok && <Problem>{result.error}</Problem>}

            <Output
                label={mode === "format" ? "Formatted" : "Minified"}
                value={result?.ok ? result.text : ""}
            />
        </Box>
    )
}

function HashTool() {
    const [input, setInput] = useState("")
    const [hashes, setHashes] = useState<Record<string, string>>({})
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let cancelled = false

        Promise.all(
            HASH_ALGORITHMS.map(
                async (algorithm) =>
                    [algorithm, await hashHex(algorithm, input)] as const,
            ),
        )
            .then((entries) => {
                if (cancelled) return
                setHashes(Object.fromEntries(entries))
                setFailed(false)
            })
            .catch(() => {
                if (!cancelled) setFailed(true)
            })

        return () => {
            cancelled = true
        }
    }, [input])

    return (
        <Box compact className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label htmlFor="hash-input" className={labelClass}>
                    Text
                </label>
                <textarea
                    id="hash-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    spellCheck={false}
                    className={`${fieldClass} resize-y`}
                />
            </div>

            {failed && (
                <Problem>
                    Hashing isn&apos;t available here. It needs a secure
                    connection (https or localhost).
                </Problem>
            )}

            <ul className="flex flex-col divide-y divide-zinc-300 dark:divide-zinc-800">
                {HASH_ALGORITHMS.map((algorithm) => (
                    <li
                        key={algorithm}
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
                    >
                        <div className="flex min-w-0 flex-1 basis-64 flex-col">
                            <span className={labelClass}>{algorithm}</span>
                            <span className="text-sm break-all text-neutral-800 dark:text-neutral-200">
                                {hashes[algorithm] ?? ""}
                            </span>
                        </div>
                        <CopyButton text={hashes[algorithm] ?? ""} />
                    </li>
                ))}
            </ul>
        </Box>
    )
}

const tabs = [
    { value: "base64", label: "Base64" },
    { value: "json", label: "JSON" },
    { value: "hash", label: "Hashes" },
] as const

export default function DevTools() {
    const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("base64")

    return (
        <div className="flex flex-col gap-4">
            <SegmentedControl
                label="Tool"
                value={tab}
                onChange={setTab}
                options={[...tabs]}
            />

            <div hidden={tab !== "base64"}>
                <Base64Tool />
            </div>
            <div hidden={tab !== "json"}>
                <JsonTool />
            </div>
            <div hidden={tab !== "hash"}>
                <HashTool />
            </div>
        </div>
    )
}
