import { androidSourcesUrl } from "../config"
import type { ModulePosition, SourceMatch, SourceSearchResults } from "../types"
import { exposeWorker } from "./expose"

const MAX_FILE_RESULTS = 500
const MAX_TEXT_RESULTS = 1000
const MAX_PREVIEW_LENGTH = 200

type IndexEntry = [path: string, start: number, end: number]

interface Sources {
    // Every file concatenated, sliced per file instead of split up front
    text: string
    paths: string[]
    starts: Float64Array
    ends: Float64Array
}

export class SourcesWorker {
    #sources: Sources | null = null
    #loading: Promise<Sources> | null = null

    async loadSources(versionCode: number) {
        if (this.#sources) return

        this.#loading ??= this.fetchSources(versionCode)
        this.#sources = await this.#loading
    }

    // The first line is a JSON index of [path, start, end], offsets count from after it
    async fetchSources(versionCode: number): Promise<Sources> {
        const res = await fetch(androidSourcesUrl(versionCode))
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const body = await res.text()
        const newline = body.indexOf("\n")
        const index = JSON.parse(body.slice(0, newline)) as IndexEntry[]
        const base = newline + 1

        const paths = new Array<string>(index.length)
        const starts = new Float64Array(index.length)
        const ends = new Float64Array(index.length)
        index.forEach(([path, start, end], i) => {
            paths[i] = path
            starts[i] = base + start
            ends[i] = base + end
        })

        return { text: body, paths, starts, ends }
    }

    get sources() {
        if (!this.#sources) throw new Error("Sources have not been loaded")
        return this.#sources
    }

    getPaths() {
        return this.sources.paths
    }

    getFileSource(file: number) {
        const { text, starts, ends } = this.sources
        return text.slice(starts[file], ends[file])
    }

    // Ranks exact file names, then names starting with the query, then other name and path matches
    searchFiles(query: string) {
        const needle = query.toLowerCase()
        const ranks: number[][] = [[], [], [], []]

        this.sources.paths.forEach((path, file) => {
            const lower = path.toLowerCase()
            if (!lower.includes(needle)) return

            const name = lower.slice(lower.lastIndexOf("/") + 1)
            const at = name.indexOf(needle)
            const rank =
                name === needle || name === `${needle}.java`
                    ? 0
                    : at === 0
                      ? 1
                      : at > 0
                        ? 2
                        : 3
            ranks[rank].push(file)
        })

        const files = ranks.flat()
        return {
            files: files.slice(0, MAX_FILE_RESULTS),
            capped: files.length > MAX_FILE_RESULTS,
        }
    }

    searchText(query: string, useRegex: boolean): SourceSearchResults {
        const { text, starts, ends } = this.sources
        const matches: SourceMatch[] = []
        const cursor = { file: -1, offset: 0, lineNumber: 1, lineStart: 0 }

        // Moves forward from the last match when it was in the same file
        const positionAt = (file: number, offset: number): ModulePosition => {
            if (cursor.file !== file || offset < cursor.offset) {
                cursor.file = file
                cursor.offset = cursor.lineStart = starts[file]
                cursor.lineNumber = 1
            }

            let newline = text.indexOf("\n", cursor.offset)
            while (newline >= 0 && newline < offset) {
                cursor.lineNumber++
                cursor.lineStart = newline + 1
                newline = text.indexOf("\n", cursor.lineStart)
            }
            cursor.offset = offset

            return {
                lineNumber: cursor.lineNumber,
                column: offset - cursor.lineStart + 1,
            }
        }

        const addMatch = (start: number, end: number) => {
            const file = fileAt(starts, start)
            if (file < 0 || end > ends[file]) return

            const startPosition = positionAt(file, start)
            const lineStart = cursor.lineStart
            const endPosition = positionAt(file, end)
            const lineEnd = text.indexOf("\n", start)

            matches.push({
                file,
                range: {
                    startLineNumber: startPosition.lineNumber,
                    startColumn: startPosition.column,
                    endLineNumber: endPosition.lineNumber,
                    endColumn: endPosition.column,
                },
                preview: preview(
                    text.slice(
                        lineStart,
                        lineEnd < 0 || lineEnd > ends[file]
                            ? ends[file]
                            : lineEnd,
                    ),
                    start - lineStart,
                ),
            })
        }

        const textStart = starts.length ? starts[0] : 0

        if (useRegex) {
            const regex = new RegExp(query, "gm")
            regex.lastIndex = textStart

            for (
                let match = regex.exec(text);
                match && matches.length < MAX_TEXT_RESULTS;
                match = regex.exec(text)
            ) {
                if (match[0].length === 0) {
                    regex.lastIndex++
                    continue
                }
                addMatch(match.index, match.index + match[0].length)
            }

            return { matches, capped: matches.length >= MAX_TEXT_RESULTS }
        }

        for (
            let at = text.indexOf(query, textStart);
            at >= 0 && matches.length < MAX_TEXT_RESULTS;
            at = text.indexOf(query, at + query.length)
        ) {
            addMatch(at, at + query.length)
        }

        return { matches, capped: matches.length >= MAX_TEXT_RESULTS }
    }
}

// Index of the file containing offset, by binary search over the file starts
function fileAt(starts: Float64Array, offset: number) {
    let low = 0
    let high = starts.length - 1

    while (low <= high) {
        const mid = (low + high) >> 1
        if (starts[mid] <= offset) low = mid + 1
        else high = mid - 1
    }

    return high
}

function preview(line: string, column: number) {
    const indent = line.length - line.trimStart().length
    const from = Math.max(indent, column - MAX_PREVIEW_LENGTH / 2)
    return line.slice(from, from + MAX_PREVIEW_LENGTH).trimEnd()
}

export type SourcesWorkerApi = SourcesWorker

exposeWorker(new SourcesWorker())
