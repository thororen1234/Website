import { Highlighter, Notebook, Star } from 'lucide-react'
import { projects, skills } from '@/consts'
import { createMetadata } from '@/lib/metadata'
import Box from '@/components/Base/Box'
import Tag from '@/components/Base/Tag'
import ProjectCard from '@/components/Cards/ProjectCard'
import SkillCard from '@/components/Cards/SkillCard'

export const revalidate = 3600

export const metadata = createMetadata({
    title: 'thororen',
    description:
        "I'm a software developer from the United States of America with experience in languages such as TypeScript, JavaScript, Python, and Go.",
    path: '/',
})

export default function Home() {
    return (
        <>
            {/* Me */}
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <Highlighter size={18} fill="#ffffff10" /> Me
            </span>

            <Box>
                Hi! I&apos;m Thor! I&apos;m a software developer from the United
                States of America with experience in languages such as
                TypeScript, JavaScript, Python, and Go.
            </Box>

            {/* Skills */}
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <Star size={18} fill="#ffffff10" /> Skills
                <Tag className="bg-zinc-300">
                    {new Date().getFullYear() - 2019} Years
                </Tag>
            </span>

            <Box>
                {skills.map((skill) => (
                    <SkillCard key={skill.text} {...skill} />
                ))}
            </Box>

            {/* Projects */}
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <Notebook size={18} fill="#ffffff10" /> Projects
            </span>

            <div className="flex flex-wrap gap-3">
                {projects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>
        </>
    )
}
