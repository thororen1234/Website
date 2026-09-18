'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import { discordUserId } from '@/consts'
import type { Badge, LanyardData } from '@/types'

interface Profile {
    lanyard: LanyardData | null
    decorUrl: string | null
    badges: Badge[]
    timezone: string | null
}

const empty: Profile = {
    lanyard: null,
    decorUrl: null,
    badges: [],
    timezone: null,
}

const ProfileContext = createContext<Profile>(empty)

export const useProfile = () => useContext(ProfileContext)

async function getJson(url: string) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed: ${url}`)
    return res.json()
}

async function fetchLanyard(): Promise<LanyardData | null> {
    const json = await getJson(
        `https://lanyard.equicord.org/v1/users/${discordUserId}`,
    )
    return json?.data ?? null
}

async function fetchDecorUrl(lanyard: LanyardData | null) {
    const asset = lanyard?.discord_user?.avatar_decoration_data?.asset
    if (asset) {
        return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=64&passthrough=true`
    }

    try {
        const data = await getJson(
            `https://decor.fieryflames.dev/api/users/${discordUserId}`,
        )
        if (data.decorationHash) {
            return `https://ugc.decor.fieryflames.dev/${data.decorationHash}.png?animated=true`
        }
    } catch (e) {
        console.error('Decor API error:', e)
    }
    return null
}

async function fetchBadges(): Promise<Badge[]> {
    const data = await getJson(
        `https://gb.equicord.org/${discordUserId}?seperated=true&capitalize=true`,
    )

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

async function fetchTimezone() {
    const fallback = 'America/New_York'
    try {
        const data = await getJson(
            `https://timezone.creations.works/get?id=${discordUserId}`,
        )
        return (data.timezone as string) || fallback
    } catch {
        return fallback
    }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<Profile>(empty)

    useEffect(() => {
        let cancelled = false
        const update = (patch: Partial<Profile>) => {
            if (!cancelled) setProfile((prev) => ({ ...prev, ...patch }))
        }

        fetchLanyard()
            .then(async (lanyard) => {
                update({ lanyard })
                update({ decorUrl: await fetchDecorUrl(lanyard) })
            })
            .catch((e) => console.error('Error fetching user data:', e))

        fetchBadges()
            .then((badges) => update({ badges }))
            .catch((e) => console.error('Error fetching badges:', e))

        fetchTimezone().then((timezone) => update({ timezone }))

        return () => {
            cancelled = true
        }
    }, [])

    return <ProfileContext value={profile}>{children}</ProfileContext>
}
