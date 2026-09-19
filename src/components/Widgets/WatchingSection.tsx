import { Star, Tv } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import { getWatching } from "@/lib/mal"

export default async function WatchingSection() {
    const anime = await getWatching()
    if (!anime?.length) return null

    return (
        <Section icon={Tv} title="Watching">
            <Box compact>
                <ul className="flex flex-col divide-y divide-zinc-300 dark:divide-zinc-800">
                    {anime.map((show) => (
                        <li key={show.id} className="first:pt-0 last:pb-0">
                            <a
                                href={show.url}
                                target="_blank"
                                className="group flex items-center gap-3 py-2.5"
                            >
                                {show.image ? (
                                    <img
                                        src={show.image}
                                        alt=""
                                        width={40}
                                        height={56}
                                        draggable={false}
                                        className="h-14 w-10 shrink-0 rounded-md object-cover select-none"
                                    />
                                ) : (
                                    <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-200 text-neutral-500 dark:bg-zinc-800">
                                        <Tv size={18} />
                                    </span>
                                )}

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-neutral-800 group-hover:text-rose-500 dark:text-neutral-200">
                                        {show.title}
                                    </span>
                                    <span className="text-sm text-neutral-500 tabular-nums dark:text-neutral-400">
                                        Episode {show.watched}
                                        {show.total ? ` of ${show.total}` : ""}
                                    </span>
                                </div>

                                {show.score && (
                                    <span className="flex shrink-0 items-center gap-1 text-sm text-neutral-500 tabular-nums dark:text-neutral-400">
                                        <Star size={14} /> {show.score}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </Box>
        </Section>
    )
}
