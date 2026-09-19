import { Pickaxe } from "lucide-react"
import MinecraftFormattingTool from "@/components/Tools/MinecraftFormattingTool"
import ToolPage from "@/components/Tools/ToolPage"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
    title: "Minecraft Formatting",
    description:
        "Preview Minecraft legacy color and style codes written with & or §.",
    path: "/misc/minecraft-formatting",
})

export default function MinecraftFormattingPage() {
    return (
        <ToolPage
            icon={Pickaxe}
            title="Minecraft formatting"
            slug="minecraft-formatting"
        >
            <MinecraftFormattingTool />
        </ToolPage>
    )
}
