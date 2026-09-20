"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"
import { discordUserId } from "@/consts"
import type { Badge, LanyardData } from "@/types"

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

function connectLanyard(onData: (lanyard: LanyardData) => void) {
    let ws: WebSocket | null = null
    let heartbeat: ReturnType<typeof setInterval> | undefined
    let retry: ReturnType<typeof setTimeout> | undefined
    let failures = 0
    let closed = false

    const open = () => {
        const socket = new WebSocket("wss://lanyard.equicord.org/socket")
        ws = socket

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)

            if (message.op === 1) {
                heartbeat = setInterval(
                    () => socket.send(JSON.stringify({ op: 3 })),
                    message.d.heartbeat_interval,
                )
                socket.send(
                    JSON.stringify({
                        op: 2,
                        d: { subscribe_to_id: discordUserId },
                    }),
                )
            } else if (message.op === 0) {
                failures = 0
                onData(message.d)
            }
        }

        socket.onclose = () => {
            clearInterval(heartbeat)
            if (closed) return
            retry = setTimeout(open, Math.min(1000 * 2 ** failures++, 30000))
        }
    }

    open()

    return () => {
        closed = true
        clearInterval(heartbeat)
        clearTimeout(retry)
        ws?.close()
    }
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
        console.error("Decor API error:", e)
    }
    return null
}

function fetchBadges(): Promise<Badge[]> {
    return getJson("/api/badges")
}

async function fetchTimezone() {
    const fallback = "America/New_York"
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

        let live = false
        let decorAsset: string | null | undefined = null

        const refreshDecor = async (lanyard: LanyardData | null) => {
            decorAsset = lanyard?.discord_user?.avatar_decoration_data?.asset
            update({ decorUrl: await fetchDecorUrl(lanyard) })
        }

        fetchLanyard()
            .then(async (lanyard) => {
                if (live) return
                update({ lanyard })
                await refreshDecor(lanyard)
            })
            .catch((e) => console.error("Error fetching user data:", e))

        const disconnect = connectLanyard((lanyard) => {
            live = true
            update({ lanyard })

            if (
                lanyard.discord_user?.avatar_decoration_data?.asset !==
                decorAsset
            ) {
                refreshDecor(lanyard)
            }
        })

        fetchBadges()
            .then((badges) => update({ badges }))
            .catch((e) => console.error("Error fetching badges:", e))

        fetchTimezone().then((timezone) => update({ timezone }))

        return () => {
            cancelled = true
            disconnect()
        }
    }, [])

    return <ProfileContext value={profile}>{children}</ProfileContext>
}
