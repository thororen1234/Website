import { discordPages } from "@/consts"
import { createMetadata } from "@/lib/metadata"
import Section from "@/components/Base/Section"
import Discord from "@/components/Icons/Discord"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import ToolGrid from "@/components/Tools/ToolGrid"

export const metadata = createMetadata({
    title: "Discord",
    description: "Tools for Discord users, bot developers and client modders.",
    path: "/discord",
})

export default function DiscordTools() {
    return (
        <>
            <DiscordEmbed page="discord" />

            <Section icon={Discord} title="Discord">
                <ToolGrid pages={discordPages} />
            </Section>
        </>
    )
}
