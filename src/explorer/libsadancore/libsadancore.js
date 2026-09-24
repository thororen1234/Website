/* @ts-self-types="./libsadancore.d.ts" */

export class Bundle {
    static __wrap(ptr) {
        const obj = Object.create(Bundle.prototype);
        obj.__wbg_ptr = ptr;
        BundleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BundleFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bundle_free(ptr, 0);
    }
    /**
     * Depth defaults to 1.
     * @param {number} module_id
     * @param {number | null} [depth]
     * @returns {LaidOutGraph}
     */
    gen_graph(module_id, depth) {
        const ret = wasm.bundle_gen_graph(this.__wbg_ptr, module_id, isLikeNone(depth) ? 0xFFFFFF : depth);
        return LaidOutGraph.__wrap(ret);
    }
    /**
     * @returns {Uint32Array}
     */
    get_id_list() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bundle_get_id_list(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export4(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} module_id
     * @returns {any}
     */
    get_module_dependencies(module_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bundle_get_module_dependencies(retptr, this.__wbg_ptr, module_id);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} module_id
     * @returns {any | undefined}
     */
    get_module_deps(module_id) {
        const ret = wasm.bundle_get_module_deps(this.__wbg_ptr, module_id);
        return takeObject(ret);
    }
    /**
     * @param {number} module_id
     * @returns {any}
     */
    get_module_export_map(module_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bundle_get_module_export_map(retptr, this.__wbg_ptr, module_id);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} module_id
     * @returns {string}
     */
    get_module_text(module_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bundle_get_module_text(retptr, this.__wbg_ptr, module_id);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {number} module_id
     * @param {number} raw_index
     * @returns {any}
     */
    get_search_location(module_id, raw_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bundle_get_search_location(retptr, this.__wbg_ptr, module_id, raw_index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} module_id
     * @param {number} raw_index
     * @param {boolean} long_preview
     * @returns {any}
     */
    get_search_result_info(module_id, raw_index, long_preview) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bundle_get_search_result_info(retptr, this.__wbg_ptr, module_id, raw_index, long_preview);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} module_id
     * @returns {boolean}
     */
    has_id(module_id) {
        const ret = wasm.bundle_has_id(this.__wbg_ptr, module_id);
        return ret !== 0;
    }
    /**
     * line and column are 1-based
     * @param {number} module_id
     * @param {MonacoPosition} m_pos
     * @returns {Promise<ModuleLocation[]>}
     */
    provide_definition(module_id, m_pos) {
        _assertClass(m_pos, MonacoPosition);
        var ptr0 = m_pos.__destroy_into_raw();
        const ret = wasm.bundle_provide_definition(this.__wbg_ptr, module_id, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {number} module_id
     * @param {MonacoPosition} m_pos
     * @returns {Promise<HoverInfo | undefined>}
     */
    provide_hover(module_id, m_pos) {
        _assertClass(m_pos, MonacoPosition);
        var ptr0 = m_pos.__destroy_into_raw();
        const ret = wasm.bundle_provide_hover(this.__wbg_ptr, module_id, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {number} module_id
     * @param {MonacoPosition} m_pos
     * @returns {Promise<ModuleLocation[]>}
     */
    provide_references(module_id, m_pos) {
        _assertClass(m_pos, MonacoPosition);
        var ptr0 = m_pos.__destroy_into_raw();
        const ret = wasm.bundle_provide_references(this.__wbg_ptr, module_id, ptr0);
        return takeObject(ret);
    }
    /**
     * @param {string} query
     * @param {boolean} regex
     * @returns {any}
     */
    search_modules(query, regex) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(query, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len0 = WASM_VECTOR_LEN;
            wasm.bundle_search_modules(retptr, this.__wbg_ptr, ptr0, len0, regex);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) Bundle.prototype[Symbol.dispose] = Bundle.prototype.free;

export class HoverInfo {
    static __wrap(ptr) {
        const obj = Object.create(HoverInfo.prototype);
        obj.__wbg_ptr = ptr;
        HoverInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HoverInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hoverinfo_free(ptr, 0);
    }
    /**
     * @returns {MonacoRange}
     */
    get range() {
        const ret = wasm.__wbg_get_hoverinfo_range(this.__wbg_ptr);
        return MonacoRange.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    get content() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hoverinfo_content(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get i18n_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hoverinfo_i18n_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1);
                wasm.__wbindgen_export4(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) HoverInfo.prototype[Symbol.dispose] = HoverInfo.prototype.free;

export class JSEdge {
    static __wrap(ptr) {
        const obj = Object.create(JSEdge.prototype);
        obj.__wbg_ptr = ptr;
        JSEdgeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JSEdgeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsedge_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get from() {
        const ret = wasm.jsedge_from(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get to() {
        const ret = wasm.jsedge_to(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) JSEdge.prototype[Symbol.dispose] = JSEdge.prototype.free;

export class JSNode {
    static __wrap(ptr) {
        const obj = Object.create(JSNode.prototype);
        obj.__wbg_ptr = ptr;
        JSNodeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JSNodeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsnode_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get height() {
        const ret = wasm.__wbg_get_jsnode_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get width() {
        const ret = wasm.__wbg_get_jsnode_width(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_jsnode_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_jsnode_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.jsnode_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set height(arg0) {
        wasm.__wbg_set_jsnode_height(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set width(arg0) {
        wasm.__wbg_set_jsnode_width(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_jsnode_x(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_jsnode_y(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) JSNode.prototype[Symbol.dispose] = JSNode.prototype.free;

export class LaidOutGraph {
    static __wrap(ptr) {
        const obj = Object.create(LaidOutGraph.prototype);
        obj.__wbg_ptr = ptr;
        LaidOutGraphFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LaidOutGraphFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_laidoutgraph_free(ptr, 0);
    }
    /**
     * @returns {JSEdge[]}
     */
    get edges() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.laidoutgraph_edges(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1);
            wasm.__wbindgen_export4(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {JSNode[]}
     */
    get nodes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.laidoutgraph_nodes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1);
            wasm.__wbindgen_export4(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) LaidOutGraph.prototype[Symbol.dispose] = LaidOutGraph.prototype.free;

export class Meta {
    static __wrap(ptr) {
        const obj = Object.create(Meta.prototype);
        obj.__wbg_ptr = ptr;
        MetaFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MetaFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_meta_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get build_hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.meta_build_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get build_number() {
        const ret = wasm.meta_build_number(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string[]}
     */
    get channels() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.meta_channels(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1);
            wasm.__wbindgen_export4(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number | undefined}
     */
    get entry_point() {
        const ret = wasm.meta_entry_point(this.__wbg_ptr);
        return ret === Number.MAX_SAFE_INTEGER ? undefined : ret;
    }
    /**
     * @returns {bigint}
     */
    get first_seen() {
        const ret = wasm.meta_first_seen(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {Meta} a
     * @param {Meta} b
     * @returns {number}
     */
    static sort_newest_first(a, b) {
        _assertClass(a, Meta);
        _assertClass(b, Meta);
        const ret = wasm.meta_sort_newest_first(a.__wbg_ptr, b.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) Meta.prototype[Symbol.dispose] = Meta.prototype.free;

export class ModuleLocation {
    static __wrap(ptr) {
        const obj = Object.create(ModuleLocation.prototype);
        obj.__wbg_ptr = ptr;
        ModuleLocationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ModuleLocationFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_modulelocation_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.__wbg_get_modulelocation_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {MonacoRange}
     */
    get range() {
        const ret = wasm.__wbg_get_modulelocation_range(this.__wbg_ptr);
        return MonacoRange.__wrap(ret);
    }
}
if (Symbol.dispose) ModuleLocation.prototype[Symbol.dispose] = ModuleLocation.prototype.free;

export class MonacoPosition {
    static __wrap(ptr) {
        const obj = Object.create(MonacoPosition.prototype);
        obj.__wbg_ptr = ptr;
        MonacoPositionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MonacoPositionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_monacoposition_free(ptr, 0);
    }
    /**
     * 1-based
     * @returns {number}
     */
    get column() {
        const ret = wasm.__wbg_get_monacoposition_column(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * 1-based
     * @returns {number}
     */
    get line() {
        const ret = wasm.__wbg_get_monacoposition_line(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Create a new [`MonacoPosition`]
     *
     * line and column are 1-based
     * @param {number} line
     * @param {number} column
     */
    constructor(line, column) {
        const ret = wasm.monacoposition_new(line, column);
        this.__wbg_ptr = ret;
        MonacoPositionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 1-based
     * @param {number} arg0
     */
    set column(arg0) {
        wasm.__wbg_set_monacoposition_column(this.__wbg_ptr, arg0);
    }
    /**
     * 1-based
     * @param {number} arg0
     */
    set line(arg0) {
        wasm.__wbg_set_monacoposition_line(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) MonacoPosition.prototype[Symbol.dispose] = MonacoPosition.prototype.free;

/**
 * 1-based
 */
export class MonacoRange {
    static __wrap(ptr) {
        const obj = Object.create(MonacoRange.prototype);
        obj.__wbg_ptr = ptr;
        MonacoRangeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MonacoRangeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_monacorange_free(ptr, 0);
    }
    /**
     * 1-based
     * @returns {MonacoPosition}
     */
    get end() {
        const ret = wasm.__wbg_get_monacorange_end(this.__wbg_ptr);
        return MonacoPosition.__wrap(ret);
    }
    /**
     * 1-based
     * @returns {MonacoPosition}
     */
    get start() {
        const ret = wasm.__wbg_get_monacorange_start(this.__wbg_ptr);
        return MonacoPosition.__wrap(ret);
    }
}
if (Symbol.dispose) MonacoRange.prototype[Symbol.dispose] = MonacoRange.prototype.free;

/**
 * @returns {Promise<Meta[]>}
 */
export function get_builds() {
    const ret = wasm.get_builds();
    return takeObject(ret);
}

/**
 * @param {string} build_hash
 * @param {boolean} drop_sources
 * @returns {Promise<Bundle>}
 */
export function get_bundle(build_hash, drop_sources) {
    const ptr0 = passStringToWasm0(build_hash, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_bundle(ptr0, len0, drop_sources);
    return takeObject(ret);
}

/**
 * Points every request at another explorer_server compatible host.
 * @param {string} url
 */
export function set_server_base_url(url) {
    const ptr0 = passStringToWasm0(url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    wasm.set_server_base_url(ptr0, len0);
}

export function start_() {
    wasm.start_();
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_debug_string_0e68cf47c9cbd9b0: function(arg0, arg1) {
            const ret = debugString(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_is_function_fcda5e3902d732fe: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_undefined_8c687d0b90d5b524: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_5d9e815e6fdf150f: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_997e73d32238e655: function(arg0) {
            getObject(arg0)._wbg_cb_unref();
        },
        __wbg_arrayBuffer_06f3da76f071d37f: function() { return handleError(function (arg0) {
            const ret = getObject(arg0).arrayBuffer();
            return addHeapObject(ret);
        }, arguments); },
        __wbg_bundle_new: function(arg0) {
            const ret = Bundle.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_call_6bcf8d3e20937e46: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_error_757e9472f8410341: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_export4(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_fetch_079086473aeec73d: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).fetch(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        },
        __wbg_fetch_dde0fc0522f3018f: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).fetch(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        },
        __wbg_hoverinfo_new: function(arg0) {
            const ret = HoverInfo.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_instanceof_ArrayBuffer_d4ff01f8247925ae: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Response_6366a785e400039b: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Window_a3b8566f0a9c5d1a: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_WorkerGlobalScope_0c1a6411473b843f: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof WorkerGlobalScope;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_jsedge_new: function(arg0) {
            const ret = JSEdge.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_jsnode_new: function(arg0) {
            const ret = JSNode.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_length_31bdaf014f5fbde2: function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        },
        __wbg_meta_new: function(arg0) {
            const ret = Meta.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_modulelocation_new: function(arg0) {
            const ret = ModuleLocation.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_new_1da3429bc3c4541c: function(arg0) {
            const ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return addHeapObject(ret);
        },
        __wbg_new_a32a1ab6c6655abe: function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_new_bebc3f4757acf305: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_new_ffa92086ea89f79c: function() {
            const ret = new Array();
            return addHeapObject(ret);
        },
        __wbg_new_from_slice_a500ec81601be48f: function(arg0, arg1) {
            const ret = new Uint32Array(getArrayU32FromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_new_typed_6f8b0d724fe26c07: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wasm_bindgen_func_elem_1233(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return addHeapObject(ret);
            } finally {
                state0.a = 0;
            }
        },
        __wbg_ok_0d8e8fee3573b7ce: function(arg0) {
            const ret = getObject(arg0).ok;
            return ret;
        },
        __wbg_prototypesetcall_ae9f5e7459250748: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));
        },
        __wbg_queueMicrotask_85c90f6987555d65: function(arg0) {
            const ret = getObject(arg0).queueMicrotask;
            return addHeapObject(ret);
        },
        __wbg_queueMicrotask_f6a1fa10b81d1fc0: function(arg0) {
            queueMicrotask(getObject(arg0));
        },
        __wbg_resolve_35ec7e0c6af4c82c: function(arg0) {
            const ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_set_13d25b81ab403f5e: function(arg0, arg1, arg2) {
            getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        },
        __wbg_set_a377297433dfea63: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments); },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_8eb4cd83130a11a0: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_1e7044f654e934db: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_SELF_d8b50611246a6d92: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_WINDOW_fd0bc376bf0f8b42: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_status_88ccc72fe7bea621: function(arg0) {
            const ret = getObject(arg0).status;
            return ret;
        },
        __wbg_then_7a850dae4493f353: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        },
        __wbg_then_b830475380919203: function(arg0, arg1) {
            const ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 426, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_1229);
            return addHeapObject(ret);
        },
        __wbindgen_generic_0000000000000002: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_generic_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_generic_0000000000000004: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1);
            wasm.__wbindgen_export4(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(RustStruct { name: "Meta", unique_crate_identifier: "libsadancore-9816d61a93c840f4" }) -> Externref`.
            const ret = v0;
            return addHeapObject(ret);
        },
        __wbindgen_generic_0000000000000005: function(arg0, arg1) {
            var v0 = getArrayJsValueFromWasm0(arg0, arg1);
            wasm.__wbindgen_export4(arg0, arg1 * 4, 4);
            // Cast intrinsic for `Vector(RustStruct { name: "ModuleLocation", unique_crate_identifier: "libsadancore-9816d61a93c840f4" }) -> Externref`.
            const ret = v0;
            return addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./libsadancore_bg.js": import0,
    };
}

function __wasm_bindgen_func_elem_1233(arg0, arg1, arg2, arg3) {
    wasm.__wasm_bindgen_func_elem_1233(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

function __wasm_bindgen_func_elem_1229(arg0, arg1, arg2) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.__wasm_bindgen_func_elem_1229(retptr, arg0, arg1, addHeapObject(arg2));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

const BundleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_bundle_free(ptr, 1));
const HoverInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hoverinfo_free(ptr, 1));
const JSEdgeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsedge_free(ptr, 1));
const JSNodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsnode_free(ptr, 1));
const LaidOutGraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_laidoutgraph_free(ptr, 1));
const MetaFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_meta_free(ptr, 1));
const ModuleLocationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_modulelocation_free(ptr, 1));
const MonacoPositionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_monacoposition_free(ptr, 1));
const MonacoRangeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_monacorange_free(ptr, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_export5(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function dropObject(idx) {
    if (idx < 1028) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export3(addHeapObject(e));
    }
}

let heap = new Array(1024).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_export5(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('libsadancore_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
