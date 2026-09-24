export interface ViewSearch {
    sl?: number
    sc?: number
    el?: number
    ec?: number
}

const SEARCH_KEYS = ["sl", "sc", "el", "ec"] as const

export function viewHref(
    buildHash: string,
    moduleId?: number | null,
    search?: ViewSearch,
) {
    let href = `/discord/modules/${encodeURIComponent(buildHash)}`

    if (moduleId != null) href += `/${moduleId}`

    const params = new URLSearchParams()
    for (const key of SEARCH_KEYS) {
        const value = search?.[key]
        if (value != null) params.set(key, String(value))
    }

    const query = params.toString()
    return query ? `${href}?${query}` : href
}

export function parseViewSearch(params: URLSearchParams): ViewSearch {
    const search: ViewSearch = {}

    for (const key of SEARCH_KEYS) {
        const value = Number(params.get(key))
        if (params.has(key) && Number.isInteger(value) && value > 0) {
            search[key] = value
        }
    }

    return search
}

export function parseModuleId(raw: string | string[] | undefined) {
    const value = Array.isArray(raw) ? raw[0] : raw
    if (value == null || !/^\d+$/.test(value)) return null
    return Number(value)
}
