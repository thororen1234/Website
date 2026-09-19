import { Headphones, Music } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import { getRecentTracks } from "@/lib/lastfm"

const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
})

export default async function ListeningSection() {
    const tracks = await getRecentTracks()
    if (!tracks?.length) return null

    return (
        <Section icon={Headphones} title="Listening">
            <Box compact>
                <ul className="flex flex-col divide-y divide-zinc-300 dark:divide-zinc-800">
                    {tracks.map((track) => (
                        <li
                            key={`${track.url}-${track.playedAt}`}
                            className="first:pt-0 last:pb-0"
                        >
                            <a
                                href={track.url}
                                target="_blank"
                                className="group flex items-center gap-3 py-2.5"
                            >
                                {track.image ? (
                                    <img
                                        src={track.image}
                                        alt=""
                                        width={40}
                                        height={40}
                                        draggable={false}
                                        className="size-10 shrink-0 rounded-md select-none"
                                    />
                                ) : (
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-200 text-neutral-500 dark:bg-zinc-800">
                                        <Music size={18} />
                                    </span>
                                )}

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="flex items-baseline gap-2 text-neutral-800 group-hover:text-rose-500 dark:text-neutral-200">
                                        <span className="truncate">
                                            {track.name}
                                        </span>
                                        {track.plays > 1 && (
                                            <span className="shrink-0 text-xs text-neutral-500 tabular-nums dark:text-neutral-400">
                                                ×{track.plays}
                                            </span>
                                        )}
                                    </span>
                                    <span className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                                        {track.artist}
                                    </span>
                                </div>

                                {track.nowPlaying ? (
                                    <span className="shrink-0 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-neutral-800 dark:text-neutral-300">
                                        Now playing
                                    </span>
                                ) : (
                                    track.playedAt && (
                                        <time
                                            dateTime={track.playedAt}
                                            className="shrink-0 text-sm text-neutral-500 tabular-nums dark:text-neutral-400"
                                        >
                                            {dateFormat.format(
                                                new Date(track.playedAt),
                                            )}
                                        </time>
                                    )
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </Box>
        </Section>
    )
}
