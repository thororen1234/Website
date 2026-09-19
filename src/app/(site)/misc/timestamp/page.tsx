import { Clock } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import TimestampTool from "@/components/Tools/TimestampTool"
import ToolPage from "@/components/Tools/ToolPage"

export const metadata = createMetadata({
    title: "Timestamp Generator",
    description:
        "Make Discord timestamp codes that show the right time for everyone who reads them.",
    path: "/misc/timestamp",
})

export default function TimestampPage() {
    return (
        <ToolPage icon={Clock} title="Timestamp generator" slug="timestamp">
            <TimestampTool />
        </ToolPage>
    )
}
