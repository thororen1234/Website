import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import Section from "@/components/Base/Section"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import type { Icon } from "@/types"

interface Props {
    icon: Icon
    title: string
    slug: string
    children: ReactNode
}

export default function ToolPage({ icon, title, slug, children }: Props) {
    return (
        <>
            <DiscordEmbed page="tool" query={{ slug }} />

            <Link
                href="/misc"
                className="flex w-fit items-center gap-1 text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400"
            >
                <ArrowLeft size={16} /> Misc
            </Link>

            <Section icon={icon} title={title}>
                {children}
            </Section>
        </>
    )
}
