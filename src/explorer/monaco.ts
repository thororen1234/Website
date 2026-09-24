import * as monaco from "monaco-editor/editor/editor.api.js"
import "monaco-editor/languages/definitions/javascript/register.js"
import "monaco-editor/languages/features/typescript/register.js"
import "monaco-editor/features/find/register.js"
import "monaco-editor/editor/browser/coreCommands.js"
import "monaco-editor/editor/browser/widget/codeEditor/codeEditorWidget.js"
import "monaco-editor/editor/common/standaloneStrings.js"
import "monaco-editor/editor/contrib/bracketMatching/browser/bracketMatching.js"
import "monaco-editor/editor/contrib/clipboard/browser/clipboard.js"
import "monaco-editor/editor/contrib/contextmenu/browser/contextmenu.js"
import "monaco-editor/editor/contrib/cursorUndo/browser/cursorUndo.js"
import "monaco-editor/editor/contrib/documentSymbols/browser/documentSymbols.js"
import "monaco-editor/editor/contrib/find/browser/findController.js"
import "monaco-editor/editor/contrib/folding/browser/folding.js"
import "monaco-editor/editor/contrib/fontZoom/browser/fontZoom.js"
import "monaco-editor/editor/contrib/gotoSymbol/browser/goToCommands.js"
import "monaco-editor/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.js"
import "monaco-editor/editor/contrib/hover/browser/hoverContribution.js"
import "monaco-editor/editor/contrib/links/browser/links.js"
import "monaco-editor/editor/contrib/multicursor/browser/multicursor.js"
import "monaco-editor/editor/contrib/readOnlyMessage/browser/contribution.js"
import "monaco-editor/editor/contrib/smartSelect/browser/smartSelect.js"
import "monaco-editor/editor/contrib/stickyScroll/browser/stickyScrollContribution.js"
import "monaco-editor/editor/contrib/tokenization/browser/tokenization.js"
import "monaco-editor/editor/contrib/wordHighlighter/browser/wordHighlighter.js"
import "monaco-editor/editor/contrib/wordOperations/browser/wordOperations.js"
import "monaco-editor/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js"
import "monaco-editor/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js"
import "monaco-editor/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js"
import "monaco-editor/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js"
import "monaco-editor/features/codicon/register.js"
import { shikiToMonaco } from "@shikijs/monaco"
import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import { EDITOR_THEMES } from "./themes"

export { monaco }
export type Monaco = typeof monaco

globalThis.MonacoEnvironment = {
    getWorker(_moduleId, label) {
        if (label === "typescript" || label === "javascript") {
            return new Worker(
                new URL("./worker/monaco-ts.worker.ts", import.meta.url),
                { type: "module", name: "monaco-ts" },
            )
        }
        return new Worker(
            new URL("./worker/monaco-editor.worker.ts", import.meta.url),
            { type: "module", name: "monaco-editor" },
        )
    },
}

let ready: Promise<void> | null = null

export function setupMonaco() {
    ready ??= (async () => {
        const highlighter = await createHighlighterCore({
            themes: EDITOR_THEMES.map(({ load }) => load()),
            langs: [import("shiki/langs/javascript.mjs")],
            engine: createJavaScriptRegexEngine(),
        })

        shikiToMonaco(highlighter, monaco as never)
    })()

    return ready
}
