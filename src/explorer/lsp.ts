import { UPSTREAM_ISSUE_URL } from "./config"
import { monaco } from "./monaco"
import { moduleHref } from "./routes"
import {
    getModuleModel,
    parseModuleUri,
    useExplorerSettings,
    useExplorerStore,
} from "./store"
import type { ModuleLocation } from "./types"

const COPY_COMMAND = "explorer.copyIntlFind"

let intlKeys: Record<string, string> | undefined

async function unhashIntlKey(key: string) {
    intlKeys ??= (await import("./lsp/intl-keys.json")).default as Record<
        string,
        string
    >
    return intlKeys[key]
}

function moduleFor(model: monaco.editor.ITextModel) {
    const { buildHash, bundleApi } = useExplorerStore.getState()
    const target = parseModuleUri(model.uri)

    if (!bundleApi || !target || target.buildHash !== buildHash) return null
    return { bundleApi, moduleId: target.moduleId }
}

async function toLocations(
    locations: ModuleLocation[],
): Promise<monaco.languages.Location[]> {
    return Promise.all(
        locations.map(async ({ moduleId, range }) => ({
            uri: (await getModuleModel(moduleId)).uri,
            range,
        })),
    )
}

let registered = false

export function registerLanguageFeatures() {
    if (registered) return
    registered = true

    monaco.languages.registerHoverProvider("javascript", {
        async provideHover(model, position) {
            const module = moduleFor(model)
            if (!module) return

            const hover = await module.bundleApi.getHover(
                module.moduleId,
                position,
            )
            if (!hover) return

            if (hover.i18nKey) {
                const name = await unhashIntlKey(hover.i18nKey)
                const find = name
                    ? `#{intl::${name}}`
                    : `#{intl::${hover.i18nKey}::raw}`
                const args = encodeURIComponent(JSON.stringify([find]))

                return {
                    range: hover.range,
                    contents: [
                        {
                            value:
                                name ??
                                `No mapping found. If you find one, please [open an issue](${UPSTREAM_ISSUE_URL}) so it can be added!`,
                        },
                        {
                            value: `$(copy) [Copy As Find](command:${COPY_COMMAND}?${args})`,
                            supportThemeIcons: true,
                            isTrusted: { enabledCommands: [COPY_COMMAND] },
                        },
                    ],
                }
            }

            if (!hover.content) return

            return {
                range: hover.range,
                contents: [
                    {
                        value: hover.content,
                        isTrusted: true,
                        supportThemeIcons: true,
                    },
                ],
            }
        },
    })

    monaco.editor.registerCommand(COPY_COMMAND, (_, text: string) => {
        void navigator.clipboard.writeText(text)
    })

    monaco.languages.registerDefinitionProvider("javascript", {
        async provideDefinition(model, position) {
            const module = moduleFor(model)
            if (!module) return
            return toLocations(
                await module.bundleApi.getDefinitions(
                    module.moduleId,
                    position,
                ),
            )
        },
    })

    monaco.languages.registerReferenceProvider("javascript", {
        async provideReferences(model, position) {
            const module = moduleFor(model)
            if (!module) return
            return toLocations(
                await module.bundleApi.getReferences(module.moduleId, position),
            )
        },
    })

    monaco.editor.registerEditorOpener({
        openCodeEditor(_, uri, selection) {
            const target = parseModuleUri(uri)
            if (!target) return false

            const search =
                selection &&
                ("startLineNumber" in selection
                    ? {
                          sl: selection.startLineNumber,
                          sc: selection.startColumn,
                          el: selection.endLineNumber,
                          ec: selection.endColumn,
                      }
                    : { sl: selection.lineNumber, sc: selection.column })

            if (useExplorerSettings.getState().openModulesInNewTab) {
                window.open(
                    moduleHref(target.buildHash, target.moduleId, search),
                    "_blank",
                    "noopener,noreferrer",
                )
            } else {
                useExplorerStore.getState().navigate(target.moduleId, search)
            }

            return true
        },
    })
}
