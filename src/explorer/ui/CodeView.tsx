import { useEffect, useRef, useState } from "react"
import { monaco } from "../monaco"
import type { CodeSelection } from "../routes"
import {
    getModuleModel,
    parseModuleUri,
    placeholderModel,
    useExplorerSettings,
    useExplorerStore,
} from "../store"

type Editor = ReturnType<typeof monaco.editor.create>

function applySearch(editor: Editor, { sl, sc, el, ec }: CodeSelection) {
    if (sl == null || sc == null) return

    if (el == null || ec == null || (sl === el && sc === ec)) {
        const position = { lineNumber: sl, column: sc }
        editor.setPosition(position)
        editor.revealPositionInCenter(position)
    } else {
        const range = {
            startLineNumber: sl,
            startColumn: sc,
            endLineNumber: el,
            endColumn: ec,
        }
        editor.setSelection(range)
        editor.revealRangeInCenter(range)
    }
}

export default function CodeView({ search }: { search: CodeSelection }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [editor, setEditor] = useState<Editor | null>(null)
    const moduleId = useExplorerStore((s) => s.selectedModule)
    const bundleApi = useExplorerStore((s) => s.bundleApi)
    const theme = useExplorerSettings((s) => s.editorTheme)

    useEffect(() => {
        const created = monaco.editor.create(containerRef.current!, {
            model: placeholderModel("// Select a module"),
            readOnly: true,
            automaticLayout: true,
            fontSize: 13,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
        })
        setEditor(created)

        return () => created.dispose()
    }, [])

    useEffect(() => {
        monaco.editor.setTheme(theme)
    }, [theme])

    const { sl, sc, el, ec } = search

    useEffect(() => {
        if (!editor || !bundleApi) return

        if (moduleId == null) {
            editor.setModel(placeholderModel("// Select a module"))
            return
        }

        let cancelled = false

        const shown = editor.getModel()
        if (!shown || parseModuleUri(shown.uri)?.moduleId !== moduleId) {
            editor.setModel(placeholderModel(`// Loading module ${moduleId}…`))
        }

        getModuleModel(moduleId).then(
            (model) => {
                if (cancelled) return
                if (editor.getModel() !== model) editor.setModel(model)
                applySearch(editor, { sl, sc, el, ec })
            },
            (error) => {
                if (cancelled) return
                console.error(error)
                editor.setModel(
                    placeholderModel(
                        `// Failed to load module ${moduleId}\n// ${error instanceof Error ? error.message : error}`,
                    ),
                )
            },
        )

        return () => {
            cancelled = true
        }
    }, [editor, bundleApi, moduleId, sl, sc, el, ec])

    return <div ref={containerRef} className="size-full" />
}
