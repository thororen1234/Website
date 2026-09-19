import { createMetadata } from "@/lib/metadata"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"

export const metadata = createMetadata({
    title: "beycord",
    description: "beycord - april 1st 2021",
    path: "/beycord",
})

export default function Beycord() {
    return (
        <>
            <DiscordEmbed page="tool" query={{ slug: "beycord" }} />
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <h1 className="text-neutral-800 dark:text-neutral-200">
                    beycord
                </h1>
                <h1 className="text-neutral-800 dark:text-neutral-200">
                    april 1st 2021
                </h1>
            </div>
        </>
    )
}
