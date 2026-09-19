export function excerpt(text: string, max: number) {
    if (text.length <= max) return text

    const cut = text.slice(0, max)
    const sentenceEnd = cut.lastIndexOf(". ")
    if (sentenceEnd > max / 2) return cut.slice(0, sentenceEnd + 1)

    return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[.,;:\s]+$/, "")}…`
}

export function formatDuration(totalSeconds: number) {
    const minutes = Math.round(totalSeconds / 60)
    const hours = Math.floor(minutes / 60)
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
}
