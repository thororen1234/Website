"use client"

import { BookUser } from "lucide-react"
import Box from "@/components/Base/Box"
import { useProfile } from "@/lib/profile"
import { platformPaths, type Platform } from "./platformPaths"

function PlatformIcon({ platform }: { platform: Platform }) {
    return (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d={platformPaths[platform]} />
        </svg>
    )
}

export default function BadgesSection() {
    const { lanyard, badges } = useProfile()

    const clan = lanyard?.discord_user?.primary_guild
    const hasClan = Boolean(clan?.tag && clan?.identity_guild_id && clan?.badge)

    const platforms: Platform[] = []
    if (lanyard?.active_on_discord_web) platforms.push("web")
    if (lanyard?.active_on_discord_mobile) platforms.push("mobile")
    if (lanyard?.active_on_discord_desktop) platforms.push("desktop")
    if (lanyard?.active_on_discord_embedded) platforms.push("embedded")
    if (lanyard?.active_on_discord_vr) platforms.push("vr")

    return (
        <>
            <div className="flex items-start gap-2">
                <span className="flex gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <BookUser size={18} /> Badges
                </span>

                <div className="mt-1 flex gap-1 text-neutral-600 dark:text-neutral-400">
                    {platforms.map((platform) => (
                        <PlatformIcon key={platform} platform={platform} />
                    ))}
                </div>

                {hasClan && (
                    <div className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-900">
                        <img
                            src={`https://cdn.discordapp.com/clan-badges/${clan!.identity_guild_id}/${clan!.badge}.png?size=16`}
                            alt="Clan Badge"
                            className="h-3 w-3"
                        />
                        <span className="text-xs text-neutral-700 dark:text-neutral-200">
                            {clan!.tag}
                        </span>
                    </div>
                )}
            </div>

            <Box>
                <div className="mt-1 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                        <img
                            key={badge.icon}
                            src={badge.icon}
                            alt={badge.tooltip}
                            title={badge.tooltip}
                            className="size-4 rounded"
                        />
                    ))}
                </div>
            </Box>
        </>
    )
}
