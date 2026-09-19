import { steamId } from "@/consts"
import { parseSteamProfile, type SteamStatus } from "@/lib/steam-parse"

export async function getSteamStatus(): Promise<SteamStatus | null> {
    if (!steamId) return null

    const path = /^\d{17}$/.test(steamId)
        ? `profiles/${steamId}`
        : `id/${encodeURIComponent(steamId)}`

    try {
        const res = await fetch(`https://steamcommunity.com/${path}/?xml=1`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) throw new Error(`Steam responded ${res.status}`)

        return parseSteamProfile(await res.text())
    } catch (e) {
        console.error("Error fetching Steam status:", e)
        return null
    }
}
