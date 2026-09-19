import { MessageSquareCode } from "lucide-react"
import DiscordMarkdownTool from "@/components/Tools/DiscordMarkdownTool"
import ToolPage from "@/components/Tools/ToolPage"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
    title: "Discord Markdown Preview",
    description:
        "Preview Discord markdown, spoilers, quotes and code blocks before you send them.",
    path: "/misc/discord-markdown",
})

export default function DiscordMarkdownPage() {
    return (
        <ToolPage
            icon={MessageSquareCode}
            title="Discord markdown preview"
            slug="discord-markdown"
        >
            <DiscordMarkdownTool />
        </ToolPage>
    )
}
