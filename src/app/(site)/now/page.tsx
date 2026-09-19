import { GitCommitHorizontal } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import Section from "@/components/Base/Section"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import ActivityFeed from "@/components/Widgets/ActivityFeed"
import CodingSection from "@/components/Widgets/CodingSection"
import ListeningSection from "@/components/Widgets/ListeningSection"
import SteamSection from "@/components/Widgets/SteamSection"
import HypixelSection from "@/components/Widgets/HypixelSection"
import WatchingSection from "@/components/Widgets/WatchingSection"

export const revalidate = 60

export const metadata = createMetadata({
    title: "Now",
    description:
        "What I'm up to right now: what I'm playing, listening to, watching and coding.",
    path: "/now",
})

export default function Now() {
    return (
        <>
            <DiscordEmbed page="now" />

            <div className="grid items-start gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-8 empty:hidden">
                    <SteamSection />
                    <HypixelSection />
                    <ListeningSection />
                    <WatchingSection />
                </div>

                <div className="flex flex-col gap-8">
                    <CodingSection />

                    <Section icon={GitCommitHorizontal} title="Recent activity">
                        <ActivityFeed />
                    </Section>
                </div>
            </div>
        </>
    )
}
