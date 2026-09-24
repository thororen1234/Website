export type TBundleHash = string & { readonly __brand: "TBundleHash" }
export type TModuleId = number & { readonly __brand: "TModuleId" }

export interface IRange {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
}

export interface IPosition {
    lineNumber: number
    column: number
}

export type ReleaseChannel = "stable" | "canary"

export interface BuildMeta {
    build_hash: string
    build_number: number
    entry_point: number | undefined
    first_seen: bigint
    channels: ReleaseChannel[]
}

export interface ModuleLocation {
    range: IRange
    id: TModuleId
}

export interface HoverInfo {
    content: string
    range: IRange
    i18nKey?: string
}

export interface BundleSearchResults {
    moduleIds: Uint32Array
    rawIndices: Uint32Array
}

export interface ModuleDeps {
    syncUses: TModuleId[]
    lazyUses: TModuleId[]
}

export interface GraphNode {
    id: string
    data: { label: string }
    position: { x: number; y: number }
    width: number
    height: number
}

export interface GraphEdge {
    id: string
    source: string
    target: string
}

export interface GeneratedGraph {
    nodes: GraphNode[]
    edges: GraphEdge[]
}
