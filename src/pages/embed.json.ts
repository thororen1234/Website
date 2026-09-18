import type { APIRoute } from 'astro'
import { socials, projects } from '@/consts'

const ACCENT_COLOR = 0x970000

export const GET: APIRoute = ({ site, url }) => {
    const origin = site?.origin ?? url.origin
    const currentProjects = projects.filter((p) => !p.end).slice(0, 3)

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
                            '# thororen\nSoftware developer from the United States with experience in TypeScript, JavaScript, Python, and Go.',
                    },
                ],
                accessory: {
                    type: 11,
                    media: { url: `${origin}/assets/profile` },
                    description: 'My avatar',
                },
            },
            { type: 14 },
            {
                type: 10,
                content: `**Currently building**\n
                    ${currentProjects
                        .map((p) => `[${p.title}](${p.url})`)
                        .join(' • ')}`,
            },
            { type: 14, spacing: 1 },
            {
                type: 1,
                components: socials
                    .filter((s) => s.text !== 'Donate')
                    .map((s) => ({
                        type: 2,
                        style: 5,
                        url: s.url,
                        label: s.text,
                    })),
            },
        ],
    }

    return new Response(JSON.stringify({ component }), {
        headers: { 'Content-Type': 'application/json' },
    })
}
