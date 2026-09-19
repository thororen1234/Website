import { Wrench } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import DevTools from "@/components/Tools/DevTools"
import ToolPage from "@/components/Tools/ToolPage"

export const metadata = createMetadata({
    title: "Developer Tools",
    description:
        "Base64, JSON and hash tools that run entirely in your browser.",
    path: "/misc/dev-tools",
})

export default function DevToolsPage() {
    return (
        <ToolPage icon={Wrench} title="Developer tools" slug="dev-tools">
            <DevTools />
        </ToolPage>
    )
}
