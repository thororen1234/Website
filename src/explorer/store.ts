import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getBuildService, type RemoteBuildService } from "./api"
import { monaco, type Monaco } from "./monaco"
import type { ViewSearch } from "./routes"
import { DEFAULT_EDITOR_THEME, isEditorTheme } from "./themes"
import type { TBundleHash, TModuleId } from "./types"

type TextModel = ReturnType<Monaco["editor"]["createModel"]>
type Uri = TextModel["uri"]

export type ViewMode = "code" | "graph"

interface ExplorerState {
    buildHash: TBundleHash | null
    buildService: RemoteBuildService | null
    selectedModule: TModuleId | null
    activePanel: ViewMode
    sidebarOpen: boolean
    navigate: (moduleId: TModuleId, search?: ViewSearch) => void
}

const models = new Map<TModuleId, TextModel>()
const pendingModels = new Map<TModuleId, Promise<TextModel>>()

export const useExplorerStore = create<ExplorerState>(() => ({
    buildHash: null,
    buildService: null,
    selectedModule: null,
    activePanel: "code",
    sidebarOpen: true,
    navigate: () => {},
}))

export const getModuleURI = (buildHash: string, moduleId: number) =>
    monaco.Uri.parse(`file:///bundle/${buildHash}/${moduleId}.js`)

const MODULE_URI_REGEX = /^file:\/\/\/bundle\/([^/]+?)\/([^/.]+?)\.js$/

export function parseModuleURI(uri: Uri) {
    const match = MODULE_URI_REGEX.exec(uri.toString())
    if (!match) return undefined

    return {
        buildHash: match[1] as TBundleHash,
        moduleId: Number(match[2]) as TModuleId,
    }
}

function disposeModels() {
    for (const model of models.values()) model.dispose()
    models.clear()
    pendingModels.clear()
}

export async function initBuild(buildHash: TBundleHash) {
    const state = useExplorerStore.getState()
    if (state.buildHash === buildHash && state.buildService) return

    if (state.buildHash !== buildHash) {
        disposeModels()
        useExplorerStore.setState({
            buildHash,
            buildService: null,
            selectedModule: null,
        })
    }

    const buildService = await getBuildService(buildHash)

    if (useExplorerStore.getState().buildHash === buildHash) {
        useExplorerStore.setState({ buildService })
    }
}

export function resetExplorer() {
    disposeModels()
    useExplorerStore.setState({
        buildHash: null,
        buildService: null,
        selectedModule: null,
    })
}

export function getModuleModel(moduleId: TModuleId): Promise<TextModel> {
    const existing = models.get(moduleId)
    if (existing) return Promise.resolve(existing)

    const pending = pendingModels.get(moduleId)
    if (pending) return pending

    const { buildHash, buildService } = useExplorerStore.getState()
    if (!buildHash || !buildService) {
        return Promise.reject(new Error("No build loaded"))
    }

    const promise = (async () => {
        try {
            const text = await buildService.getFormattedSource(moduleId)
            const uri = getModuleURI(buildHash, moduleId)
            const model =
                monaco.editor.getModel(uri) ??
                monaco.editor.createModel(text, "javascript", uri)

            models.set(moduleId, model)
            return model
        } finally {
            pendingModels.delete(moduleId)
        }
    })()

    pendingModels.set(moduleId, promise)
    return promise
}

let placeholder: TextModel | null = null

export function placeholderModel(text: string) {
    placeholder ??= monaco.editor.createModel(
        "",
        "javascript",
        monaco.Uri.parse("file:///placeholder.js"),
    )
    placeholder.setValue(text)
    return placeholder
}

interface ExplorerSettings {
    openModulesInNewTab: boolean
    editorTheme: string
    graphDepth: number
}

const DEFAULT_SETTINGS: ExplorerSettings = {
    openModulesInNewTab: false,
    editorTheme: DEFAULT_EDITOR_THEME,
    graphDepth: 1,
}

export const useExplorerSettings = create<ExplorerSettings>()(
    persist(() => DEFAULT_SETTINGS, {
        name: "module-explorer-settings",
        version: 1,
        merge(persisted, current) {
            const saved = (persisted ?? {}) as Partial<ExplorerSettings>

            return {
                ...current,
                openModulesInNewTab:
                    typeof saved.openModulesInNewTab === "boolean"
                        ? saved.openModulesInNewTab
                        : current.openModulesInNewTab,
                editorTheme: isEditorTheme(saved.editorTheme)
                    ? saved.editorTheme
                    : current.editorTheme,
                graphDepth:
                    Number.isInteger(saved.graphDepth) &&
                    saved.graphDepth! >= 0 &&
                    saved.graphDepth! <= 10
                        ? saved.graphDepth!
                        : current.graphDepth,
            }
        },
    }),
)
