import { Fragment } from "react"
import { KeyRound, Link as LinkIcon } from "lucide-react"
import Box from "@/components/Base/Box"
import MeshosKeygen from "@/components/MeshosKeygen"
import ToolPage from "@/components/Tools/ToolPage"
import { createMetadata } from "@/lib/metadata"

export const metadata = {
    ...createMetadata({
        title: "MeshOS Keygen",
        description: "MeshOS Keygen to generate device keys.",
        path: "/misc/meshos",
    }),
    icons: { icon: { url: "/meshos/meshos.png", type: "image/png" } },
}

const downloads = [
    {
        label: "MeshOS Apk",
        links: [
            { text: "Direct", href: "https://thororen.com/meshos/meshos.apk" },
            {
                text: "Mirror 1",
                href: "https://meshoskey.com/MeshOS-v1.0.0.apk",
            },
            {
                text: "GitHub",
                href: "https://github.com/andymux/meshos-releases/releases/download/v1.0.0/app-release.apk",
            },
        ],
    },
    {
        label: "MeshOS Bin",
        links: [
            { text: "Direct", href: "https://thororen.com/meshos/meshos.bin" },
            {
                text: "Mirror 1",
                href: "https://meshoskey.com/MeshOS-TDeck-1.1.8.bin",
            },
            {
                text: "Mirror 2",
                href: "https://ndl1s62ywx.pages.dev/MeshOS-TDeck-1.1.8.bin",
            },
        ],
    },
]

export default function MeshosPage() {
    return (
        <ToolPage icon={KeyRound} title="MeshOS keygen" slug="meshos">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(16rem,2fr)]">
                <Box compact className="flex h-full flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-medium text-neutral-800 dark:text-neutral-200">
                            Generate a device key
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Enter an Android or device ID to generate a MeshOS
                            key.
                        </p>
                    </div>
                    <MeshosKeygen />
                </Box>

                <Box compact className="flex h-full flex-col gap-4">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Downloads
                    </span>
                    {downloads.map(({ label, links }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                {label}
                            </span>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {links.map((link, index) => (
                                    <Fragment key={link.href}>
                                        {index > 0 && (
                                            <span className="text-neutral-300 dark:text-neutral-700">
                                                |
                                            </span>
                                        )}
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sky-600 hover:underline dark:text-sky-400"
                                        >
                                            {link.text}
                                        </a>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="border-t border-zinc-300 pt-4 dark:border-zinc-800">
                        <a
                            href="https://meshoskey.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        >
                            <LinkIcon size={16} />
                            More info about this keygen and MeshOS
                        </a>
                    </div>
                </Box>
            </div>
        </ToolPage>
    )
}
