"use client"

import {
    Download,
    FileCode,
    FileText,
    LoaderCircle,
    Network,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    Undo2,
} from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Github from "@/components/Icons/Github"
import { getAndroidBuilds } from "../api"
import {
    androidVersionCode,
    bundleArchiveUrl,
    SITE_REPO_URL,
    UPSTREAM_REPO_URL,
} from "../config"
import { registerLanguageFeatures } from "../lsp"
import { setupMonaco } from "../monaco"
import { moduleHref, readModuleId, readSelection } from "../routes"
import { loadBuild, useExplorerStore } from "../store"
import CodeView from "./CodeView"
import GraphView from "./GraphView"
import SettingsDialog from "./SettingsDialog"
import Sidebar from "./Sidebar"
import { errorMessage, useAsync } from "./useAsync"

export const iconButtonClass =
    "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-neutral-600 transition-colors hover:bg-zinc-200 hover:text-rose-500 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:bg-zinc-800"

// The sidebar covers the code view on narrow screens
export const isNarrow = () => matchMedia("(max-width: 767px)").matches

function useSiteDark() {
    const [dark, setDark] = useState(true)

    useEffect(() => {
        const root = document.documentElement
        const update = () =>
            setDark(root.getAttribute("data-theme") !== "light")

        update()
        const observer = new MutationObserver(update)
        observer.observe(root, { attributeFilter: ["data-theme"] })
        return () => observer.disconnect()
    }, [])

    return dark
}

export function FullScreen({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-200 p-6 text-center text-neutral-700 dark:bg-zinc-950 dark:text-neutral-300">
            {children}
        </div>
    )
}

const SourcesExplorer = dynamic(() => import("./SourcesExplorer"), {
    ssr: false,
    loading: Loading,
})

function Loading() {
    return (
        <FullScreen>
            <LoaderCircle className="animate-spin text-rose-500" />
        </FullScreen>
    )
}

// Kotlin Android builds have jadx output instead of JS modules
export default function Explorer() {
    const params = useParams<{ buildHash: string }>()
    const buildHash = decodeURIComponent(params.buildHash)
    const versionCode = androidVersionCode(buildHash)
    const hasSources = useCallback(
        async () =>
            (await getAndroidBuilds()).some(
                (build) => build.versionCode === versionCode && build.sources,
            ),
        [versionCode],
    )
    const sources = useAsync(versionCode == null ? null : hasSources)

    if (
        versionCode == null ||
        sources.status === "error" ||
        sources.data === false
    ) {
        return <BundleExplorer />
    }
    if (sources.status !== "success") return <Loading />

    return <SourcesExplorer buildHash={buildHash} versionCode={versionCode} />
}

function BundleExplorer() {
    const params = useParams<{ buildHash: string; moduleId?: string[] }>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const dark = useSiteDark()

    const buildHash = decodeURIComponent(params.buildHash)
    const selectedModule = readModuleId(params.moduleId)
    const search = useMemo(
        () => readSelection(new URLSearchParams(searchParams.toString())),
        [searchParams],
    )

    useEffect(() => {
        useExplorerStore.setState({
            navigate: (id, selection) => {
                router.push(moduleHref(buildHash, id, selection))
                if (isNarrow())
                    useExplorerStore.setState({ sidebarOpen: false })
            },
        })
    }, [router, buildHash])

    useEffect(() => {
        useExplorerStore.setState({ selectedModule })
    }, [selectedModule])

    const loadExplorer = useCallback(async () => {
        await Promise.all([setupMonaco(), loadBuild(buildHash)])
        registerLanguageFeatures()
        useExplorerStore.setState({
            selectedModule,
            ...(selectedModule != null && isNarrow() && { sidebarOpen: false }),
        })
    }, [buildHash, selectedModule])
    const load = useAsync(loadExplorer)

    if (load.status === "error") {
        return (
            <FullScreen>
                <p className="text-lg font-medium text-rose-500">
                    Couldn&apos;t load build {buildHash}
                </p>
                <p className="text-sm">{errorMessage(load.error)}</p>
                <Link
                    href="/discord/modules"
                    className="cursor-pointer text-rose-600 hover:underline dark:text-rose-400"
                >
                    Back to build list
                </Link>
            </FullScreen>
        )
    }

    if (load.status !== "success") {
        return (
            <FullScreen>
                <LoaderCircle className="animate-spin text-rose-500" />
                <p className="font-medium">Downloading build…</p>
                <p className="max-w-md text-sm text-neutral-500">
                    The whole Discord client is fetched and indexed in your
                    browser, so this can take a moment on the first visit.
                </p>
            </FullScreen>
        )
    }

    return <ExplorerLayout search={search} dark={dark} />
}

function ExplorerLayout({
    search,
    dark,
}: {
    search: ReturnType<typeof readSelection>
    dark: boolean
}) {
    const panel = useExplorerStore((s) => s.panel)
    const sidebarOpen = useExplorerStore((s) => s.sidebarOpen)
    const buildHash = useExplorerStore((s) => s.buildHash)!

    return (
        <div className="fixed inset-0 flex flex-col bg-zinc-100 text-neutral-800 dark:bg-zinc-950 dark:text-neutral-200">
            <Header buildHash={buildHash} />
            <div className="relative flex min-h-0 grow border-t border-zinc-300 dark:border-zinc-800">
                {sidebarOpen && <Sidebar />}
                <main className="relative min-w-0 grow">
                    <div
                        className={`absolute inset-0 ${panel === "code" ? "" : "invisible"}`}
                    >
                        <CodeView search={search} />
                    </div>
                    {panel === "graph" && (
                        <div className="absolute inset-0">
                            <GraphView dark={dark} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export function Header({
    buildHash,
    sources = false,
}: {
    buildHash: string
    sources?: boolean
}) {
    const panel = useExplorerStore((s) => s.panel)
    const sidebarOpen = useExplorerStore((s) => s.sidebarOpen)
    const settingsRef = useRef<HTMLDialogElement>(null)
    const sidebarLabel = `${sidebarOpen ? "Hide" : "Show"} ${sources ? "file" : "module"} sidebar`

    return (
        <header className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        useExplorerStore.setState({
                            sidebarOpen: !sidebarOpen,
                        })
                    }
                    aria-label={sidebarLabel}
                    title={sidebarLabel}
                    className={iconButtonClass}
                >
                    {sidebarOpen ? (
                        <PanelLeftClose size={16} />
                    ) : (
                        <PanelLeftOpen size={16} />
                    )}
                </button>
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">
                        Module Explorer
                    </span>
                    <span
                        className="max-w-48 truncate font-mono text-xs text-neutral-500"
                        title={buildHash}
                    >
                        {buildHash}
                    </span>
                </div>
            </div>

            {!sources && (
                <div
                    role="tablist"
                    className="inline-flex w-fit rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={panel === "code"}
                        onClick={() =>
                            useExplorerStore.setState({ panel: "code" })
                        }
                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            panel === "code"
                                ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        }`}
                    >
                        <FileCode size={14} />
                        <span className="max-sm:sr-only">Code</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={panel === "graph"}
                        onClick={() =>
                            useExplorerStore.setState({ panel: "graph" })
                        }
                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            panel === "graph"
                                ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        }`}
                    >
                        <Network size={14} />
                        <span className="max-sm:sr-only">Graph</span>
                    </button>
                </div>
            )}

            <div className="flex items-center gap-2">
                {!sources && (
                    <a
                        href={bundleArchiveUrl(buildHash)}
                        download={`${buildHash}.7z`}
                        aria-label="Download bundle"
                        title="Download bundle"
                        className={iconButtonClass}
                    >
                        <Download size={16} />
                    </a>
                )}
                <button
                    type="button"
                    onClick={() => settingsRef.current?.showModal()}
                    aria-label="Settings"
                    title="Settings"
                    className={iconButtonClass}
                >
                    <Settings size={16} />
                </button>
                <Link
                    href="/discord/modules"
                    aria-label="Back to build list"
                    title="Back to build list"
                    className={iconButtonClass}
                >
                    <Undo2 size={16} />
                </Link>
                <a
                    href={SITE_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Website source on GitHub"
                    title="Website source on GitHub"
                    className={iconButtonClass}
                >
                    <Github size={16} />
                </a>
                <a
                    href={UPSTREAM_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Source by sadan4"
                    title="Source by sadan4"
                    className={iconButtonClass}
                >
                    <FileText size={16} />
                </a>
            </div>
            <SettingsDialog ref={settingsRef} />
        </header>
    )
}
