import { Fragment } from 'react'
import { Link } from 'lucide-react'
import Box from '@/components/Base/Box'
import MeshosKeygen from '@/components/MeshosKeygen'
import { createMetadata } from '@/lib/metadata'

export const metadata = {
    ...createMetadata({
        title: 'MeshOS Keygen',
        description: 'MeshOS Keygen to generate device keys.',
        path: '/meshos',
    }),
    icons: { icon: { url: '/meshos/meshos.png', type: 'image/png' } },
}

const downloads = [
    {
        label: 'MeshOS Apk',
        links: [
            { text: 'Direct', href: 'https://thororen.com/meshos/meshos.apk' },
            {
                text: 'Mirror 1',
                href: 'https://meshoskey.com/MeshOS-v1.0.0.apk',
            },
            {
                text: 'GitHub',
                href: 'https://github.com/andymux/meshos-releases/releases/download/v1.0.0/app-release.apk',
            },
        ],
    },
    {
        label: 'MeshOS Bin',
        links: [
            { text: 'Direct', href: 'https://thororen.com/meshos/meshos.bin' },
            {
                text: 'Mirror 1',
                href: 'https://meshoskey.com/MeshOS-TDeck-1.1.8.bin',
            },
            {
                text: 'Mirror 2',
                href: 'https://ndl1s62ywx.pages.dev/MeshOS-TDeck-1.1.8.bin',
            },
        ],
    },
]

export default function Meshos() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md font-mono">
                <Box className="flex flex-col gap-4">
                    <div className="mb-2 text-sm font-bold tracking-widest text-neutral-800 dark:text-neutral-200">
                        MeshOS Keygen
                    </div>

                    <MeshosKeygen />

                    <div className="mt-2 flex flex-col gap-4 border-t border-zinc-300 pt-4 dark:border-zinc-800">
                        {downloads.map(({ label, links }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <span className="text-xs font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
                                    {label}
                                </span>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    {links.map((link, i) => (
                                        <Fragment key={link.href}>
                                            {i > 0 && (
                                                <span className="text-neutral-300 dark:text-neutral-700">
                                                    |
                                                </span>
                                            )}
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                className="text-sky-600 hover:underline dark:text-sky-400"
                                            >
                                                {link.text}
                                            </a>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="pt-1">
                            <a
                                href="https://meshoskey.com/"
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                            >
                                <Link size={16} />
                                <span>
                                    More info about this keygen and MeshOS{' '}
                                </span>
                            </a>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    )
}
