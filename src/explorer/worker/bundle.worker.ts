/// <reference lib="webworker" />
import * as comlink from "comlink"
import { SERVER_BASE_URL } from "../config"
import initWasm, {
    type Bundle,
    type BundleSearchLocation,
    type BundleSearchResultInfo,
    type ExportTreeNode,
    get_bundle,
    type HoverInfo as RawHoverInfo,
    type LaidOutGraph,
    type ModuleLocation as RawModuleLocation,
    MonacoPosition,
    type MonacoRange,
    set_server_base_url,
} from "../libsadancore/libsadancore.js"
import type {
    BundleSearchResults,
    GeneratedGraph,
    HoverInfo,
    IPosition,
    IRange,
    ModuleDeps,
    ModuleLocation,
    TBundleHash,
    TModuleId,
} from "../types"
import { exposeToClients } from "./expose"

function convertRange({
    start: { line: startLineNumber, column: startColumn },
    end: { line: endLineNumber, column: endColumn },
}: MonacoRange): IRange {
    return { startLineNumber, startColumn, endLineNumber, endColumn }
}

function convertModuleLocation({
    id,
    range,
}: RawModuleLocation): ModuleLocation {
    return { id: id as TModuleId, range: convertRange(range) }
}

function convertHoverInfo({
    content,
    range,
    i18n_key: i18nKey,
}: RawHoverInfo): HoverInfo {
    return { content, range: convertRange(range), i18nKey }
}

function convertGraph(raw: LaidOutGraph): GeneratedGraph {
    return {
        nodes: raw.nodes.map(({ id, width, height, x, y }) => ({
            id: `${id}`,
            data: { label: `${id}` },
            position: { x, y },
            width,
            height,
        })),
        edges: raw.edges.map(({ from, to }) => ({
            id: `${from}->${to}`,
            source: `${from}`,
            target: `${to}`,
        })),
    }
}

function toMonacoPosition({ lineNumber, column }: IPosition) {
    return new MonacoPosition(lineNumber, column)
}

class BuildService {
    #bundleHash: TBundleHash | null = null
    #bundle: Bundle | null = null

    async init(hash: TBundleHash) {
        if (this.#bundleHash && this.#bundleHash !== hash) {
            throw new Error(
                "Worker already initialized with a different bundle hash",
            )
        }
        this.#bundleHash = hash
        if (this.#bundle == null) {
            await initWasm()
            set_server_base_url(SERVER_BASE_URL)
            this.#bundle = await get_bundle(hash, true)
        }
    }

    get #b(): Bundle {
        if (!this.#bundle) throw new Error("Bundle not loaded")
        return this.#bundle
    }

    hasId(moduleId: number): boolean {
        return this.#b.has_id(moduleId)
    }

    getFormattedSource(moduleId: TModuleId): string {
        return this.#b.get_module_text(moduleId)
    }

    async generateDefinitions(moduleId: TModuleId, position: IPosition) {
        const raw = await this.#b.provide_definition(
            moduleId,
            toMonacoPosition(position),
        )
        return raw.map(convertModuleLocation)
    }

    async generateReferences(moduleId: TModuleId, position: IPosition) {
        const raw = await this.#b.provide_references(
            moduleId,
            toMonacoPosition(position),
        )
        return raw.map(convertModuleLocation)
    }

    async generateHover(moduleId: TModuleId, position: IPosition) {
        const hover = await this.#b.provide_hover(
            moduleId,
            toMonacoPosition(position),
        )
        return hover && convertHoverInfo(hover)
    }

    getAllModuleIds(): Uint32Array {
        const ids = this.#b.get_id_list()
        return comlink.transfer(ids, [ids.buffer])
    }

    searchModules(query: string, regex: boolean): BundleSearchResults {
        const { moduleIds, rawIndices } = this.#b.search_modules(
            query,
            regex,
        ) as BundleSearchResults
        return comlink.transfer({ moduleIds, rawIndices }, [
            moduleIds.buffer,
            rawIndices.buffer,
        ])
    }

    getSearchResultInfo(
        moduleId: TModuleId,
        rawIndex: number,
        longPreview: boolean,
    ): BundleSearchResultInfo {
        return this.#b.get_search_result_info(moduleId, rawIndex, longPreview)
    }

    getSearchLocation(
        moduleId: TModuleId,
        rawIndex: number,
    ): BundleSearchLocation {
        return this.#b.get_search_location(moduleId, rawIndex)
    }

    generateModuleGraph(moduleId: TModuleId, depth: number): GeneratedGraph {
        return convertGraph(this.#b.gen_graph(moduleId, depth))
    }

    getModuleExportMap(moduleId: TModuleId): ExportTreeNode[] {
        return this.#b.get_module_export_map(moduleId)
    }

    getModuleDependencies(moduleId: TModuleId): ModuleDeps {
        return this.#b.get_module_dependencies(moduleId) as ModuleDeps
    }

    getModuleDependents(moduleId: TModuleId): ModuleDeps | undefined {
        return this.#b.get_module_deps(moduleId) as ModuleDeps | undefined
    }
}

export type RawBuildService = BuildService

exposeToClients(new BuildService())
