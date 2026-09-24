import { makeZip } from "client-zip"
import { FileArchive, FolderDown, LoaderCircle, X } from "lucide-react"
import { useRef, useState } from "react"
import { buttonClass } from "@/components/Tools/fields"
import { bundleArchiveUrl } from "../config"
import type { Build } from "../types"

type DirectoryPicker = (options?: {
    id?: string
    mode?: "read" | "readwrite"
}) => Promise<FileSystemDirectoryHandle>

type SavePicker = (options?: {
    id?: string
    suggestedName?: string
    types?: { description: string; accept: Record<string, string[]> }[]
}) => Promise<FileSystemFileHandle>

type Mode = "separate" | "zip"

const CONCURRENCY = 2

interface Progress {
    mode: Mode
    done: number
    skipped: number
    failed: string[]
    bytes: number
    current: string[]
    finished: boolean
    cancelled: boolean
}

const archiveName = (build: Build) =>
    `${[...build.channels, build.number, build.hash].join("-")}.7z`

const formatBytes = (bytes: number) =>
    bytes >= 1e9
        ? `${(bytes / 1e9).toFixed(2)} GB`
        : `${(bytes / 1e6).toFixed(1)} MB`

async function fileExists(dir: FileSystemDirectoryHandle, name: string) {
    try {
        const file = await (await dir.getFileHandle(name)).getFile()
        return file.size > 0
    } catch {
        return false
    }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const getFilePickers = () =>
    window as {
        showDirectoryPicker?: DirectoryPicker
        showSaveFilePicker?: SavePicker
    }

const actionClass = `flex w-fit items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass}`

export default function DownloadAll({ builds }: { builds: Build[] }) {
    const [progress, setProgress] = useState<Progress | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const running = progress != null && !progress.finished
    const canZip = typeof getFilePickers().showSaveFilePicker === "function"

    const update = (fn: (p: Progress) => Partial<Progress>) =>
        setProgress((p) => (p ? { ...p, ...fn(p) } : p))

    const countBytes = () =>
        new TransformStream<Uint8Array, Uint8Array>({
            transform(chunk, controller) {
                update((p) => ({ bytes: p.bytes + chunk.byteLength }))
                controller.enqueue(chunk)
            },
        })

    async function fetchArchive(build: Build, signal: AbortSignal) {
        const res = await fetch(bundleArchiveUrl(build.hash), { signal })
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
        return res.body.pipeThrough(countBytes())
    }

    async function downloadToFolder(
        dir: FileSystemDirectoryHandle,
        signal: AbortSignal,
    ) {
        const queue = [...builds]

        async function worker() {
            for (
                let build = queue.shift();
                build && !signal.aborted;
                build = queue.shift()
            ) {
                const name = archiveName(build)

                if (await fileExists(dir, name)) {
                    update((p) => ({ skipped: p.skipped + 1 }))
                    continue
                }

                update((p) => ({ current: [...p.current, name] }))
                try {
                    const body = await fetchArchive(build, signal)
                    const writable = await (
                        await dir.getFileHandle(name, { create: true })
                    ).createWritable()

                    await body.pipeTo(writable, { signal })
                    update((p) => ({ done: p.done + 1 }))
                } catch (e) {
                    if (!signal.aborted) {
                        console.error(`Failed to download ${name}`, e)
                        update((p) => ({ failed: [...p.failed, name] }))
                    }
                    await dir.removeEntry(name).catch(() => {})
                } finally {
                    update((p) => ({
                        current: p.current.filter((c) => c !== name),
                    }))
                }
            }
        }

        await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    }

    async function downloadToZip(
        file: FileSystemFileHandle,
        signal: AbortSignal,
    ) {
        async function* entries() {
            for (const build of builds) {
                if (signal.aborted) return

                const name = archiveName(build)
                update(() => ({ current: [name] }))

                try {
                    yield {
                        name,
                        lastModified: new Date(build.firstSeen),
                        input: await fetchArchive(build, signal),
                    }
                    update((p) => ({ done: p.done + 1 }))
                } catch (e) {
                    if (signal.aborted) return
                    console.error(`Failed to download ${name}`, e)
                    update((p) => ({ failed: [...p.failed, name] }))
                }
            }
        }

        const writable = await file.createWritable()
        try {
            await makeZip(entries()).pipeTo(writable, { signal })
        } catch (e) {
            if (!signal.aborted) throw e
        }
    }

    async function downloadSeparately(signal: AbortSignal) {
        for (const build of builds) {
            if (signal.aborted) return

            const a = document.createElement("a")
            a.href = bundleArchiveUrl(build.hash)
            a.download = archiveName(build)
            a.click()
            update((p) => ({ done: p.done + 1 }))
            await sleep(1500)
        }
    }

    async function startDownload(mode: Mode) {
        const { showDirectoryPicker, showSaveFilePicker } = getFilePickers()
        let download: (signal: AbortSignal) => Promise<void>

        try {
            if (mode === "zip" && showSaveFilePicker) {
                const file = await showSaveFilePicker({
                    id: "discord-bundles",
                    suggestedName: "discord-bundles.zip",
                    types: [
                        {
                            description: "ZIP archive",
                            accept: { "application/zip": [".zip"] },
                        },
                    ],
                })
                download = (signal) => downloadToZip(file, signal)
            } else if (showDirectoryPicker) {
                const dir = await showDirectoryPicker({
                    id: "discord-bundles",
                    mode: "readwrite",
                })
                download = (signal) => downloadToFolder(dir, signal)
            } else if (
                window.confirm(
                    `Your browser will start ${builds.length} separate downloads (about 25 MB each) and may ask you to allow multiple downloads. Continue?`,
                )
            ) {
                download = downloadSeparately
            } else {
                return
            }
        } catch {
            return
        }

        const controller = new AbortController()
        abortRef.current = controller
        setProgress({
            mode,
            done: 0,
            skipped: 0,
            failed: [],
            bytes: 0,
            current: [],
            finished: false,
            cancelled: false,
        })

        try {
            await download(controller.signal)
        } catch (e) {
            console.error(e)
            update((p) => ({ failed: [...p.failed, "archive"] }))
        }

        update(() => ({
            finished: true,
            cancelled: controller.signal.aborted,
            current: [],
        }))
    }

    const handled = progress
        ? progress.done + progress.skipped + progress.failed.length
        : 0

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => startDownload("separate")}
                    disabled={running}
                    className={actionClass}
                >
                    {running && progress.mode === "separate" ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <FolderDown size={16} />
                    )}
                    Download all separately
                </button>
                {canZip && (
                    <button
                        type="button"
                        onClick={() => startDownload("zip")}
                        disabled={running}
                        className={actionClass}
                    >
                        {running && progress.mode === "zip" ? (
                            <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                            <FileArchive size={16} />
                        )}
                        Download all as one .zip
                    </button>
                )}
                {running && (
                    <button
                        type="button"
                        onClick={() => abortRef.current?.abort()}
                        className={actionClass}
                    >
                        <X size={16} /> Cancel
                    </button>
                )}
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {builds.length} builds, about 25 MB each
                </span>
            </div>

            {progress && (
                <div className="flex flex-col gap-1.5" aria-live="polite">
                    <progress
                        value={handled}
                        max={builds.length}
                        className="h-2 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:bg-rose-500 [&::-webkit-progress-bar]:bg-zinc-300 dark:[&::-webkit-progress-bar]:bg-zinc-800 [&::-webkit-progress-value]:bg-rose-500"
                    />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {handled} / {builds.length}
                        {progress.bytes > 0 &&
                            ` · ${formatBytes(progress.bytes)}`}
                        {progress.skipped > 0 &&
                            ` · ${progress.skipped} already downloaded`}
                        {progress.failed.length > 0 &&
                            ` · ${progress.failed.length} failed`}
                        {progress.finished &&
                            (progress.cancelled ? " · Cancelled" : " · Done")}
                    </p>
                    {progress.current.length > 0 && (
                        <p className="truncate font-mono text-xs text-neutral-500">
                            {progress.current.join(", ")}
                        </p>
                    )}
                    {progress.finished &&
                        progress.failed.length > 0 &&
                        (progress.mode === "separate" ? (
                            <p className="text-sm text-rose-500">
                                Some downloads failed. Run it again on the same
                                folder to retry only the missing ones.
                            </p>
                        ) : (
                            <p className="text-sm text-rose-500">
                                Some builds failed to download and are missing
                                from the .zip: {progress.failed.join(", ")}
                            </p>
                        ))}
                </div>
            )}
        </div>
    )
}
