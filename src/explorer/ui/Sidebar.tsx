import type { ExportTreeNode } from "../libsadancore/libsadancore.js"
import { ArrowRight, ChevronRight, Files, ListTree, Search } from "lucide-react"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { fieldClass } from "@/components/Tools/fields"
import { useExplorerStore } from "../store"
import type { ModuleDeps, TModuleId } from "../types"
import {
    hiddenScrollbarClass,
    iconButtonClass,
    linkTextClass,
    mutedTextClass,
    tabClass,
    tabGroupClass,
} from "./styles"
import { errorMessage, useAsync } from "./useAsync"
import VirtualList from "./VirtualList"

type Tab = "modules" | "search" | "exports"

const TABS = [
    { id: "modules", label: "Modules", icon: Files },
    { id: "search", label: "Search", icon: Search },
    { id: "exports", label: "Exports", icon: ListTree },
] as const

const navigate = (moduleId: number, search?: { sl: number; sc: number }) =>
    useExplorerStore.getState().navigate(moduleId as TModuleId, search)

export default function Sidebar() {
    const [tab, setTab] = useState<Tab>("modules")

    return (
        <aside className="flex w-80 shrink-0 flex-col border-r border-zinc-300 dark:border-zinc-800">
            <div className="px-3 pt-3 pb-3">
                <div role="tablist" className={`flex w-full ${tabGroupClass}`}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            role="tab"
                            type="button"
                            aria-selected={tab === id}
                            onClick={() => setTab(id)}
                            className={`flex-1 justify-center ${tabClass(tab === id, "px-2")}`}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex min-h-0 grow flex-col">
                <div className={tab === "modules" ? "contents" : "hidden"}>
                    <ModuleList />
                </div>
                <div className={tab === "search" ? "contents" : "hidden"}>
                    <ModuleSearch />
                </div>
                <div className={tab === "exports" ? "contents" : "hidden"}>
                    <ModuleExports />
                </div>
            </div>
        </aside>
    )
}

function ModuleList() {
    const buildService = useExplorerStore((s) => s.buildService)
    const selected = useExplorerStore((s) => s.selectedModule)
    const [input, setInput] = useState("")
    const [jumpError, setJumpError] = useState<string | null>(null)

    const ids = useAsync(
        buildService ? () => buildService.getAllModuleIds() : null,
        [buildService],
    )

    const selectedIndex = useMemo(
        () =>
            ids.status === "success" && selected != null
                ? ids.data.indexOf(selected)
                : null,
        [ids, selected],
    )

    async function jump() {
        const id = Number(input.trim())
        if (!input.trim() || !Number.isInteger(id) || !buildService) return

        if (await buildService.hasId(id)) {
            setJumpError(null)
            if (id !== selected) navigate(id)
        } else {
            setJumpError(`No module with ID ${id}`)
        }
    }

    return (
        <>
            <form
                className="flex gap-2 px-3 pb-2"
                onSubmit={(e) => {
                    e.preventDefault()
                    void jump()
                }}
            >
                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        setJumpError(null)
                    }}
                    inputMode="numeric"
                    placeholder="Module ID"
                    aria-label="Module ID"
                    aria-invalid={jumpError ? true : undefined}
                    className={fieldClass}
                />
                <button
                    type="submit"
                    aria-label="Jump to module"
                    title="Jump to module"
                    className={iconButtonClass}
                >
                    <ArrowRight size={16} />
                </button>
            </form>
            {jumpError && (
                <p className="px-3 pb-2 text-sm text-rose-500">{jumpError}</p>
            )}

            {ids.status === "pending" && (
                <p className={`px-3 ${mutedTextClass}`}>Loading modules…</p>
            )}
            {ids.status === "error" && (
                <p className="px-3 text-sm text-rose-500">
                    Failed to load the module list: {errorMessage(ids.error)}
                </p>
            )}
            {ids.status === "success" && (
                <VirtualList
                    className="grow"
                    count={ids.data.length}
                    rowHeight={28}
                    scrollToIndex={selectedIndex}
                    renderRow={(i) => {
                        const id = ids.data[i]
                        const active = id === selected

                        return (
                            <button
                                type="button"
                                onClick={() => navigate(id)}
                                aria-current={active ? "true" : undefined}
                                className={`h-full w-full cursor-pointer px-3 text-left font-mono text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                                    active
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                {id}
                            </button>
                        )
                    }}
                />
            )}
        </>
    )
}

function useDebounced<T>(value: T, ms: number) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), ms)
        return () => clearTimeout(timeout)
    }, [value, ms])

    return debounced
}

function ModuleSearch() {
    const buildService = useExplorerStore((s) => s.buildService)
    const [input, setInput] = useState("")
    const [regex, setRegex] = useState(false)
    const query = useDebounced(input, 300)
    const tooShort = query.length > 0 && query.length < 3

    const results = useAsync(
        buildService && query.length >= 3
            ? () => buildService.searchModules(query, regex)
            : null,
        [buildService, query, regex],
    )

    return (
        <div className="flex min-h-0 grow flex-col gap-2">
            <div className="flex flex-col gap-2 px-3">
                <input
                    type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search modules"
                    aria-label="Search modules"
                    aria-invalid={tooShort ? true : undefined}
                    className={fieldClass}
                />
                <label className="flex cursor-pointer items-center gap-2 px-1 text-sm text-neutral-700 dark:text-neutral-300">
                    <input
                        type="checkbox"
                        checked={regex}
                        onChange={(e) => setRegex(e.target.checked)}
                        className="accent-rose-500"
                    />
                    Regex search
                </label>
                <p className={`px-1 ${mutedTextClass}`}>
                    {tooShort
                        ? "Enter at least 3 characters"
                        : results.status === "idle"
                          ? "Enter a query above"
                          : results.status === "pending"
                            ? "Searching…"
                            : results.status === "error"
                              ? `Search failed: ${errorMessage(results.error)}`
                              : `${results.data.moduleIds.length.toLocaleString()} results`}
                </p>
            </div>

            {results.status === "success" && (
                <VirtualList
                    key={`${query}:${regex}`}
                    className="grow"
                    count={results.data.moduleIds.length}
                    rowHeight={52}
                    renderRow={(i) => (
                        <SearchResult
                            moduleId={results.data.moduleIds[i] as TModuleId}
                            rawIndex={results.data.rawIndices[i]}
                        />
                    )}
                />
            )}
        </div>
    )
}

function SearchResult({
    moduleId,
    rawIndex,
}: {
    moduleId: TModuleId
    rawIndex: number
}) {
    const buildService = useExplorerStore((s) => s.buildService)!
    const info = useAsync(
        () => buildService.getSearchResultInfo(moduleId, rawIndex, false),
        [buildService, moduleId, rawIndex],
    )

    return (
        <button
            type="button"
            onClick={async () => {
                const location = await buildService.getSearchLocation(
                    moduleId,
                    rawIndex,
                )
                navigate(moduleId, {
                    sl: location.lineNumber,
                    sc: location.column,
                })
            }}
            className="flex h-full w-full cursor-pointer flex-col justify-center border-b border-zinc-300 px-3 text-left hover:bg-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
            <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                {moduleId}.js:{info.data?.lineNumber ?? "?"}
            </span>
            <span className="truncate font-mono text-xs text-neutral-700 dark:text-neutral-300">
                {info.status === "error"
                    ? "Preview unavailable"
                    : (info.data?.preview ?? "Loading preview…")}
            </span>
        </button>
    )
}

function ModuleExports() {
    const selected = useExplorerStore((s) => s.selectedModule)

    if (selected == null) {
        return (
            <p className={`px-3 ${mutedTextClass}`}>
                Select a module to view its exports
            </p>
        )
    }

    return (
        <div
            className={`flex min-h-0 grow flex-col gap-4 overflow-y-auto px-3 pb-3 ${hiddenScrollbarClass}`}
        >
            <ExportsSection moduleId={selected} />
            <DepsSection moduleId={selected} kind="dependencies" />
            <DepsSection moduleId={selected} kind="dependents" />
        </div>
    )
}

function Collapsible({
    title,
    children,
    open = true,
}: {
    title: ReactNode
    children: ReactNode
    open?: boolean
}) {
    return (
        <details open={open} className="group/details">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-sm text-neutral-600 select-none dark:text-neutral-400 [&::-webkit-details-marker]:hidden">
                <ChevronRight
                    size={14}
                    className="shrink-0 transition-transform group-open/details:rotate-90"
                />
                {title}
            </summary>
            <div className="pt-1 pl-4">{children}</div>
        </details>
    )
}

function ExportsSection({ moduleId }: { moduleId: TModuleId }) {
    const buildService = useExplorerStore((s) => s.buildService)
    const exports = useAsync(
        buildService ? () => buildService.getModuleExportMap(moduleId) : null,
        [buildService, moduleId],
    )

    return (
        <Collapsible title="Exports">
            {exports.status === "pending" && (
                <p className={mutedTextClass}>Loading exports…</p>
            )}
            {exports.status === "error" && (
                <p className="text-sm text-rose-500">
                    Failed to load export map: {errorMessage(exports.error)}
                </p>
            )}
            {exports.status === "success" &&
                (exports.data.length ? (
                    exports.data.map((node) => (
                        <ExportItem
                            key={node.name}
                            node={node}
                            moduleId={moduleId}
                        />
                    ))
                ) : (
                    <p className={mutedTextClass}>No exports found.</p>
                ))}
        </Collapsible>
    )
}

function ExportItem({
    node,
    moduleId,
}: {
    node: ExportTreeNode
    moduleId: TModuleId
}) {
    const label = (
        <div className="flex flex-col" title={node.hover}>
            <span className="text-sm text-neutral-800 dark:text-neutral-200">
                {node.name}
                {node.hover && (
                    <span className="ml-1 text-xs text-neutral-500">
                        {node.hover}
                    </span>
                )}
            </span>
            {node.ranges.map((range, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() =>
                        navigate(moduleId, {
                            sl: range.start.line,
                            sc: range.start.column,
                        })
                    }
                    className={`ml-4 w-fit font-mono text-xs ${linkTextClass}`}
                >
                    {range.start.line}:{range.start.column}
                </button>
            ))}
        </div>
    )

    if (!node.children.length) return label

    return (
        <Collapsible title={label} open={false}>
            {node.children.map((child) => (
                <ExportItem key={child.name} node={child} moduleId={moduleId} />
            ))}
        </Collapsible>
    )
}

function DepsSection({
    moduleId,
    kind,
}: {
    moduleId: TModuleId
    kind: "dependencies" | "dependents"
}) {
    const buildService = useExplorerStore((s) => s.buildService)
    const deps = useAsync<ModuleDeps | null>(
        buildService
            ? async () =>
                  kind === "dependencies"
                      ? buildService.getModuleDependencies(moduleId)
                      : ((await buildService.getModuleDependents(moduleId)) ??
                        null)
            : null,
        [buildService, moduleId, kind],
    )
    const empty =
        kind === "dependencies"
            ? "This module has no dependencies."
            : "No other modules depend on this module."

    return (
        <Collapsible
            title={kind === "dependencies" ? "Dependencies" : "Dependents"}
        >
            {deps.status === "pending" && (
                <p className={mutedTextClass}>Loading {kind}…</p>
            )}
            {deps.status === "error" && (
                <p className="text-sm text-rose-500">
                    Failed to load {kind}: {errorMessage(deps.error)}
                </p>
            )}
            {deps.status === "success" &&
                (deps.data &&
                (deps.data.syncUses.length || deps.data.lazyUses.length) ? (
                    <>
                        <DepGroup label="Sync" ids={deps.data.syncUses} />
                        <DepGroup label="Lazy" ids={deps.data.lazyUses} />
                    </>
                ) : (
                    <p className={mutedTextClass}>{empty}</p>
                ))}
        </Collapsible>
    )
}

function DepGroup({ label, ids }: { label: string; ids: TModuleId[] }) {
    if (!ids.length) return null

    return (
        <div className="flex flex-col">
            <span className="text-xs text-neutral-500">{label}</span>
            <div className="ml-4 flex flex-wrap gap-x-3">
                {ids.map((id) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => navigate(id)}
                        className={`font-mono text-xs ${linkTextClass}`}
                    >
                        {id}
                    </button>
                ))}
            </div>
        </div>
    )
}
