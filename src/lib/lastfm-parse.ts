export interface Track {
    name: string
    artist: string
    url: string
    image: string | null
    nowPlaying: boolean
    playedAt: string | null
    plays: number
}

interface LastfmTrack {
    name?: string
    url?: string
    artist?: { "#text"?: string }
    image?: { "#text"?: string; size?: string }[]
    date?: { uts?: string }
    "@attr"?: { nowplaying?: string }
}

const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f"

export function parseRecentTracks(json: unknown, limit = 5): Track[] {
    const raw = (
        json as { recenttracks?: { track?: LastfmTrack | LastfmTrack[] } }
    )?.recenttracks?.track
    const list = Array.isArray(raw) ? raw : raw ? [raw] : []

    return list
        .filter((track) => track.name && track.url)
        .slice(0, limit)
        .map((track) => {
            const art = track.image?.findLast((image) => image["#text"])?.[
                "#text"
            ]
            const uts = Number(track.date?.uts)

            return {
                name: track.name!,
                artist: track.artist?.["#text"] ?? "",
                url: track.url!,
                image: art && !art.includes(PLACEHOLDER) ? art : null,
                nowPlaying: track["@attr"]?.nowplaying === "true",
                playedAt: uts ? new Date(uts * 1000).toISOString() : null,
                plays: 1,
            }
        })
}

export function collapseRepeats(tracks: Track[]): Track[] {
    const collapsed: Track[] = []

    for (const track of tracks) {
        const previous = collapsed.at(-1)
        if (previous && previous.url === track.url) {
            previous.plays += track.plays
        } else {
            collapsed.push({ ...track })
        }
    }

    return collapsed
}
