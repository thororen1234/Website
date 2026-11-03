import {
    ChevronDown,
    ChevronRight,
    Files,
    LoaderCircle,
    Search,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
    createContext,
    use,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { fieldClass } from "@/components/Tools/fields"
import { getSourcesApi, type SourcesApi } from "../api"
import { monaco, setupMonaco } from "../monaco"
import {
    type CodeSelection,
    readSelection,
    readSourcePath,
    sourceHref,
} from "../routes"
import { useExplorerSettings, useExplorerStore } from "../store"
import { applySearch } from "./CodeView"
import { FullScreen, Header, isNarrow } from "./Explorer"
import { useDebounced } from "./ModuleSearch"
import { SidebarFrame } from "./Sidebar"
import { errorMessage, useAsync } from "./useAsync"
import VirtualList from "./VirtualList"

type Editor = ReturnType<typeof monaco.editor.create>

interface Folder {
    name: string
    path: string
    folders: Folder[]
    files: number[]
}

interface Sources {
    buildHash: string
    versionCode: number
    api: SourcesApi
    paths: string[]
    files: Map<string, number>
    tree: Folder
    navigate: (path: string, selection?: CodeSelection) => void
}

const SourcesContext = createContext<Sources | null>(null)
const useSources = () => use(SourcesContext)!

const tabs = [
    { id: "files", label: "Files", icon: Files },
    { id: "search", label: "Search", icon: Search },
] as const

type Tab = (typeof tabs)[number]["id"]

const fileName = (path: string) => path.slice(path.lastIndexOf("/") + 1)
const dirName = (path: string) =>
    path.slice(0, Math.max(0, path.lastIndexOf("/")))

const sourceUri = (versionCode: number, path: string) =>
    monaco.Uri.parse(
        `file:///sources/${versionCode}/${path.split("/").map(encodeURIComponent).join("/")}`,
    )

let placeholder: monaco.editor.ITextModel | undefined

// The explorer's placeholder is javascript, which would start the TypeScript worker
function placeholderModel(text: string) {
    placeholder ??= monaco.editor.createModel("", "java")
    placeholder.setValue(text)
    return placeholder
}

const isSourceModel = (model: monaco.editor.ITextModel) =>
    model.uri.path.startsWith("/sources/")

// Only the open file keeps a model, the sources are already in the worker
function setModel(editor: Editor, model: monaco.editor.ITextModel) {
    const shown = editor.getModel()
    if (shown === model) return

    editor.setModel(model)
    if (shown && isSourceModel(shown)) shown.dispose()
}

// Folders that only hold one folder are merged into it, like VS Code's compact folders
function buildTree(paths: string[]) {
    const root: Folder = { name: "", path: "", folders: [], files: [] }
    const folders = new Map([["", root]])

    function folderAt(path: string): Folder {
        let folder = folders.get(path)
        if (!folder) {
            folder = { name: fileName(path), path, folders: [], files: [] }
            folderAt(dirName(path)).folders.push(folder)
            folders.set(path, folder)
        }
        return folder
    }

    paths.forEach((path, file) => folderAt(dirName(path)).files.push(file))

    function compact(folder: Folder): Folder {
        folder.folders = folder.folders
            .map(compact)
            .sort((a, b) => (a.name < b.name ? -1 : 1))

        if (
            folder === root ||
            folder.files.length ||
            folder.folders.length !== 1
        ) {
            return folder
        }

        const [child] = folder.folders
        return { ...child, name: `${folder.name}/${child.name}` }
    }

    return compact(root)
}

function ancestors(path: string | null) {
    const folders = new Set<string>()
    if (!path) return folders

    for (let at = path.indexOf("/"); at >= 0; at = path.indexOf("/", at + 1)) {
        folders.add(path.slice(0, at))
    }
    return folders
}

export default function SourcesExplorer({
    buildHash,
    versionCode,
}: {
    buildHash: string
    versionCode: number
}) {
    const params = useParams<{ moduleId?: string[] }>()
    const searchParams = useSearchParams()
    const router = useRouter()

    const path = readSourcePath(params.moduleId)
    const selection = useMemo(
        () => readSelection(new URLSearchParams(searchParams.toString())),
        [searchParams],
    )

    const loadSources = useCallback(async () => {
        const [, api] = await Promise.all([
            setupMonaco("java"),
            getSourcesApi(versionCode),
        ])
        const paths = await api.getPaths()

        return {
            api,
            paths,
            files: new Map(paths.map((path, file) => [path, file])),
            tree: buildTree(paths),
        }
    }, [versionCode])
    const load = useAsync(loadSources)

    const sources = useMemo(
        (): Sources | null =>
            load.status === "success"
                ? {
                      ...load.data,
                      buildHash,
                      versionCode,
                      navigate(path, selection) {
                          router.push(sourceHref(buildHash, path, selection))
                          if (isNarrow())
                              useExplorerStore.setState({ sidebarOpen: false })
                      },
                  }
                : null,
        [load, buildHash, versionCode, router],
    )

    const opened = useRef(false)
    useEffect(() => {
        if (!sources || opened.current) return
        opened.current = true
        if (path && isNarrow())
            useExplorerStore.setState({ sidebarOpen: false })
    }, [sources, path])

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

    if (!sources) {
        return (
            <FullScreen>
                <LoaderCircle className="animate-spin text-rose-500" />
                <p className="font-medium">Downloading sources…</p>
                <p className="max-w-md text-sm text-neutral-500">
                    The Java sources jadx decompiled from this build are fetched
                    and indexed in your browser, so this can take a moment.
                </p>
            </FullScreen>
        )
    }

    return (
        <SourcesContext value={sources}>
            <SourcesLayout path={path} selection={selection} />
        </SourcesContext>
    )
}

function SourcesLayout({
    path,
    selection,
}: {
    path: string | null
    selection: CodeSelection
}) {
    const { buildHash } = useSources()
    const sidebarOpen = useExplorerStore((s) => s.sidebarOpen)

    return (
        <div className="fixed inset-0 flex flex-col bg-zinc-100 text-neutral-800 dark:bg-zinc-950 dark:text-neutral-200">
            <Header buildHash={buildHash} sources />
            <div className="relative flex min-h-0 grow border-t border-zinc-300 dark:border-zinc-800">
                {sidebarOpen && <SourcesSidebar path={path} />}
                <main className="relative min-w-0 grow">
                    <SourceView path={path} selection={selection} />
                </main>
            </div>
        </div>
    )
}

function SourcesSidebar({ path }: { path: string | null }) {
    const [tab, setTab] = useState<Tab>("files")

    return (
        <SidebarFrame tabs={tabs} tab={tab} onTabChange={setTab}>
            <div hidden={tab !== "files"} className="contents">
                <FileList path={path} />
            </div>
            <div hidden={tab !== "search"} className="contents">
                <SourceSearch />
            </div>
        </SidebarFrame>
    )
}

type TreeRow = { depth: number } & (
    { folder: Folder; file?: undefined } | { file: number; folder?: undefined }
)

function FileList({ path }: { path: string | null }) {
    const { api, paths, files, tree, navigate } = useSources()
    const [input, setInput] = useState("")
    const query = useDebounced(input.trim(), 150)
    const [expanded, setExpanded] = useState(() => ancestors(path))

    useEffect(() => {
        if (!path) return
        setExpanded((expanded) => {
            const added = [...ancestors(path)].filter(
                (dir) => !expanded.has(dir),
            )
            return added.length ? new Set([...expanded, ...added]) : expanded
        })
    }, [path])

    const rows = useMemo(() => {
        const rows: TreeRow[] = []

        const walk = (folder: Folder, depth: number) => {
            for (const child of folder.folders) {
                rows.push({ depth, folder: child })
                if (expanded.has(child.path)) walk(child, depth + 1)
            }
            for (const file of folder.files) rows.push({ depth, file })
        }

        walk(tree, 0)
        return rows
    }, [tree, expanded])

    const selectedFile = path == null ? undefined : files.get(path)
    const selectedIndex = useMemo(
        () =>
            selectedFile == null
                ? null
                : rows.findIndex((row) => row.file === selectedFile),
        [rows, selectedFile],
    )

    const searchFiles = useCallback(() => api.searchFiles(query), [api, query])
    const results = useAsync(query ? searchFiles : null)

    function toggle(folder: Folder) {
        setExpanded((expanded) => {
            const next = new Set(expanded)
            if (!next.delete(folder.path)) next.add(folder.path)
            return next
        })
    }

    return (
        <div className="flex min-h-0 grow flex-col gap-2">
            <div className="flex flex-col gap-2 px-3">
                <input
                    type="search"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Search file names"
                    aria-label="Search file names"
                    className={fieldClass}
                />
                {query && (
                    <p className="px-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {results.status === "success"
                            ? `${results.data.files.length.toLocaleString()}${results.data.capped ? "+" : ""} files`
                            : results.status === "error"
                              ? `Search failed: ${errorMessage(results.error)}`
                              : "Searching…"}
                    </p>
                )}
            </div>

            {query ? (
                results.status === "success" && (
                    <VirtualList
                        key={query}
                        className="grow"
                        count={results.data.files.length}
                        rowHeight={44}
                        renderRow={(index) => {
                            const file = results.data.files[index]
                            return (
                                <button
                                    type="button"
                                    onClick={() => navigate(paths[file])}
                                    title={paths[file]}
                                    aria-current={
                                        file === selectedFile
                                            ? "true"
                                            : undefined
                                    }
                                    className="flex h-full w-full cursor-pointer flex-col justify-center px-3 text-left font-mono transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    <span
                                        className={`truncate text-sm ${
                                            file === selectedFile
                                                ? "text-rose-600 dark:text-rose-400"
                                                : "text-neutral-700 dark:text-neutral-300"
                                        }`}
                                    >
                                        {fileName(paths[file])}
                                    </span>
                                    <span className="truncate text-xs text-neutral-500">
                                        {dirName(paths[file])}
                                    </span>
                                </button>
                            )
                        }}
                    />
                )
            ) : (
                <VirtualList
                    className="grow"
                    count={rows.length}
                    rowHeight={28}
                    scrollToIndex={selectedIndex}
                    renderRow={(index) => {
                        const row = rows[index]
                        const style = { paddingLeft: 12 + row.depth * 12 }

                        if (row.folder) {
                            const open = expanded.has(row.folder.path)
                            const Chevron = open ? ChevronDown : ChevronRight

                            return (
                                <button
                                    type="button"
                                    onClick={() => toggle(row.folder)}
                                    aria-expanded={open}
                                    title={row.folder.path}
                                    style={style}
                                    className="flex h-full w-full cursor-pointer items-center gap-1 pr-3 text-left font-mono text-sm text-neutral-700 transition-colors hover:bg-zinc-200 dark:text-neutral-300 dark:hover:bg-zinc-800"
                                >
                                    <Chevron
                                        size={14}
                                        className="shrink-0 text-neutral-500"
                                    />
                                    <span className="truncate">
                                        {row.folder.name}
                                    </span>
                                </button>
                            )
                        }

                        const selected = row.file === selectedFile
                        return (
                            <button
                                type="button"
                                onClick={() => navigate(paths[row.file])}
                                aria-current={selected ? "true" : undefined}
                                title={paths[row.file]}
                                style={{ paddingLeft: style.paddingLeft + 18 }}
                                className={`flex h-full w-full cursor-pointer items-center pr-3 text-left font-mono text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                                    selected
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                <span className="truncate">
                                    {fileName(paths[row.file])}
                                </span>
                            </button>
                        )
                    }}
                />
            )}
        </div>
    )
}

function SourceSearch() {
    const { api, paths, navigate } = useSources()
    const [input, setInput] = useState("")
    const [useRegex, setUseRegex] = useState(false)
    const query = useDebounced(input, 300)
    const tooShort = query.length > 0 && query.length < 3
    const searchText = useCallback(
        () => api.searchText(query, useRegex),
        [api, query, useRegex],
    )
    const results = useAsync(query.length >= 3 ? searchText : null)

    return (
        <div className="flex min-h-0 grow flex-col gap-2">
            <div className="flex flex-col gap-2 px-3">
                <input
                    type="search"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Search sources"
                    aria-label="Search sources"
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
                              : `${results.data.matches.length.toLocaleString()}${results.data.capped ? "+" : ""} results`}
                </p>
            </div>

            {results.status === "success" && (
                <VirtualList
                    key={`${query}:${useRegex}`}
                    className="grow"
                    count={results.data.matches.length}
                    rowHeight={52}
                    renderRow={(index) => {
                        const { file, range, preview } =
                            results.data.matches[index]

                        return (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(paths[file], {
                                        sl: range.startLineNumber,
                                        sc: range.startColumn,
                                        el: range.endLineNumber,
                                        ec: range.endColumn,
                                    })
                                }
                                title={paths[file]}
                                className="flex h-full w-full cursor-pointer flex-col justify-center border-b border-zinc-300 px-3 text-left hover:bg-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800"
                            >
                                <span className="truncate font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                                    {fileName(paths[file])}:
                                    {range.startLineNumber}{" "}
                                    <span className="font-normal text-neutral-500">
                                        {dirName(paths[file])}
                                    </span>
                                </span>
                                <span className="truncate font-mono text-xs text-neutral-700 dark:text-neutral-300">
                                    {preview}
                                </span>
                            </button>
                        )
                    }}
                />
            )}
        </div>
    )
}

function SourceView({
    path,
    selection,
}: {
    path: string | null
    selection: CodeSelection
}) {
    const { api, versionCode, files } = useSources()
    const containerRef = useRef<HTMLDivElement>(null)
    const [editor, setEditor] = useState<Editor | null>(null)
    const theme = useExplorerSettings((s) => s.editorTheme)

    useEffect(() => {
        const created = monaco.editor.create(containerRef.current!, {
            model: placeholderModel("// Select a file"),
            readOnly: true,
            automaticLayout: true,
            fontSize: 13,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
        })
        setEditor(created)

        return () => {
            created.dispose()
            for (const model of monaco.editor.getModels()) {
                if (isSourceModel(model)) model.dispose()
            }
        }
    }, [])

    useEffect(() => {
        monaco.editor.setTheme(theme)
    }, [theme])

    const { sl, sc, el, ec } = selection

    useEffect(() => {
        if (!editor) return

        const file = path == null ? undefined : files.get(path)
        if (path == null || file == null) {
            setModel(
                editor,
                placeholderModel(
                    path == null
                        ? "// Select a file"
                        : `// No file ${path} in this build`,
                ),
            )
            return
        }

        const show = (model: monaco.editor.ITextModel) => {
            setModel(editor, model)
            applySearch(editor, { sl, sc, el, ec })
        }

        const uri = sourceUri(versionCode, path)
        const existing = monaco.editor.getModel(uri)
        if (existing) {
            show(existing)
            return
        }

        let cancelled = false

        api.getFileSource(file).then(
            (source) => {
                if (cancelled) return
                show(
                    monaco.editor.getModel(uri) ??
                        monaco.editor.createModel(source, "java", uri),
                )
            },
            (error) => {
                if (cancelled) return
                console.error(error)
                setModel(
                    editor,
                    placeholderModel(
                        `// Failed to load ${path}\n// ${errorMessage(error)}`,
                    ),
                )
            },
        )

        return () => {
            cancelled = true
        }
    }, [editor, api, versionCode, files, path, sl, sc, el, ec])

    return <div ref={containerRef} className="size-full" />
}
