import { siteUrl } from "@/consts"

interface Props {
    page?: string
    query?: Record<string, string | undefined>
}

export default function DiscordEmbed({ page, query }: Props) {
    const search = new URLSearchParams({
        ...(page && { page }),
        ...Object.fromEntries(
            Object.entries(query ?? {}).filter(([, value]) => value),
        ),
    }).toString()

    return (
        <link
            rel="discord:component-embed"
            type="application/json"
            href={`${siteUrl}/embed.json${search ? `?${search}` : ""}`}
        />
    )
}
