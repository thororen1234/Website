import type { MetadataRoute } from "next"
import { projects, siteUrl } from "@/consts"

const pages = [
    "",
    "/projects",
    "/now",
    "/misc",
    "/misc/color",
    "/misc/dev-tools",
    "/misc/minecraft-formatting",
    "/misc/meshos",
    "/misc/bot-invite",
    "/misc/discord-markdown",
    "/misc/snowflake",
    "/misc/timestamp",
    "/beycord",
]

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
        ...projects.map(({ slug }) => ({
            url: `${siteUrl}/projects/${slug}`,
        })),
    ]
}
