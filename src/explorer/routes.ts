export interface CodeSelection {
    sl?: number
    sc?: number
    el?: number
    ec?: number
}

const selectionKeys = ["sl", "sc", "el", "ec"] as const

function withSelection(path: string, selection: CodeSelection) {
    const params = new URLSearchParams()
    for (const key of selectionKeys) {
        const value = selection[key]
        if (Number.isInteger(value) && value! > 0) {
            params.set(key, String(value))
        }
    }

    const query = params.toString()
    return query ? `${path}?${query}` : path
}

export function moduleHref(
    buildHash: string,
    moduleId?: number | null,
    selection: CodeSelection = {},
) {
    return withSelection(
        `/discord/modules/${encodeURIComponent(buildHash)}${
            moduleId == null ? "" : `/${moduleId}`
        }`,
        selection,
    )
}

export function sourceHref(
    buildHash: string,
    path: string,
    selection: CodeSelection = {},
) {
    return withSelection(
        `/discord/modules/${encodeURIComponent(buildHash)}/${path
            .split("/")
            .map(encodeURIComponent)
            .join("/")}`,
        selection,
    )
}

export function readSelection(params: URLSearchParams): CodeSelection {
    const selection: CodeSelection = {}

    for (const key of selectionKeys) {
        const value = Number(params.get(key))
        if (Number.isInteger(value) && value > 0) selection[key] = value
    }

    return selection
}

export function readModuleId(moduleId: string[] | undefined) {
    const value = moduleId?.[0]
    if (!value || !/^\d+$/.test(value)) return null

    const id = Number(value)
    return Number.isSafeInteger(id) && id >= 0 ? id : null
}

export function readSourcePath(segments: string[] | undefined) {
    if (!segments?.length) return null

    try {
        return segments.map(decodeURIComponent).join("/")
    } catch {
        return null
    }
}
