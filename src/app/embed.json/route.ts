import { projects, siteUrl, socials } from "@/consts"

const ACCENT_COLOR = 0x970000

export function GET() {
    const currentProjects = projects.filter((p) => !p.end).slice(0, 2)

    const component = {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            {
                type: 9,
                components: [
                    {
                        type: 10,
                        content:
                            "# thororen\nSoftware developer from the United States with experience in TypeScript, JavaScript, Python, and Go.",
                    },
                ],
                accessory: {
                    type: 11,
                    media: { url: `${siteUrl}/assets/profile` },
                    description: "My avatar",
                },
            },
            { type: 14 },
            {
                type: 10,
                content: `**Currently building**\n${currentProjects
                    .map((p) => `[${p.title}](${p.url})`)
                    .join(" • ")}`,
            },
            { type: 14, spacing: 1 },
            {
                type: 1,
                components: socials
                    .filter((s) => s.text !== "Donate")
                    .map((s) => ({
                        type: 2,
                        style: 5,
                        url: s.url,
                        label: s.text,
                    })),
            },
        ],
    }

    return Response.json({ component })
}
