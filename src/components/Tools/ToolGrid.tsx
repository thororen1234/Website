import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { MiscPage } from "@/types"

export default function ToolGrid({ pages }: { pages: MiscPage[] }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {pages.map(({ title, description, href, icon: Icon }) => (
                <Link
                    key={href}
                    href={href}
                    className="group flex flex-col gap-3 rounded-2xl border border-zinc-300 bg-zinc-100 px-6 py-5 text-neutral-800 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:border-zinc-700"
                >
                    <h3 className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                        <Icon size={20} />
                        {title}
                        <ArrowRight
                            size={16}
                            className="ml-auto text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-500"
                        />
                    </h3>

                    <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        {description}
                    </p>
                </Link>
            ))}
        </div>
    )
}
