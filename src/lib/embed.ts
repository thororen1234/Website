import { miscPages, projects, siteUrl, socials } from "@/consts"
import { getProject, isActive, yearRange } from "@/lib/projects"
import { excerpt } from "@/lib/text"
import type { MiscPage, Project } from "@/types"

const ACCENT_COLOR = 0x970000
const SOCIALS_BLACKLIST = ["donate", "discord"]

interface Link {
    label: string
    url: string
}

const linkRows = (links: Link[]) =>
    Array.from({ length: Math.ceil(links.length / 5) }, (_, i) => ({
        type: 1,
        components: links.slice(i * 5, i * 5 + 5).map(({ label, url }) => ({
            type: 2,
            style: 5,
            url,
            label,
        })),
    }))

export function siteEmbed() {
    const currentProjects = projects.filter((p) => !p.end).slice(0, 2)

    return {
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
            ...linkRows(
                socials
                    .filter(
                        (s) =>
                            !SOCIALS_BLACKLIST.includes(s.text.toLowerCase()),
                    )
                    .map((s) => ({ label: s.text, url: s.url })),
            ),
        ],
    }
}

export function projectEmbed(project: Project) {
    const { slug, title, description, details, icon, url, github } = project

    const about = excerpt([description, ...(details ?? [])].join(" "), 280)
    const status = `${isActive(project) ? "Active" : "Past"} · ${yearRange(project)}`

    const links: Link[] = []
    if (url) links.push({ label: "Website", url })
    if (github) links.push({ label: "Source", url: github })
    links.push({ label: "Project page", url: `${siteUrl}/projects/${slug}` })

    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            {
                type: 9,
                components: [
                    {
                        type: 10,
                        content: `# ${title}\n${about}\n-# ${status}`,
                    },
                ],
                ...(icon && {
                    accessory: {
                        type: 11,
                        media: { url: `${siteUrl}${icon}` },
                        description: `${title} icon`,
                    },
                }),
            },
            { type: 14, spacing: 1 },
            ...linkRows(links),
        ],
    }
}

export function pageEmbed(title: string, description: string) {
    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            {
                type: 9,
                components: [
                    {
                        type: 10,
                        content: `# ${title}\n${description}`,
                    },
                ],
            },
        ],
    }
}

export function miscEmbed(page: MiscPage) {
    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            {
                type: 9,
                components: [
                    {
                        type: 10,
                        content: `# ${page.title}\n${page.description}`,
                    },
                ],
            },
            { type: 14, spacing: 1 },
            ...linkRows([
                { label: "Open page", url: `${siteUrl}${page.href}` },
                { label: "All misc", url: `${siteUrl}/misc` },
            ]),
        ],
    }
}

const PAGE_INFO: Record<string, { title: string; description: string }> = {
    projects: {
        title: "Projects",
        description:
            "A collection of the software and communities I'm actively building in and have worked on.",
    },
    now: {
        title: "Now",
        description:
            "A live snapshot of what I'm playing, listening to, watching and coding, plus recent GitHub activity.",
    },
    misc: {
        title: "Misc",
        description:
            "Small standalone pages and tools that don't fit anywhere else.",
    },
}

export function getEmbed(params: URLSearchParams) {
    const page = params.get("page")
    const slug = params.get("slug")

    if (page === "project" && slug) {
        const project = getProject(slug)
        return project ? projectEmbed(project) : null
    }

    if (page === "tool" && slug) {
        const tool = miscPages.find(
            ({ href }) => href === `/misc/${slug}` || href === `/${slug}`,
        )
        return tool ? miscEmbed(tool) : null
    }

    const info = page ? PAGE_INFO[page] : undefined
    return info ? pageEmbed(info.title, info.description) : siteEmbed()
}
