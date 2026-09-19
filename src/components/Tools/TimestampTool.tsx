"use client"

import { useEffect, useState } from "react"
import Box from "@/components/Base/Box"
import CopyButton from "@/components/Tools/CopyButton"
import DateTimePicker from "@/components/Tools/DateTimePicker"
import { startOfMinute } from "@/lib/calendar"
import { formatRelative, TIMESTAMP_STYLES, timestampCode } from "@/lib/discord"

export default function TimestampTool() {
    const [date, setDate] = useState<Date | null>(null)

    useEffect(() => setDate(startOfMinute(new Date())), [])

    const unix = date ? Math.floor(date.getTime() / 1000) : null

    const rows =
        date && unix !== null
            ? [
                  ...TIMESTAMP_STYLES.map(({ style, name, options }) => ({
                      style,
                      name,
                      preview: new Intl.DateTimeFormat(
                          undefined,
                          options,
                      ).format(date),
                  })),
                  {
                      style: "R",
                      name: "Relative",
                      preview: formatRelative(date.getTime(), Date.now()),
                  },
              ].map((row) => ({ ...row, code: timestampCode(unix, row.style) }))
            : []

    return (
        <div className="flex flex-col gap-4">
            <Box compact className="flex flex-col gap-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Pick a date and time in your own timezone. Discord shows
                    each person the time in theirs.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    <DateTimePicker value={date} onChange={setDate} />
                    <button
                        type="button"
                        onClick={() => setDate(startOfMinute(new Date()))}
                        className="cursor-pointer rounded-xl bg-zinc-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-zinc-300 active:scale-[.97] dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"
                    >
                        Now
                    </button>

                    {unix !== null && (
                        <span className="ml-auto flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Unix time
                            <span className="text-neutral-800 tabular-nums dark:text-neutral-200">
                                {unix}
                            </span>
                            <CopyButton text={String(unix)} />
                        </span>
                    )}
                </div>
            </Box>

            {rows.length > 0 && (
                <Box compact>
                    <ul className="flex flex-col divide-y divide-zinc-300 dark:divide-zinc-800">
                        {rows.map(({ style, name, preview, code }) => (
                            <li
                                key={style}
                                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
                            >
                                <div className="flex min-w-0 flex-1 basis-56 flex-col">
                                    <span className="text-neutral-800 dark:text-neutral-200">
                                        {preview}
                                    </span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {name}
                                    </span>
                                </div>

                                <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs text-neutral-700 tabular-nums dark:bg-zinc-800 dark:text-neutral-300">
                                    {code}
                                </span>
                                <CopyButton text={code} />
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
        </div>
    )
}
