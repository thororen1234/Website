import * as monaco from "monaco-editor"
import { shikiToMonaco } from "@shikijs/monaco"
import { createHighlighter } from "shiki"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import { editorThemes } from "./themes"

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === "javascript" || label === "typescript") {
            return new Worker(
                new URL("./worker/monaco-ts.worker.ts", import.meta.url),
                { type: "module" },
            )
        }
        return new Worker(
            new URL("./worker/monaco-editor.worker.ts", import.meta.url),
            { type: "module" },
        )
    },
}

let setupPromise: Promise<void> | undefined

export function setupMonaco() {
    setupPromise ??= createHighlighter({
        themes: editorThemes.map((theme) => theme.id),
        langs: ["javascript"],
        engine: createJavaScriptRegexEngine(),
    }).then((highlighter) => shikiToMonaco(highlighter, monaco))

    return setupPromise
}

export { monaco }
