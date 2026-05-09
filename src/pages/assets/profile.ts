const DEFAULT_USER_ID = '848339671629299742'
const DEFAULT_FALLBACK_URL = '/assets/fallback.png'

async function getFallbackImage(fallbackUrl: string) {
    const response = await fetch(fallbackUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch fallback image')
    }
    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer)
}

async function getDiscordAvatar(userId: string) {
    const lanyardResponse = await fetch(`https://lanyard.equicord.org/v1/users/${userId}`)
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

    const avatarBuffer = await avatarResponse.arrayBuffer()
    return Buffer.from(avatarBuffer)
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') ?? DEFAULT_USER_ID
    const fallbackUrl = searchParams.get('fallbackUrl') ?? DEFAULT_FALLBACK_URL

    try {
        const imageBuffer = await getDiscordAvatar(userId)
        return new Response(imageBuffer, {
            headers: { 'Content-Type': 'image/png' },
        })
    } catch {
        try {
            const fallbackBuffer = await getFallbackImage(fallbackUrl)
            return new Response(fallbackBuffer, {
                headers: { 'Content-Type': 'image/png' },
            })
        } catch {
            return new Response('Failed to load image', { status: 500 })
        }
    }
}