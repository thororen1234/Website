import { Shapes } from "lucide-react"
import { miscPages } from "@/consts"
import { createMetadata } from "@/lib/metadata"
import Section from "@/components/Base/Section"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import ToolGrid from "@/components/Tools/ToolGrid"

export const metadata = createMetadata({
    title: "Misc",
    description:
        "Small standalone pages and tools that don't fit anywhere else.",
    path: "/misc",
})

export default function Misc() {
    return (
        <>
            <DiscordEmbed page="misc" />

            <Section icon={Shapes} title="Misc">
                <ToolGrid pages={miscPages} />
            </Section>
        </>
    )
}
