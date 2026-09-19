import { malUsername } from "@/consts"
import { parseWatching, type Anime } from "@/lib/mal-parse"

export async function getWatching(limit = 5): Promise<Anime[] | null> {
    const malClientId = process.env.MAL_CLIENT_ID
    if (!malUsername || !malClientId) return null

    const params = new URLSearchParams({
        status: "watching",
        sort: "list_updated_at",
        limit: "20",
        fields: "list_status,num_episodes",
    })

    try {
        const res = await fetch(
            `https://api.myanimelist.net/v2/users/${encodeURIComponent(malUsername)}/animelist?${params}`,
            {
                headers: { "X-MAL-CLIENT-ID": malClientId },
                next: { revalidate: 600 },
                signal: AbortSignal.timeout(8000),
            },
        )
        if (!res.ok) throw new Error(`MyAnimeList responded ${res.status}`)

        return parseWatching(await res.json(), limit)
    } catch (e) {
        console.error("Error fetching MyAnimeList:", e)
        return null
    }
}
