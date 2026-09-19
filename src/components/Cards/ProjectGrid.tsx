import ProjectCard from "@/components/Cards/ProjectCard"
import type { Project } from "@/types"

export default function ProjectGrid({ projects }: { projects: Project[] }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-3">
            {projects.map((project) => (
                <ProjectCard key={project.slug} {...project} />
            ))}
        </div>
    )
}
