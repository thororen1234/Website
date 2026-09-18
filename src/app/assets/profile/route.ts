import { avatarFallbacks, discordUserId, siteUrl } from '@/consts'

async function getFallbackImage(fallbackUrl: string) {
    const absoluteUrl = new URL(fallbackUrl, siteUrl).toString()
    const response = await fetch(absoluteUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch fallback image')
    }
    return response.arrayBuffer()
}

async function getDiscordAvatar(userId: string) {
    const lanyardResponse = await fetch(
        `https://lanyard.equicord.org/v1/users/${userId}`,
    )
    if (!lanyardResponse.ok) {
        throw new Error('Lanyard fetch failed')
    }

    const lanyardJson = await lanyardResponse.json()
    const user = lanyardJson?.data?.discord_user
    if (!user?.id || !user?.avatar) {
        throw new Error('Missing Discord avatar data')
    }

    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
    const avatarResponse = await fetch(avatarUrl)
    if (!avatarResponse.ok) {
        throw new Error('Discord avatar fetch failed')
    }

    return avatarResponse.arrayBuffer()
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') ?? discordUserId

    // Only known users are served, so callers can't choose which URLs we fetch
    const fallbackUrl = avatarFallbacks.get(userId)
    if (!fallbackUrl) {
        return new Response('Unknown user', { status: 404 })
    }

    try {
        const image = await getDiscordAvatar(userId)
        return new Response(image, {
            headers: { 'Content-Type': 'image/png' },
        })
    } catch {
        try {
            const fallback = await getFallbackImage(fallbackUrl)
            return new Response(fallback, {
                headers: { 'Content-Type': 'image/png' },
            })
        } catch {
            return new Response('Failed to load image', { status: 500 })
        }
    }
}
