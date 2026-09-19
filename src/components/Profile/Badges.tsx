"use client"

import { useProfile } from "@/lib/profile"

export default function Badges() {
    const { badges } = useProfile()

    if (!badges.length) return null

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
                <img
                    key={badge.icon}
                    src={badge.icon}
                    alt={badge.tooltip}
                    title={badge.tooltip}
                    className="size-5 rounded"
                />
            ))}
        </div>
    )
}
