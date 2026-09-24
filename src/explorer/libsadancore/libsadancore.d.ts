/* tslint:disable */
/* eslint-disable */

export interface BundleSearchResults {
    moduleIds: Uint32Array;
    rawIndices: Uint32Array;
}

export interface BundleSearchResultInfo {
    lineNumber: number;
    column: number;
    preview: string;
}

export interface BundleSearchLocation {
    lineNumber: number;
    column: number;
}

export interface MonacoRangeJs {
    start: { line: number; column: number };
    end: { line: number; column: number };
}

export interface ExportTreeNode {
    name: string;
    hover?: string;
    ranges: MonacoRangeJs[];
    children: ExportTreeNode[];
}

export interface Bundle {
    get_module_deps(module_id: number): {
        syncUses: number[];
        lazyUses: number[];
    } | undefined;
    get_module_dependencies(module_id: number): {
        syncUses: number[];
        lazyUses: number[];
    };
    search_modules(query: string, regex: boolean): BundleSearchResults;
    get_search_result_info(module_id: number, raw_index: number, long_preview: boolean): BundleSearchResultInfo;
    get_search_location(module_id: number, raw_index: number): BundleSearchLocation;
    get_module_export_map(module_id: number): ExportTreeNode[];
}



export class Bundle {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Depth defaults to 1.
     */
    gen_graph(module_id: number, depth?: number | null): LaidOutGraph;
    get_id_list(): Uint32Array;
    get_module_dependencies(module_id: number): any;
    get_module_export_map(module_id: number): any;
    get_module_text(module_id: number): string;
    get_search_location(module_id: number, raw_index: number): any;
    get_search_result_info(module_id: number, raw_index: number, long_preview: boolean): any;
    has_id(module_id: number): boolean;
    /**
     * line and column are 1-based
     */
    provide_definition(module_id: number, m_pos: MonacoPosition): Promise<ModuleLocation[]>;
    provide_hover(module_id: number, m_pos: MonacoPosition): Promise<HoverInfo | undefined>;
    provide_references(module_id: number, m_pos: MonacoPosition): Promise<ModuleLocation[]>;
}

export class HoverInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly range: MonacoRange;
    readonly content: string;
    readonly i18n_key: string | undefined;
}

export class JSEdge {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly from: number;
    readonly to: number;
}

export class JSNode {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    height: number;
    width: number;
    x: number;
    y: number;
    readonly id: number;
}

export class LaidOutGraph {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly edges: JSEdge[];
    readonly nodes: JSNode[];
}

export class Meta {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static sort_newest_first(a: Meta, b: Meta): number;
    readonly build_hash: string;
    readonly build_number: number;
    readonly channels: string[];
    readonly entry_point: number | undefined;
    readonly first_seen: bigint;
}

export class ModuleLocation {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly id: number;
    readonly range: MonacoRange;
}

export class MonacoPosition {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new [`MonacoPosition`]
     *
     * line and column are 1-based
     */
    constructor(line: number, column: number);
    /**
     * 1-based
     */
    column: number;
    /**
     * 1-based
     */
    line: number;
}

/**
 * 1-based
 */
export class MonacoRange {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 1-based
     */
    readonly end: MonacoPosition;
    /**
     * 1-based
     */
    readonly start: MonacoPosition;
}

export function get_builds(): Promise<Meta[]>;

export function get_bundle(build_hash: string, drop_sources: boolean): Promise<Bundle>;

/**
 * Points every request at another explorer_server compatible host.
 */
export function set_server_base_url(url: string): void;

export function start_(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_bundle_free: (a: number, b: number) => void;
    readonly __wbg_get_hoverinfo_range: (a: number) => number;
    readonly __wbg_get_jsnode_height: (a: number) => number;
    readonly __wbg_get_jsnode_width: (a: number) => number;
    readonly __wbg_get_jsnode_x: (a: number) => number;
    readonly __wbg_get_jsnode_y: (a: number) => number;
    readonly __wbg_get_modulelocation_id: (a: number) => number;
    readonly __wbg_get_modulelocation_range: (a: number) => number;
    readonly __wbg_get_monacoposition_column: (a: number) => number;
    readonly __wbg_get_monacoposition_line: (a: number) => number;
    readonly __wbg_get_monacorange_end: (a: number) => number;
    readonly __wbg_get_monacorange_start: (a: number) => number;
    readonly __wbg_hoverinfo_free: (a: number, b: number) => void;
    readonly __wbg_jsedge_free: (a: number, b: number) => void;
    readonly __wbg_jsnode_free: (a: number, b: number) => void;
    readonly __wbg_laidoutgraph_free: (a: number, b: number) => void;
    readonly __wbg_meta_free: (a: number, b: number) => void;
    readonly __wbg_modulelocation_free: (a: number, b: number) => void;
    readonly __wbg_monacoposition_free: (a: number, b: number) => void;
    readonly __wbg_monacorange_free: (a: number, b: number) => void;
    readonly __wbg_set_jsnode_height: (a: number, b: number) => void;
    readonly __wbg_set_jsnode_width: (a: number, b: number) => void;
    readonly __wbg_set_jsnode_x: (a: number, b: number) => void;
    readonly __wbg_set_jsnode_y: (a: number, b: number) => void;
    readonly __wbg_set_monacoposition_column: (a: number, b: number) => void;
    readonly __wbg_set_monacoposition_line: (a: number, b: number) => void;
    readonly bundle_gen_graph: (a: number, b: number, c: number) => number;
    readonly bundle_get_id_list: (a: number, b: number) => void;
    readonly bundle_get_module_dependencies: (a: number, b: number, c: number) => void;
    readonly bundle_get_module_deps: (a: number, b: number) => number;
    readonly bundle_get_module_export_map: (a: number, b: number, c: number) => void;
    readonly bundle_get_module_text: (a: number, b: number, c: number) => void;
    readonly bundle_get_search_location: (a: number, b: number, c: number, d: number) => void;
    readonly bundle_get_search_result_info: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly bundle_has_id: (a: number, b: number) => number;
    readonly bundle_provide_definition: (a: number, b: number, c: number) => number;
    readonly bundle_provide_hover: (a: number, b: number, c: number) => number;
    readonly bundle_provide_references: (a: number, b: number, c: number) => number;
    readonly bundle_search_modules: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly get_builds: () => number;
    readonly get_bundle: (a: number, b: number, c: number) => number;
    readonly hoverinfo_content: (a: number, b: number) => void;
    readonly hoverinfo_i18n_key: (a: number, b: number) => void;
    readonly jsedge_from: (a: number) => number;
    readonly jsedge_to: (a: number) => number;
    readonly jsnode_id: (a: number) => number;
    readonly laidoutgraph_edges: (a: number, b: number) => void;
    readonly laidoutgraph_nodes: (a: number, b: number) => void;
    readonly meta_build_hash: (a: number, b: number) => void;
    readonly meta_build_number: (a: number) => number;
    readonly meta_channels: (a: number, b: number) => void;
    readonly meta_entry_point: (a: number) => number;
    readonly meta_first_seen: (a: number) => bigint;
    readonly meta_sort_newest_first: (a: number, b: number) => number;
    readonly monacoposition_new: (a: number, b: number) => number;
    readonly set_server_base_url: (a: number, b: number) => void;
    readonly start_: () => void;
    readonly rust_zstd_wasm_shim_calloc: (a: number, b: number) => number;
    readonly rust_zstd_wasm_shim_free: (a: number) => void;
    readonly rust_zstd_wasm_shim_malloc: (a: number) => number;
    readonly rust_zstd_wasm_shim_memcmp: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_memcpy: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_memmove: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_memset: (a: number, b: number, c: number) => number;
    readonly rust_zstd_wasm_shim_qsort: (a: number, b: number, c: number, d: number) => void;
    readonly __wasm_bindgen_func_elem_1229: (a: number, b: number, c: number, d: number) => void;
    readonly __wasm_bindgen_func_elem_1233: (a: number, b: number, c: number, d: number) => void;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_export3: (a: number) => void;
    readonly __wbindgen_export4: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export5: (a: number, b: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
