"use client"

import { useProfile } from "@/lib/profile"

const paletteColors: Record<string, string> = {
    crimson: "#900007",
    berry: "#893A99",
    sky: "#0080B7",
    teal: "#086460",
    forest: "#2D5401",
    bubble_gum: "#DC3E97",
    violet: "#730BC8",
    cobalt: "#0131C2",
    clover: "#047B20",
    lemon: "#F6CD12",
    white: "#FFFFFF",
    black: "#000000",
}

export default function Nameplate() {
    const { lanyard } = useProfile()

    const nameplate = lanyard?.discord_user?.collectibles?.nameplate
    if (!nameplate?.asset) return null

    const url = `https://cdn.discordapp.com/assets/collectibles/${nameplate.asset}`
    const color = paletteColors[nameplate.palette ?? ""]

    return (
        <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
        >
            {color && (
                <span
                    className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-100"
                    style={{
                        background: `linear-gradient(90deg, transparent 20%, ${color}4D)`,
                    }}
                />
            )}
            <video
                src={`${url}asset.webm`}
                poster={`${url}static.png`}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 right-0 h-full max-w-none"
            />
        </span>
    )
}
