import type { ExportTreeNode } from "../libsadancore/libsadancore.js"
import { ChevronRight } from "lucide-react"
import { type ReactNode, useCallback } from "react"
import { useExplorerStore } from "../store"
import type { ModuleDeps } from "../types"
import { errorMessage, useAsync } from "./useAsync"

export default function ModuleDetails() {
    const moduleId = useExplorerStore((s) => s.selectedModule)

    if (moduleId == null) {
        return (
            <p className="px-3 text-sm text-neutral-500 dark:text-neutral-400">
                Select a module to view its exports and dependencies.
            </p>
        )
    }

    return (
        <div className="flex min-h-0 grow [scrollbar-width:none] flex-col gap-4 overflow-y-auto px-3 pb-3 [&::-webkit-scrollbar]:hidden">
            <Exports moduleId={moduleId} />
            <Dependencies moduleId={moduleId} kind="dependencies" />
            <Dependencies moduleId={moduleId} kind="dependents" />
        </div>
    )
}

function Section({
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

function Exports({ moduleId }: { moduleId: number }) {
    const bundleApi = useExplorerStore((s) => s.bundleApi)
    const loadExports = useCallback(
        () => bundleApi!.getModuleExports(moduleId),
        [bundleApi, moduleId],
    )
    const exports = useAsync(bundleApi ? loadExports : null)

    return (
        <Section title="Exports">
            {exports.status === "pending" && (
                <Loading text="Loading exports…" />
            )}
            {exports.status === "error" && (
                <Error
                    text={`Failed to load export map: ${errorMessage(exports.error)}`}
                />
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
                    <Loading text="No exports found." />
                ))}
        </Section>
    )
}

function ExportItem({
    node,
    moduleId,
}: {
    node: ExportTreeNode
    moduleId: number
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
            {node.ranges.map((range, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() =>
                        useExplorerStore.getState().navigate(moduleId, {
                            sl: range.start.line,
                            sc: range.start.column,
                        })
                    }
                    className="ml-4 w-fit cursor-pointer font-mono text-xs text-rose-600 hover:underline dark:text-rose-400"
                >
                    {range.start.line}:{range.start.column}
                </button>
            ))}
        </div>
    )

    if (!node.children.length) return label
    return (
        <Section title={label} open={false}>
            {node.children.map((child) => (
                <ExportItem key={child.name} node={child} moduleId={moduleId} />
            ))}
        </Section>
    )
}

function Dependencies({
    moduleId,
    kind,
}: {
    moduleId: number
    kind: "dependencies" | "dependents"
}) {
    const bundleApi = useExplorerStore((s) => s.bundleApi)
    const loadDependencies = useCallback(
        async (): Promise<ModuleDeps | null> =>
            kind === "dependencies"
                ? bundleApi!.getModuleDependencies(moduleId)
                : ((await bundleApi!.getModuleDependents(moduleId)) ?? null),
        [bundleApi, moduleId, kind],
    )
    const dependencies = useAsync(bundleApi ? loadDependencies : null)
    const title = kind === "dependencies" ? "Dependencies" : "Dependents"

    return (
        <Section title={title}>
            {dependencies.status === "pending" && (
                <Loading text={`Loading ${kind}…`} />
            )}
            {dependencies.status === "error" && (
                <Error
                    text={`Failed to load ${kind}: ${errorMessage(dependencies.error)}`}
                />
            )}
            {dependencies.status === "success" && (
                <DependencyGroups deps={dependencies.data} kind={kind} />
            )}
        </Section>
    )
}

function DependencyGroups({
    deps,
    kind,
}: {
    deps: ModuleDeps | null
    kind: "dependencies" | "dependents"
}) {
    if (!deps || (!deps.syncUses.length && !deps.lazyUses.length))
        return (
            <Loading
                text={
                    kind === "dependencies"
                        ? "This module has no dependencies."
                        : "No other modules depend on this module."
                }
            />
        )
    return (
        <>
            <DependencyGroup label="Sync" moduleIds={deps.syncUses} />
            <DependencyGroup label="Lazy" moduleIds={deps.lazyUses} />
        </>
    )
}

function DependencyGroup({
    label,
    moduleIds,
}: {
    label: string
    moduleIds: number[]
}) {
    if (!moduleIds.length) return null
    return (
        <div className="flex flex-col">
            <span className="text-xs text-neutral-500">{label}</span>
            <div className="ml-4 flex flex-wrap gap-x-3">
                {moduleIds.map((moduleId) => (
                    <button
                        key={moduleId}
                        type="button"
                        onClick={() =>
                            useExplorerStore.getState().navigate(moduleId)
                        }
                        className="cursor-pointer font-mono text-xs text-rose-600 hover:underline dark:text-rose-400"
                    >
                        {moduleId}
                    </button>
                ))}
            </div>
        </div>
    )
}

function Loading({ text }: { text: string }) {
    return (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
    )
}
function Error({ text }: { text: string }) {
    return <p className="text-sm text-rose-500">{text}</p>
}
