import { Code } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import { formatDuration } from "@/lib/text"
import { getCodingStats } from "@/lib/wakatime"
import type { Language } from "@/lib/wakatime-parse"

const VISIBLE_LANGUAGES = 6

function LanguageRow({ name, seconds, percent }: Language) {
    return (
        <li className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-neutral-800 dark:text-neutral-200">
                    {name}
                </span>
                <span className="shrink-0 text-neutral-500 tabular-nums dark:text-neutral-400">
                    {formatDuration(seconds)} ·{" "}
                    {percent < 1 ? "<1" : Math.round(percent)}%
                </span>
            </div>

            <div
                className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
                aria-hidden
            >
                <div
                    className="h-full rounded-full bg-rose-600"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
            </div>
        </li>
    )
}

export default async function CodingSection() {
    const stats = await getCodingStats()
    if (!stats || stats.totalSeconds <= 0) return null

    const shown = stats.languages.slice(0, VISIBLE_LANGUAGES)
    const rest = stats.languages.slice(VISIBLE_LANGUAGES)

    return (
        <Section icon={Code} title="Coding">
            <Box compact className="flex flex-col gap-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-neutral-800 tabular-nums dark:text-neutral-200">
                        {formatDuration(stats.totalSeconds)}
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        in the last 7 days
                    </span>
                </div>

                {shown.length > 0 && (
                    <ul className="flex flex-col gap-3">
                        {shown.map((language) => (
                            <LanguageRow key={language.name} {...language} />
                        ))}
                    </ul>
                )}

                {rest.length > 0 && (
                    <details className="group">
                        <summary className="w-fit cursor-pointer text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400">
                            <span className="group-open:hidden">
                                Show {rest.length} more
                            </span>
                            <span className="hidden group-open:inline">
                                Show less
                            </span>
                        </summary>

                        <ul className="mt-3 flex flex-col gap-3">
                            {rest.map((language) => (
                                <LanguageRow
                                    key={language.name}
                                    {...language}
                                />
                            ))}
                        </ul>
                    </details>
                )}
            </Box>
        </Section>
    )
}
