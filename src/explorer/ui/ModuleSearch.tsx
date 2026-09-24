import { useCallback, useEffect, useState } from "react"
import { fieldClass } from "@/components/Tools/fields"
import { useExplorerStore } from "../store"
import { useAsync, errorMessage } from "./useAsync"
import VirtualList from "./VirtualList"

function useDebounced<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timeout)
    }, [value, delay])

    return debounced
}

export default function ModuleSearch() {
    const bundleApi = useExplorerStore((s) => s.bundleApi)
    const [input, setInput] = useState("")
    const [useRegex, setUseRegex] = useState(false)
    const query = useDebounced(input, 300)
    const tooShort = query.length > 0 && query.length < 3
    const searchModules = useCallback(
        () => bundleApi!.searchModules(query, useRegex),
        [bundleApi, query, useRegex],
    )
    const results = useAsync(
        bundleApi && query.length >= 3 ? searchModules : null,
    )

    return (
        <div className="flex min-h-0 grow flex-col gap-2">
            <div className="flex flex-col gap-2 px-3">
                <input
                    type="search"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Search modules"
                    aria-label="Search modules"
                    aria-invalid={tooShort ? true : undefined}
                    className={fieldClass}
                />
                <label className="flex cursor-pointer items-center gap-2 px-1 text-sm text-neutral-700 dark:text-neutral-300">
                    <input
                        type="checkbox"
                        checked={useRegex}
                        onChange={(event) => setUseRegex(event.target.checked)}
                        className="accent-rose-500"
                    />
                    Regex search
                </label>
                <p className="px-1 text-sm text-neutral-500 dark:text-neutral-400">
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
                    key={`${query}:${useRegex}`}
                    className="grow"
                    count={results.data.moduleIds.length}
                    rowHeight={52}
                    renderRow={(index) => (
                        <SearchResult
                            moduleId={results.data.moduleIds[index]}
                            rawIndex={results.data.rawIndices[index]}
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
    moduleId: number
    rawIndex: number
}) {
    const bundleApi = useExplorerStore((s) => s.bundleApi)!
    const loadResult = useCallback(
        () => bundleApi.getSearchResult(moduleId, rawIndex),
        [bundleApi, moduleId, rawIndex],
    )
    const result = useAsync(loadResult)

    async function openResult() {
        const location = await bundleApi.getSearchLocation(moduleId, rawIndex)
        useExplorerStore.getState().navigate(moduleId, {
            sl: location.lineNumber,
            sc: location.column,
        })
    }

    return (
        <button
            type="button"
            onClick={openResult}
            className="flex h-full w-full cursor-pointer flex-col justify-center border-b border-zinc-300 px-3 text-left hover:bg-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
            <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                {moduleId}.js:{result.data?.lineNumber ?? "?"}
            </span>
            <span className="truncate font-mono text-xs text-neutral-700 dark:text-neutral-300">
                {result.status === "error"
                    ? "Preview unavailable"
                    : (result.data?.preview ?? "Loading preview…")}
            </span>
        </button>
    )
}
