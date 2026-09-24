import * as comlink from "comlink"
import { SERVER_BASE_URL } from "../config"
import initWasm, {
    type Bundle,
    type ExportTreeNode,
    get_bundle,
    MonacoPosition,
    type MonacoRange,
    set_server_base_url,
} from "../libsadancore/libsadancore.js"
import type {
    ModuleDeps,
    ModuleGraph,
    ModuleHover,
    ModuleLocation,
    ModulePosition,
    ModuleRange,
    SearchLocation,
    SearchResult,
    SearchResults,
} from "../types"
import { exposeWorker } from "./expose"

function toRange({ start, end }: MonacoRange): ModuleRange {
    return {
        startLineNumber: start.line,
        startColumn: start.column,
        endLineNumber: end.line,
        endColumn: end.column,
    }
}

function toWasmPosition({ lineNumber, column }: ModulePosition) {
    return new MonacoPosition(lineNumber, column)
}

export class BundleWorker {
    #bundle: Bundle | null = null
    #loading: Promise<Bundle> | null = null

    async loadBuild(buildHash: string) {
        if (this.#bundle) return

        this.#loading ??= this.loadBundle(buildHash)
        this.#bundle = await this.#loading
    }

    async loadBundle(buildHash: string) {
        await initWasm()
        set_server_base_url(SERVER_BASE_URL)
        return get_bundle(buildHash, true)
    }

    get bundle() {
        if (!this.#bundle) throw new Error("Build has not been loaded")
        return this.#bundle
    }

    hasModule(moduleId: number) {
        return this.bundle.has_id(moduleId)
    }

    getModuleSource(moduleId: number) {
        return this.bundle.get_module_text(moduleId)
    }

    getModuleExports(moduleId: number) {
        return this.bundle.get_module_export_map(moduleId) as ExportTreeNode[]
    }

    getModuleDependencies(moduleId: number) {
        return this.bundle.get_module_dependencies(moduleId) as ModuleDeps
    }

    getModuleDependents(moduleId: number) {
        return this.bundle.get_module_deps(moduleId) as ModuleDeps | undefined
    }

    async getDefinitions(moduleId: number, position: ModulePosition) {
        const locations = await this.bundle.provide_definition(
            moduleId,
            toWasmPosition(position),
        )

        return locations.map(({ id, range }): ModuleLocation => ({
            moduleId: id,
            range: toRange(range),
        }))
    }

    async getReferences(moduleId: number, position: ModulePosition) {
        const locations = await this.bundle.provide_references(
            moduleId,
            toWasmPosition(position),
        )

        return locations.map(({ id, range }): ModuleLocation => ({
            moduleId: id,
            range: toRange(range),
        }))
    }

    async getHover(moduleId: number, position: ModulePosition) {
        const hover = await this.bundle.provide_hover(
            moduleId,
            toWasmPosition(position),
        )
        if (!hover) return undefined

        return {
            content: hover.content,
            range: toRange(hover.range),
            i18nKey: hover.i18n_key,
        } satisfies ModuleHover
    }

    getModuleIds() {
        const moduleIds = this.bundle.get_id_list()
        return comlink.transfer(moduleIds, [moduleIds.buffer])
    }

    searchModules(query: string, useRegex: boolean) {
        const results = this.bundle.search_modules(query, useRegex)
        return comlink.transfer(results as SearchResults, [
            results.moduleIds.buffer,
            results.rawIndices.buffer,
        ])
    }

    getSearchResult(moduleId: number, rawIndex: number) {
        return this.bundle.get_search_result_info(
            moduleId,
            rawIndex,
            false,
        ) as SearchResult
    }

    getSearchLocation(moduleId: number, rawIndex: number) {
        return this.bundle.get_search_location(
            moduleId,
            rawIndex,
        ) as SearchLocation
    }

    getModuleGraph(moduleId: number, depth: number): ModuleGraph {
        const graph = this.bundle.gen_graph(moduleId, depth)

        return {
            nodes: graph.nodes.map(({ id, x, y, width, height }) => ({
                id: String(id),
                position: { x, y },
                width,
                height,
            })),
            edges: graph.edges.map(({ from, to }) => ({
                id: `${from}->${to}`,
                source: String(from),
                target: String(to),
            })),
        }
    }
}

export type BundleWorkerApi = BundleWorker

exposeWorker(new BundleWorker())
