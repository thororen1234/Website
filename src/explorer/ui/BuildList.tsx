"use client"

import { ArrowRight, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { buttonClass } from "@/components/Tools/fields"
import { getBuilds } from "../api"
import { viewHref } from "../routes"
import type { BuildMeta, ReleaseChannel } from "../types"
import DownloadAll from "./DownloadAll"
import { mutedTextClass, tabClass, tabGroupClass } from "./styles"
import { errorMessage, useAsync } from "./useAsync"

const dateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

const INITIAL_COUNT = 24

type Filter = "all" | ReleaseChannel

const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "stable", label: "Stable" },
    { value: "canary", label: "Canary" },
]

const badgeClass =
    "rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase"

const channelBadgeClass: Record<ReleaseChannel, string> = {
    stable: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    canary: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
}

export default function BuildList() {
    const builds = useAsync(() => getBuilds(), [])
    const [showAll, setShowAll] = useState(false)
    const [filter, setFilter] = useState<Filter>("all")

    const sorted = useMemo(
        () =>
            builds.status === "success"
                ? builds.data.toSorted((a, b) =>
                      a.first_seen === b.first_seen
                          ? 0
                          : b.first_seen > a.first_seen
                            ? 1
                            : -1,
                  )
                : [],
        [builds],
    )

    const hasChannels = sorted.some((build) => build.channels.length)

    const latest = useMemo(() => {
        const hashes = new Set<string>()
        const seen = new Set<string>()
        for (const build of sorted) {
            const keys = build.channels.length ? build.channels : ["all"]
            for (const key of keys) {
                if (!seen.has(key)) {
                    seen.add(key)
                    hashes.add(build.build_hash)
                }
            }
        }
        return hashes
    }, [sorted])

    if (builds.status === "error") {
        return (
            <p className="text-sm text-rose-500">
                Couldn&apos;t load the build list: {errorMessage(builds.error)}
            </p>
        )
    }

    if (builds.status !== "success") {
        return (
            <p className={`flex items-center gap-2 ${mutedTextClass}`}>
                <LoaderCircle size={16} className="animate-spin" /> Loading
                builds…
            </p>
        )
    }

    if (!sorted.length) {
        return <p className={mutedTextClass}>No builds available right now.</p>
    }

    const filtered =
        filter === "all"
            ? sorted
            : sorted.filter((build) => build.channels.includes(filter))
    const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)

    return (
        <div className="flex flex-col gap-4">
            {hasChannels && (
                <div
                    role="group"
                    aria-label="Release channel"
                    className={`inline-flex w-fit ${tabGroupClass}`}
                >
                    {FILTERS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={filter === value}
                            onClick={() => setFilter(value)}
                            className={tabClass(filter === value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <DownloadAll builds={filtered} />

            {filtered.length ? (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {visible.map((build) => (
                        <li key={build.build_hash}>
                            <BuildCard
                                build={build}
                                latest={latest.has(build.build_hash)}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={mutedTextClass}>No {filter} builds right now.</p>
            )}

            {!showAll && filtered.length > INITIAL_COUNT && (
                <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className={`w-fit self-center ${buttonClass}`}
                >
                    Show all {filtered.length} builds
                </button>
            )}
        </div>
    )
}

function BuildCard({ build, latest }: { build: BuildMeta; latest: boolean }) {
    return (
        <Link
            href={viewHref(build.build_hash)}
            prefetch={false}
            className="group flex h-full flex-col gap-1.5 rounded-2xl border border-zinc-300 bg-zinc-100 px-5 py-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">
                    {build.build_number}
                </span>
                {build.channels.map((channel) => (
                    <span
                        key={channel}
                        className={`${badgeClass} ${channelBadgeClass[channel]}`}
                    >
                        {channel}
                    </span>
                ))}
                {latest && (
                    <span
                        className={`${badgeClass} bg-rose-500/15 text-rose-600 dark:text-rose-400`}
                    >
                        Latest
                    </span>
                )}
                <ArrowRight
                    size={16}
                    className="ml-auto shrink-0 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-500"
                />
            </div>
            <span className="text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
                {dateFormat.format(new Date(Number(build.first_seen)))}
            </span>
            <span
                className="truncate font-mono text-xs text-neutral-500"
                title={build.build_hash}
            >
                {build.build_hash}
            </span>
        </Link>
    )
}
