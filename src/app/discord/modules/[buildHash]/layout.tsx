import type { ReactNode } from "react"
import { createMetadata } from "@/lib/metadata"
import { ExplorerClient } from "@/explorer/ui/client"

export const metadata = {
    ...createMetadata({
        title: "Discord Module Explorer",
        description:
            "Browse, search and cross-reference the webpack modules of a Discord client build.",
    }),
    robots: { index: false },
}

export default function ExplorerLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <ExplorerClient />
            {children}
        </>
    )
}
