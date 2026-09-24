import { UPSTREAM_ISSUE_URL } from "./config"
import { monaco, type Monaco } from "./monaco"
import { viewHref, type ViewSearch } from "./routes"
import {
    getModuleModel,
    parseModuleURI,
    useExplorerSettings,
    useExplorerStore,
} from "./store"
import type { IPosition, IRange, ModuleLocation, TModuleId } from "./types"

type TextModel = ReturnType<Monaco["editor"]["createModel"]>
type Location = { uri: TextModel["uri"]; range: IRange }

const COPY_COMMAND = "webpackI18nHover.copy"

function isWebpackModule(text: string) {
    return (
        text.startsWith("// Webpack Module ") ||
        text.substring(0, 100).includes("//OPEN FULL MODULE:")
    )
}

function currentModule(model: TextModel) {
    if (!isWebpackModule(model.getValue())) return undefined

    const parsed = parseModuleURI(model.uri)
    const { buildHash, buildService } = useExplorerStore.getState()

    if (!parsed || !buildService || parsed.buildHash !== buildHash) {
        return undefined
    }

    return { moduleId: parsed.moduleId, buildService }
}

let intlKeys: Promise<Record<string, string>> | null = null

async function tryMapIntlKey(hashedKey: string) {
    intlKeys ??= import("./lsp/intl-keys.json").then(
        (mod) => mod.default as Record<string, string>,
    )
    const keys = await intlKeys
    return Object.hasOwn(keys, hashedKey) ? keys[hashedKey] : null
}

async function toLocations(defs: ModuleLocation[]): Promise<Location[]> {
    return Promise.all(
        defs.map(async ({ id, range }) => ({
            uri: (await getModuleModel(id)).uri,
            range,
        })),
    )
}

function positionToSearch(
    selectionOrPosition: IRange | IPosition | undefined,
): ViewSearch | undefined {
    if (!selectionOrPosition) return undefined

    if ("startLineNumber" in selectionOrPosition) {
        return {
            sl: selectionOrPosition.startLineNumber,
            sc: selectionOrPosition.startColumn,
            el: selectionOrPosition.endLineNumber,
            ec: selectionOrPosition.endColumn,
        }
    }

    return {
        sl: selectionOrPosition.lineNumber,
        sc: selectionOrPosition.column,
        el: selectionOrPosition.lineNumber,
        ec: selectionOrPosition.column,
    }
}

function register() {
    monaco.languages.registerHoverProvider("javascript", {
        async provideHover(model, position) {
            try {
                const current = currentModule(model)
                if (!current) return

                const hover = await current.buildService.generateHover(
                    current.moduleId,
                    {
                        lineNumber: position.lineNumber,
                        column: position.column,
                    },
                )
                if (!hover) return

                if (hover.i18nKey) {
                    const unhashed = await tryMapIntlKey(hover.i18nKey)
                    const args = encodeURIComponent(
                        JSON.stringify([
                            { hashedKey: hover.i18nKey, unhashed },
                        ]),
                    )

                    return {
                        range: hover.range,
                        contents: [
                            {
                                value:
                                    unhashed ??
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
            } catch (e) {
                console.error(e)
            }
        },
    })

    monaco.editor.registerCommand(
        COPY_COMMAND,
        (
            _accessor,
            {
                hashedKey,
                unhashed,
            }: { hashedKey: string; unhashed: string | null },
        ) => {
            void navigator.clipboard.writeText(
                unhashed
                    ? `#{intl::${unhashed}}`
                    : `#{intl::${hashedKey}::raw}`,
            )
        },
    )

    monaco.languages.registerDefinitionProvider("javascript", {
        async provideDefinition(model, position) {
            try {
                const current = currentModule(model)
                if (!current) return

                return toLocations(
                    await current.buildService.generateDefinitions(
                        current.moduleId,
                        {
                            lineNumber: position.lineNumber,
                            column: position.column,
                        },
                    ),
                )
            } catch (e) {
                console.error(e)
            }
        },
    })

    monaco.languages.registerReferenceProvider("javascript", {
        async provideReferences(model, position) {
            try {
                const current = currentModule(model)
                if (!current) return

                return toLocations(
                    await current.buildService.generateReferences(
                        current.moduleId,
                        {
                            lineNumber: position.lineNumber,
                            column: position.column,
                        },
                    ),
                )
            } catch (e) {
                console.error(e)
            }
        },
    })

    monaco.editor.registerEditorOpener({
        openCodeEditor(_source, resource, selectionOrPosition) {
            const parsed = parseModuleURI(resource)
            if (!parsed) return false

            const search = positionToSearch(selectionOrPosition)

            if (useExplorerSettings.getState().openModulesInNewTab) {
                window.open(
                    viewHref(parsed.buildHash, parsed.moduleId, search),
                    "_blank",
                    "noopener,noreferrer",
                )
            } else {
                useExplorerStore
                    .getState()
                    .navigate(parsed.moduleId as TModuleId, search)
            }

            return true
        },
    })
}

let registered = false

export function registerLSPHandlers() {
    if (registered) return
    registered = true
    register()
}
