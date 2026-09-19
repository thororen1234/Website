"use client"

import { useProfile } from "@/lib/profile"
import { statusColors } from "@/lib/status"

export default function Avatar({ size }: { size: number }) {
    const { lanyard, decorUrl } = useProfile()

    const user = lanyard?.discord_user
    const hasAvatar = Boolean(user?.id && user?.avatar)
    const status = lanyard?.discord_status || "offline"

    return (
        <div
            style={{
                position: "relative",
                display: "inline-block",
                width: size,
                height: size,
            }}
        >
            <img
                src={hasAvatar ? "/assets/profile" : undefined}
                className="rounded-full border border-zinc-800 bg-zinc-900 shadow select-none"
                style={{ borderRadius: "50%" }}
                width={size}
                height={size}
                draggable={false}
                alt="Discord Avatar"
            />

            {decorUrl && (
                <img
                    src={decorUrl}
                    draggable={false}
                    alt="Discord Decor"
                    width={size}
                    height={size}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 15,
                        pointerEvents: "none",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.20)",
                    }}
                />
            )}

            <span
                style={{
                    zIndex: 30,
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: size / 4,
                    height: size / 4,
                    borderRadius: "50%",
                    border: "4px solid #1a1a1a",
                    backgroundColor:
                        statusColors[status] ?? statusColors.offline,
                }}
                title={status}
            />
        </div>
    )
}
