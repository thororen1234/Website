import { projects } from "@/consts"
import type { Project } from "@/types"

export const isActive = (project: Project) => !project.end

export const getProject = (slug: string) =>
    projects.find((project) => project.slug === slug)

export function yearRange({ start, end }: Project) {
    if (!end) return `Since ${start}`
    return end === start ? `${start}` : `${start} - ${end}`
}
