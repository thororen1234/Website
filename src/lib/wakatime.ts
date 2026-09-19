import { parseCodingStats, type CodingStats } from "@/lib/wakatime-parse"

export const STATS_RANGE = "last_7_days"

export async function getCodingStats(): Promise<CodingStats | null> {
    const apiKey = process.env.WAKATIME_API_KEY
    if (!apiKey) return null

    try {
        const res = await fetch(
            `https://wakatime.com/api/v1/users/current/stats/${STATS_RANGE}`,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
                },
                next: { revalidate: 900 },
                signal: AbortSignal.timeout(8000),
            },
        )
        if (!res.ok) throw new Error(`WakaTime responded ${res.status}`)

        return parseCodingStats(await res.json())
    } catch (e) {
        console.error("Error fetching WakaTime stats:", e)
        return null
    }
}
