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

let highlighterPromise: ReturnType<typeof createHighlighter> | undefined
const setupPromises = new Map<string, Promise<void>>()

// shikiToMonaco only adds tokenizers for the languages loaded so far, so it runs again for each new one
export function setupMonaco(language: "javascript" | "java" = "javascript") {
    let setupPromise = setupPromises.get(language)

    if (!setupPromise) {
        highlighterPromise ??= createHighlighter({
            themes: editorThemes.map((theme) => theme.id),
            langs: [],
            engine: createJavaScriptRegexEngine(),
        })
        setupPromise = highlighterPromise.then(async (highlighter) => {
            await highlighter.loadLanguage(language)
            shikiToMonaco(highlighter, monaco)
        })
        setupPromises.set(language, setupPromise)
    }

    return setupPromise
}

export { monaco }
