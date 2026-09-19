import { lastfmApiKey, lastfmUser } from "@/consts"
import {
    collapseRepeats,
    parseRecentTracks,
    type Track,
} from "@/lib/lastfm-parse"

const FETCH_COUNT = 20

export async function getRecentTracks(limit = 6): Promise<Track[] | null> {
    if (!lastfmApiKey) return null

    const params = new URLSearchParams({
        method: "user.getrecenttracks",
        user: lastfmUser,
        api_key: lastfmApiKey,
        format: "json",
        limit: String(FETCH_COUNT),
    })

    try {
        const res = await fetch(
            `https://ws.audioscrobbler.com/2.0/?${params}`,
            {
                next: { revalidate: 60 },
                signal: AbortSignal.timeout(5000),
            },
        )
        if (!res.ok) throw new Error(`Last.fm responded ${res.status}`)

        return collapseRepeats(
            parseRecentTracks(await res.json(), FETCH_COUNT),
        ).slice(0, limit)
    } catch (e) {
        console.error("Error fetching Last.fm tracks:", e)
        return null
    }
}
