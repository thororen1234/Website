import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import Section from "@/components/Base/Section"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import type { Icon } from "@/types"

const sections = {
    misc: { href: "/misc", label: "Misc" },
    discord: { href: "/discord", label: "Discord" },
}

interface Props {
    icon: Icon
    title: string
    slug: string
    section?: keyof typeof sections
    children: ReactNode
}

export default function ToolPage({
    icon,
    title,
    slug,
    section = "misc",
    children,
}: Props) {
    const back = sections[section]

    return (
        <>
            <DiscordEmbed page="tool" query={{ slug }} />

            <Link
                href={back.href}
                className="flex w-fit items-center gap-1 text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400"
            >
                <ArrowLeft size={16} /> {back.label}
            </Link>

            <Section icon={icon} title={title}>
                {children}
            </Section>
        </>
    )
}
