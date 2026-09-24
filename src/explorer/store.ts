import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getBundleApi, type BundleApi } from "./api"
import { monaco } from "./monaco"
import type { CodeSelection } from "./routes"
import { isEditorTheme } from "./themes"

interface ExplorerState {
    buildHash: string | null
    bundleApi: BundleApi | null
    selectedModule: number | null
    panel: "code" | "graph"
    sidebarOpen: boolean
    navigate: (moduleId: number, selection?: CodeSelection) => void
}

export const useExplorerStore = create<ExplorerState>(() => ({
    buildHash: null,
    bundleApi: null,
    selectedModule: null,
    panel: "code",
    sidebarOpen: true,
    navigate: () => {},
}))

interface Settings {
    openModulesInNewTab: boolean
    editorTheme: string
    graphDepth: number
}

const defaultSettings: Settings = {
    openModulesInNewTab: false,
    editorTheme: "tokyo-night",
    graphDepth: 1,
}

export const useExplorerSettings = create<Settings>()(
    persist(() => defaultSettings, {
        name: "module-explorer-settings",
        version: 1,
        merge(persisted, current) {
            const saved = (persisted ?? {}) as Partial<Settings>

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

export const moduleUri = (buildHash: string, moduleId: number) =>
    monaco.Uri.parse(
        `file:///bundle/${encodeURIComponent(buildHash)}/${moduleId}.js`,
    )

export function parseModuleUri(uri: monaco.Uri) {
    const match = /^\/bundle\/([^/]+)\/(\d+)\.js$/.exec(uri.path)
    if (!match) return null

    return {
        buildHash: decodeURIComponent(match[1]),
        moduleId: Number(match[2]),
    }
}

const models = new Map<string, Promise<monaco.editor.ITextModel>>()

export async function loadBuild(buildHash: string) {
    if (useExplorerStore.getState().buildHash !== buildHash) {
        for (const model of monaco.editor.getModels()) {
            if (parseModuleUri(model.uri)) model.dispose()
        }
        models.clear()
        useExplorerStore.setState({
            buildHash,
            bundleApi: null,
            selectedModule: null,
        })
    }

    const bundleApi = await getBundleApi(buildHash)
    if (useExplorerStore.getState().buildHash === buildHash) {
        useExplorerStore.setState({ bundleApi })
    }
}

export function getModuleModel(moduleId: number) {
    const { buildHash, bundleApi } = useExplorerStore.getState()
    if (!buildHash || !bundleApi) throw new Error("No build loaded")

    const key = `${buildHash}:${moduleId}`
    let model = models.get(key)

    if (!model) {
        const loadedBuildHash = buildHash

        model = bundleApi.getModuleSource(moduleId).then((source) => {
            const created = monaco.editor.createModel(
                source,
                "javascript",
                moduleUri(loadedBuildHash, moduleId),
            )

            if (useExplorerStore.getState().buildHash !== loadedBuildHash) {
                created.dispose()
                throw new Error("Build changed while the module was loading")
            }

            return created
        })
        model.catch(() => models.delete(key))
        models.set(key, model)
    }

    return model
}

let placeholder: monaco.editor.ITextModel | undefined

export function placeholderModel(text: string) {
    placeholder ??= monaco.editor.createModel("", "javascript")
    placeholder.setValue(text)
    return placeholder
}
