"use client"

import {
    ArrowRight,
    Download,
    LoaderCircle,
    Monitor,
    Smartphone,
} from "lucide-react"
import Link from "next/link"
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { getAndroidBuilds, getBuilds } from "../api"
import { androidBuildId, androidBundleUrl } from "../config"
import { moduleHref } from "../routes"
import type {
    AndroidBuild,
    AndroidChannel,
    Build,
    ReleaseChannel,
} from "../types"
import DatePicker, { dayKey, formatDateValue } from "./DatePicker"
import { errorMessage, useAsync } from "./useAsync"

const dateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

const PAGE_SIZE = 24
type Platform = "desktop" | "mobile"
type Filter<C> = "all" | C

const PLATFORMS: { value: Platform; label: string; icon: typeof Monitor }[] = [
    { value: "desktop", label: "Desktop", icon: Monitor },
    { value: "mobile", label: "Mobile", icon: Smartphone },
]

const FILTERS: { value: Filter<ReleaseChannel>; label: string }[] = [
    { value: "all", label: "All" },
    { value: "stable", label: "Stable" },
    { value: "ptb", label: "PTB" },
    { value: "canary", label: "Canary" },
]

const ANDROID_FILTERS: { value: Filter<AndroidChannel>; label: string }[] = [
    { value: "all", label: "All" },
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "stable", label: "Stable" },
]

const badgeClass =
    "rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase"

const channelBadgeClass: Record<ReleaseChannel | AndroidChannel, string> = {
    stable: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    ptb: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    canary: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    beta: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    alpha: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
}

const cardClass =
    "group flex h-full flex-col gap-1.5 rounded-2xl border border-zinc-300 bg-zinc-100 px-5 py-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"

const mutedClass = "text-sm text-neutral-500 dark:text-neutral-400"

const formatBytes = (bytes: number) => `${(bytes / 1e6).toFixed(1)} MB`

const desktopKey = (build: Build) => build.hash
const androidKey = (build: AndroidBuild) => build.versionCode

export default function BuildList() {
    const [platform, setPlatform] = useState<Platform>("desktop")

    return (
        <div className="flex flex-col gap-4">
            <Tabs
                label="Platform"
                options={PLATFORMS}
                value={platform}
                onChange={setPlatform}
            />
            {platform === "desktop" ? (
                <Builds
                    key="desktop"
                    load={getBuilds}
                    filters={FILTERS}
                    keyOf={desktopKey}
                    Card={DesktopCard}
                />
            ) : (
                <Builds
                    key="mobile"
                    load={getAndroidBuilds}
                    filters={ANDROID_FILTERS}
                    keyOf={androidKey}
                    Card={AndroidCard}
                    note="Android builds are decompiled from Hermes bytecode, so go to definition and find references don't work on them. Builds that haven't been decompiled yet download as a raw bundle."
                />
            )}
        </div>
    )
}

function Tabs<T extends string>({
    label,
    options,
    value,
    onChange,
}: {
    label: string
    options: { value: T; label: string; icon?: typeof Monitor }[]
    value: T
    onChange: (value: T) => void
}) {
    return (
        <div
            role="group"
            aria-label={label}
            className="inline-flex w-fit rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800"
        >
            {options.map(({ value: option, label, icon: Icon }) => (
                <button
                    key={option}
                    type="button"
                    aria-pressed={value === option}
                    onClick={() => onChange(option)}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        value === option
                            ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                >
                    {Icon && <Icon size={16} />}
                    {label}
                </button>
            ))}
        </div>
    )
}

function Builds<
    C extends ReleaseChannel | AndroidChannel,
    T extends { firstSeen: number; channels: C[] },
>({
    load,
    filters,
    keyOf,
    Card,
    note,
}: {
    load: () => Promise<T[]>
    filters: { value: Filter<C>; label: string }[]
    keyOf: (build: T) => string | number
    Card: (props: { build: T; latest: boolean }) => ReactNode
    note?: string
}) {
    const builds = useAsync(load)
    const [count, setCount] = useState(PAGE_SIZE)
    const [filter, setFilter] = useState<Filter<C>>("all")
    const [date, setDate] = useState<string | null>(null)
    const sentinel = useRef<HTMLDivElement>(null)

    const sorted = useMemo(
        () =>
            builds.status === "success"
                ? builds.data.toSorted((a, b) => b.firstSeen - a.firstSeen)
                : [],
        [builds],
    )

    const hasChannels = sorted.some((build) => build.channels.length)

    const latest = useMemo(() => {
        const keys = new Set<string | number>()
        const seen = new Set<string>()
        for (const build of sorted) {
            const channels = build.channels.length ? build.channels : ["all"]
            for (const channel of channels) {
                if (!seen.has(channel)) {
                    seen.add(channel)
                    keys.add(keyOf(build))
                }
            }
        }
        return keys
    }, [sorted, keyOf])

    const inChannel = useMemo(
        () =>
            filter === "all"
                ? sorted
                : sorted.filter((build) => build.channels.includes(filter)),
        [sorted, filter],
    )
    const dayCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        for (const build of inChannel) {
            const key = dayKey(build.firstSeen)
            counts[key] = (counts[key] ?? 0) + 1
        }
        return counts
    }, [inChannel])
    const filtered = useMemo(
        () =>
            date
                ? inChannel.filter((build) =>
                      dayKey(build.firstSeen).startsWith(date),
                  )
                : inChannel,
        [inChannel, date],
    )
    const hasMore = filtered.length > count

    useEffect(() => {
        const el = sentinel.current
        if (!el || !hasMore) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setCount((c) => c + PAGE_SIZE)
            },
            { rootMargin: "800px" },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [hasMore, count])

    if (builds.status === "error") {
        return (
            <p className="text-sm text-rose-500">
                Couldn&apos;t load the build list: {errorMessage(builds.error)}
            </p>
        )
    }

    if (builds.status !== "success") {
        return (
            <p className={`flex items-center gap-2 ${mutedClass}`}>
                <LoaderCircle size={16} className="animate-spin" /> Loading
                builds…
            </p>
        )
    }

    if (!sorted.length) {
        return <p className={mutedClass}>No builds available right now.</p>
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                {hasChannels && (
                    <Tabs
                        label="Release channel"
                        options={filters}
                        value={filter}
                        onChange={(value) => {
                            setFilter(value)
                            setCount(PAGE_SIZE)
                        }}
                    />
                )}
                <DatePicker
                    value={date}
                    onChange={(value) => {
                        setDate(value)
                        setCount(PAGE_SIZE)
                    }}
                    counts={dayCounts}
                />
            </div>

            {note && <p className={mutedClass}>{note}</p>}

            {filtered.length ? (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.slice(0, count).map((build) => (
                        <li key={keyOf(build)}>
                            <Card
                                build={build}
                                latest={latest.has(keyOf(build))}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={mutedClass}>
                    {date
                        ? `No ${filter === "all" ? "" : filter} builds from ${formatDateValue(date)}.`
                        : `No ${filter} builds right now.`}
                </p>
            )}

            {hasMore && <div ref={sentinel} className="h-px" />}
        </>
    )
}

function Badges({
    channels,
    latest,
}: {
    channels: (ReleaseChannel | AndroidChannel)[]
    latest: boolean
}) {
    return (
        <>
            {channels.map((channel) => (
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
        </>
    )
}

function DesktopCard({ build, latest }: { build: Build; latest: boolean }) {
    return (
        <Link
            href={moduleHref(build.hash)}
            prefetch={false}
            className={cardClass}
        >
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">
                    {build.number}
                </span>
                <Badges channels={build.channels} latest={latest} />
                <ArrowRight
                    size={16}
                    className="ml-auto shrink-0 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-500"
                />
            </div>
            <span className="text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
                {dateFormat.format(new Date(build.firstSeen))}
            </span>
            <span
                className="truncate font-mono text-xs text-neutral-500"
                title={build.hash}
            >
                {build.hash}
            </span>
        </Link>
    )
}

function AndroidCard({
    build,
    latest,
}: {
    build: AndroidBuild
    latest: boolean
}) {
    const content = (
        <>
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">
                    {build.version}
                </span>
                <Badges channels={build.channels} latest={latest} />
                {build.modules ? (
                    <ArrowRight
                        size={16}
                        className="ml-auto shrink-0 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-500"
                    />
                ) : (
                    <Download
                        size={16}
                        className="ml-auto shrink-0 text-neutral-500 transition-transform group-hover:translate-y-0.5 group-hover:text-rose-500"
                    />
                )}
            </div>
            <span className="text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
                {dateFormat.format(new Date(build.firstSeen))}
            </span>
            <span className="truncate font-mono text-xs text-neutral-500">
                {build.versionCode} · {formatBytes(build.bundleSize)}
                {build.hermesVersion != null &&
                    ` · Hermes v${build.hermesVersion}`}
            </span>
        </>
    )

    return build.modules ? (
        <Link
            href={moduleHref(androidBuildId(build.versionCode))}
            prefetch={false}
            className={cardClass}
        >
            {content}
        </Link>
    ) : (
        <a href={androidBundleUrl(build.versionCode)} className={cardClass}>
            {content}
        </a>
    )
}
