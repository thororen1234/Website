import type { ComponentType } from "react"
import type { LucideProps } from "lucide-react"

export type Icon = ComponentType<LucideProps>

export type Theme = "light" | "dark"

export interface Info {
    icon: Icon
    text: string
}

export interface Social extends Info {
    url: string
}

export interface Skill {
    text: string
    description: string
    progress: number
}

export interface Project {
    start: number
    end?: number
    title: string
    description: string
    url?: string
    github?: string
    icon?: string
    tasks?: string[]
}

export interface Product {
    url: string
    cover: string
    title: string
    description: string
    price: number // 0 = Free
}

export interface LanyardActivity {
    type: number
    name?: string
    details?: string
    state?: string
}

export interface LanyardData {
    discord_status?: string
    active_on_discord_web?: boolean
    active_on_discord_mobile?: boolean
    active_on_discord_desktop?: boolean
    active_on_discord_embedded?: boolean
    active_on_discord_vr?: boolean
    activities?: LanyardActivity[]
    discord_user?: {
        id?: string
        avatar?: string
        avatar_decoration_data?: { asset?: string } | null
        primary_guild?: {
            tag?: string
            identity_guild_id?: string
            badge?: string
        } | null
    }
}

export interface Badge {
    tooltip: string
    icon: string
}
