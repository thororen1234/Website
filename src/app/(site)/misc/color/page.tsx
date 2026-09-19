import { Palette } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import ColorTool from "@/components/Tools/ColorTool"
import ToolPage from "@/components/Tools/ToolPage"

export const metadata = createMetadata({
    title: "Embed Color Converter",
    description:
        "Convert between hex, RGB, HSL and the decimal number Discord embeds use.",
    path: "/misc/color",
})

export default function ColorPage() {
    return (
        <ToolPage icon={Palette} title="Embed color converter" slug="color">
            <ColorTool />
        </ToolPage>
    )
}
