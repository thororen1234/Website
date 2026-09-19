import { ArrowUpRight } from "lucide-react"

interface Props {
    url: string
    img: string
    alt: string
    name: string
}

export default function FriendCard({ url, img, alt, name }: Props) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-0.5 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
            <img
                src={img}
                alt={alt}
                draggable={false}
                className="size-8 shrink-0 rounded-full bg-zinc-300 object-cover select-none dark:bg-zinc-800"
            />

            <span className="min-w-0 truncate text-sm font-medium text-neutral-800 transition-colors group-hover:text-rose-500 dark:text-neutral-200">
                {name}
            </span>

            <ArrowUpRight
                size={16}
                className="ml-auto shrink-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100"
            />
        </a>
    )
}
