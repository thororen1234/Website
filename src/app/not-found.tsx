import { TriangleAlert } from 'lucide-react'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
    title: 'thororen',
    description: 'Page not found.',
})

export default function NotFound() {
    return (
        <div className="flex h-dvh w-full flex-col items-center justify-center gap-2">
            <p className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-200">
                <TriangleAlert size={18} fill="#ffffff10" /> The page
                you&apos;re looking for is not found!
            </p>

            <a
                href="/"
                className="rounded-lg bg-red-400 px-3 py-2 font-semibold text-zinc-950 transition hover:opacity-80"
            >
                Return
            </a>
        </div>
    )
}
