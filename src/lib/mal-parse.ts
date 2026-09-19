export interface Anime {
    id: number
    title: string
    url: string
    image: string | null
    watched: number
    total: number | null
    score: number | null
    updatedAt: string | null
}

interface Entry {
    node?: {
        id?: number
        title?: string
        main_picture?: { medium?: string; large?: string }
        num_episodes?: number
    }
    list_status?: {
        score?: number
        num_episodes_watched?: number
        updated_at?: string
    }
}

export function parseWatching(json: unknown, limit = 5): Anime[] {
    const entries = (json as { data?: Entry[] })?.data
    if (!Array.isArray(entries)) return []

    return entries
        .filter((entry) => entry.node?.id && entry.node.title)
        .slice(0, limit)
        .map(({ node, list_status: status }) => ({
            id: node!.id!,
            title: node!.title!,
            url: `https://myanimelist.net/anime/${node!.id}`,
            image: node!.main_picture?.medium ?? null,
            watched: status?.num_episodes_watched ?? 0,
            total: node!.num_episodes || null,
            score: status?.score || null,
            updatedAt: status?.updated_at ?? null,
        }))
}
