import { Archive, Hammer } from "lucide-react"
import { projects } from "@/consts"
import { createMetadata } from "@/lib/metadata"
import { isActive } from "@/lib/projects"
import Section from "@/components/Base/Section"
import ProjectGrid from "@/components/Cards/ProjectGrid"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"

export const metadata = createMetadata({
    title: "Projects",
    description: "Projects I'm working on and have worked on in the past.",
    path: "/projects",
})

export default function Projects() {
    const current = projects.filter(isActive)
    const past = projects.filter((project) => !isActive(project))

    return (
        <>
            <DiscordEmbed page="projects" />

            <Section icon={Hammer} title="Current">
                <ProjectGrid projects={current} />
            </Section>

            <Section icon={Archive} title="Past">
                <ProjectGrid projects={past} />
            </Section>
        </>
    )
}
