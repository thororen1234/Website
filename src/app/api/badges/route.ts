import { discordUserId } from "@/consts"
import type { Badge } from "@/types"

const ONE_DAY = 1000 * 60 * 60 * 24
const RETRY_AFTER = 1000 * 60 * 5

let cached: { badges: Badge[]; fetchedAt: number } | null = null
let retryAt = 0

async function fetchBadges(): Promise<Badge[]> {
    const res = await fetch(
        `https://gb.equicord.org/${discordUserId}?seperated=true&capitalize=true`,
        { cache: "no-store", signal: AbortSignal.timeout(5000) },
    )
    if (!res.ok) throw new Error(`Badge API responded ${res.status}`)

    const data = await res.json()
    const badges: Badge[] = []
    Object.entries(data?.badges ?? {}).forEach(([type, list]) => {
        if (!Array.isArray(list)) return
        list.forEach((badge) => {
            if (badge?.badge) {
                badges.push({
                    tooltip: `${type}: ${badge.tooltip}`,
                    icon: badge.badge,
                })
            }
        })
    })
    return badges
}

export async function GET() {
    const now = Date.now()

    if (cached && (now - cached.fetchedAt < ONE_DAY || now < retryAt)) {
        return Response.json(cached.badges)
    }

    try {
        const badges = await fetchBadges()
        cached = { badges, fetchedAt: now }
        retryAt = 0
        return Response.json(badges)
    } catch (e) {
        console.error("Error fetching badges:", e)
        retryAt = now + RETRY_AFTER

        if (cached) return Response.json(cached.badges)
        return Response.json(
            { error: "Failed to fetch badges" },
            { status: 502 },
        )
    }
}
