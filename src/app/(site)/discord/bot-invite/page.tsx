import { Bot } from "lucide-react"
import BotInviteTool from "@/components/Tools/BotInviteTool"
import ToolPage from "@/components/Tools/ToolPage"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
    title: "Bot Invite Generator",
    description:
        "Create Discord bot invite links and decode Discord permission numbers.",
    path: "/discord/bot-invite",
})

export default function BotInvitePage() {
    return (
        <ToolPage
            section="discord"
            icon={Bot}
            title="Bot invite generator"
            slug="bot-invite"
        >
            <BotInviteTool />
        </ToolPage>
    )
}
