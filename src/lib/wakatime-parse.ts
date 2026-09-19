export interface Language {
    name: string
    seconds: number
    percent: number
}

export interface CodingStats {
    totalSeconds: number
    languages: Language[]
}

interface RawLanguage {
    name?: string
    total_seconds?: number
    percent?: number
}

export function parseCodingStats(json: unknown): CodingStats | null {
    const data = (
        json as {
            data?: { total_seconds?: number; languages?: RawLanguage[] }
        }
    )?.data
    const totalSeconds = data?.total_seconds
    if (typeof totalSeconds !== "number") return null

    const languages = (data?.languages ?? [])
        .filter(
            (language) => language.name && (language.total_seconds ?? 0) > 0,
        )
        .map((language) => ({
            name: language.name!,
            seconds: language.total_seconds!,
            percent:
                language.percent ??
                (totalSeconds > 0
                    ? (language.total_seconds! / totalSeconds) * 100
                    : 0),
        }))
        .sort((a, b) => b.seconds - a.seconds)

    return { totalSeconds, languages }
}
