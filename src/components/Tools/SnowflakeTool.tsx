"use client"

import { useMemo, useState } from "react"
import Box from "@/components/Base/Box"
import CopyButton from "@/components/Tools/CopyButton"
import {
    decodeSnowflake,
    findSnowflakes,
    formatRelative,
    type Snowflake,
} from "@/lib/discord"

const MAX_RESULTS = 20

function Row({ label, children }: { label: string; children: string }) {
    return (
        <>
            <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
            <dd className="min-w-0 text-neutral-800 dark:text-neutral-200">
                {children}
            </dd>
        </>
    )
}

function Result({ id, timestamp, worker, process, increment }: Snowflake) {
    const date = new Date(timestamp)
    const unix = String(Math.floor(timestamp / 1000))

    return (
        <Box compact className="flex flex-col gap-3">
            <span className="text-lg font-medium text-neutral-800 tabular-nums dark:text-neutral-200">
                {id}
            </span>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <Row label="Created">
                    {date.toLocaleString(undefined, {
                        dateStyle: "full",
                        timeStyle: "medium",
                    })}
                </Row>
                <Row label="UTC">{date.toISOString()}</Row>
                <Row label="Relative">
                    {formatRelative(timestamp, Date.now())}
                </Row>
                <Row label="Unix">{unix}</Row>
                <Row label="Worker">{String(worker)}</Row>
                <Row label="Process">{String(process)}</Row>
                <Row label="Increment">{String(increment)}</Row>
            </dl>

            <div className="flex gap-2">
                <CopyButton text={unix} />
                <span className="self-center text-xs text-neutral-500 dark:text-neutral-400">
                    Unix time in seconds
                </span>
            </div>
        </Box>
    )
}

export default function SnowflakeTool() {
    const [input, setInput] = useState("")

    const results = useMemo(
        () =>
            findSnowflakes(input)
                .map(decodeSnowflake)
                .filter((result) => result !== null)
                .slice(0, MAX_RESULTS),
        [input],
    )

    return (
        <div className="flex flex-col gap-4">
            <Box compact className="flex flex-col gap-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Every Discord ID (users, servers, channels, messages) has
                    the time it was created built in. Paste one or more IDs,
                    mentions or message links.
                </p>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                    spellCheck={false}
                    aria-label="Discord IDs"
                    placeholder="643945264868098049"
                    className="w-full resize-y rounded-xl bg-zinc-200 px-3 py-2 text-sm text-neutral-800 ring-1 ring-transparent outline-none placeholder:text-neutral-500 focus:ring-rose-500 dark:bg-zinc-800 dark:text-neutral-200"
                />
            </Box>

            {input.trim() && results.length === 0 && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No valid ID found. Discord IDs are numbers of 17 to 20
                    digits.
                </p>
            )}

            {results.length > 0 && (
                <ul className="grid gap-3 md:grid-cols-2">
                    {results.map((result) => (
                        <li key={result.id}>
                            <Result {...result} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
