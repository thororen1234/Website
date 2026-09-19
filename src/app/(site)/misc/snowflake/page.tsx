import { Hash } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import SnowflakeTool from "@/components/Tools/SnowflakeTool"
import ToolPage from "@/components/Tools/ToolPage"

export const metadata = createMetadata({
    title: "Snowflake Decoder",
    description:
        "Find out when a Discord user, server, channel or message was created from its ID.",
    path: "/misc/snowflake",
})

export default function SnowflakePage() {
    return (
        <ToolPage icon={Hash} title="Snowflake decoder" slug="snowflake">
            <SnowflakeTool />
        </ToolPage>
    )
}
