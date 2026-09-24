import { useEffect, useRef, useState } from "react"
import { monaco } from "../monaco"
import type { ViewSearch } from "../routes"
import {
    getModuleModel,
    parseModuleURI,
    placeholderModel,
    useExplorerSettings,
    useExplorerStore,
} from "../store"
import type { TModuleId } from "../types"

type Editor = ReturnType<typeof monaco.editor.create>

function applySearch(editor: Editor, { sl, sc, el, ec }: ViewSearch) {
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

export default function CodeView({ search }: { search: ViewSearch }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [editor, setEditor] = useState<Editor | null>(null)
    const moduleId = useExplorerStore((s) => s.selectedModule)
    const buildService = useExplorerStore((s) => s.buildService)
    const theme = useExplorerSettings((s) => s.editorTheme)

    useEffect(() => {
        const created = monaco.editor.create(containerRef.current!, {
            model: placeholderModel("// Select a module"),
            readOnly: true,
            automaticLayout: true,
            theme,
            fontSize: 13,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
        })
        setEditor(created)

        return () => created.dispose()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        monaco.editor.setTheme(theme)
    }, [theme])

    const { sl, sc, el, ec } = search

    useEffect(() => {
        if (!editor || !buildService) return

        if (moduleId == null) {
            editor.setModel(placeholderModel("// Select a module"))
            return
        }

        let cancelled = false

        const shown = editor.getModel()
        if (!shown || parseModuleURI(shown.uri)?.moduleId !== moduleId) {
            editor.setModel(placeholderModel(`// Loading module ${moduleId}…`))
        }

        getModuleModel(moduleId as TModuleId).then(
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
    }, [editor, buildService, moduleId, sl, sc, el, ec])

    return <div ref={containerRef} className="size-full" />
}
