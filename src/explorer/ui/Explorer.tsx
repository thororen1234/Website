"use client"

import {
    Download,
    FileCode,
    LoaderCircle,
    Network,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    Undo2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import Github from "@/components/Icons/Github"
import { bundleArchiveUrl, SITE_REPO_URL, UPSTREAM_REPO_URL } from "../config"
import { registerLSPHandlers } from "../lsp"
import { setupMonaco } from "../monaco"
import { parseModuleId, parseViewSearch, viewHref } from "../routes"
import { initBuild, useExplorerStore } from "../store"
import type { TBundleHash, TModuleId } from "../types"
import CodeView from "./CodeView"
import GraphView from "./GraphView"
import SettingsDialog from "./SettingsDialog"
import Sidebar from "./Sidebar"
import {
    iconButtonClass,
    linkTextClass,
    tabClass,
    tabGroupClass,
} from "./styles"
import { errorMessage, useAsync } from "./useAsync"

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

function FullScreen({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-200 p-6 text-center text-neutral-700 dark:bg-zinc-950 dark:text-neutral-300">
            {children}
        </div>
    )
}

export default function Explorer() {
    const params = useParams<{ buildHash: string; moduleId?: string[] }>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const dark = useSiteDark()

    const buildHash = decodeURIComponent(params.buildHash) as TBundleHash
    const moduleId = parseModuleId(params.moduleId) as TModuleId | null
    const search = useMemo(
        () => parseViewSearch(new URLSearchParams(searchParams.toString())),
        [searchParams],
    )

    useEffect(() => {
        useExplorerStore.setState({
            navigate: (id, s) => router.push(viewHref(buildHash, id, s)),
        })
    }, [router, buildHash])

    useEffect(() => {
        useExplorerStore.setState({ selectedModule: moduleId })
    }, [moduleId])

    const load = useAsync(async () => {
        await Promise.all([setupMonaco(), initBuild(buildHash)])
        registerLSPHandlers()
        useExplorerStore.setState({ selectedModule: moduleId })
    }, [buildHash])

    if (load.status === "error") {
        return (
            <FullScreen>
                <p className="text-lg font-medium text-rose-500">
                    Couldn&apos;t load build {buildHash}
                </p>
                <p className="text-sm">{errorMessage(load.error)}</p>
                <Link href="/discord/modules" className={linkTextClass}>
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
    search: ReturnType<typeof parseViewSearch>
    dark: boolean
}) {
    const panel = useExplorerStore((s) => s.activePanel)
    const sidebarOpen = useExplorerStore((s) => s.sidebarOpen)

    return (
        <div className="fixed inset-0 flex flex-col bg-zinc-100 text-neutral-800 dark:bg-zinc-950 dark:text-neutral-200">
            <Header />
            <div className="flex min-h-0 grow border-t border-zinc-300 dark:border-zinc-800">
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

function Header() {
    const buildHash = useExplorerStore((s) => s.buildHash)!
    const panel = useExplorerStore((s) => s.activePanel)
    const sidebarOpen = useExplorerStore((s) => s.sidebarOpen)
    const settingsRef = useRef<HTMLDialogElement>(null)

    return (
        <header className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        useExplorerStore.setState({ sidebarOpen: !sidebarOpen })
                    }
                    aria-label={`${sidebarOpen ? "Hide" : "Show"} module sidebar`}
                    title={`${sidebarOpen ? "Hide" : "Show"} module sidebar`}
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

            <div
                role="tablist"
                className={`inline-flex w-fit ${tabGroupClass}`}
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={panel === "code"}
                    onClick={() =>
                        useExplorerStore.setState({ activePanel: "code" })
                    }
                    className={tabClass(panel === "code")}
                >
                    <FileCode size={14} /> Code
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={panel === "graph"}
                    onClick={() =>
                        useExplorerStore.setState({ activePanel: "graph" })
                    }
                    className={tabClass(panel === "graph")}
                >
                    <Network size={14} /> Graph
                </button>
            </div>

            <div className="flex items-center gap-2">
                <a
                    href={bundleArchiveUrl(buildHash)}
                    download={`${buildHash}.7z`}
                    aria-label="Download bundle"
                    title="Download bundle"
                    className={iconButtonClass}
                >
                    <Download size={16} />
                </a>
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
                    href={UPSTREAM_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Explorer by sadan4 (AGPL-3.0)"
                    title="Explorer by sadan4 (AGPL-3.0)"
                    className={iconButtonClass}
                >
                    <Github size={16} />
                </a>
                <a
                    href={`${SITE_REPO_URL}/tree/main/src/explorer`}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden text-xs text-neutral-500 hover:text-rose-500 sm:block"
                >
                    Source
                </a>
            </div>
            <SettingsDialog ref={settingsRef} />
        </header>
    )
}
