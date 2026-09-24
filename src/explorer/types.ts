export type ReleaseChannel = "stable" | "canary"

export interface Build {
    hash: string
    number: number
    firstSeen: number
    channels: ReleaseChannel[]
}

export interface ModuleDeps {
    syncUses: number[]
    lazyUses: number[]
}

export interface ModulePosition {
    lineNumber: number
    column: number
}

export interface ModuleRange {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
}

export interface ModuleLocation {
    moduleId: number
    range: ModuleRange
}

export interface ModuleHover {
    content: string
    range: ModuleRange
    i18nKey?: string
}

export interface SearchResults {
    moduleIds: Uint32Array
    rawIndices: Uint32Array
}

export interface SearchResult {
    lineNumber: number
    column: number
    preview: string
}

export interface SearchLocation {
    lineNumber: number
    column: number
}

export interface ModuleGraph {
    nodes: {
        id: string
        position: { x: number; y: number }
        width: number
        height: number
    }[]
    edges: { id: string; source: string; target: string }[]
}
