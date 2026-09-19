"use client"

import { useProfile } from "@/lib/profile"

export default function ClanTag() {
    const { lanyard } = useProfile()

    const clan = lanyard?.discord_user?.primary_guild
    if (!clan?.tag || !clan.identity_guild_id || !clan.badge) return null

    return (
        <span className="flex items-center gap-1 rounded-md bg-zinc-200 px-2 py-1 dark:bg-zinc-800">
            <img
                src={`https://cdn.discordapp.com/clan-badges/${clan.identity_guild_id}/${clan.badge}.png?size=16`}
                alt="Clan Badge"
                className="size-4"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {clan.tag}
            </span>
        </span>
    )
}
