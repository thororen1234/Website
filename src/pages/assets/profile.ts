// https://github.com/thororen1234/website/blob/main/src/pages/assets/profile.ts

const userId = '1120045713867423835'
const fallbackUrl = 'https://naibuu.dev/assets/fallback.png'

async function getFallback(): Promise<ArrayBuffer> {
    const response = await fetch(fallbackUrl)

    if (!response.ok) {
        throw new Error('Failed to fetch fallback image')
    }

    // const buffer = await response.arrayBuffer()
    return response.arrayBuffer()
}

async function getAvatar(): Promise<ArrayBuffer> {
    const lanyardUrl = `https://api.lanyard.rest/v1/users/${userId}`
    const lanyard = await fetch(lanyardUrl)

    if (!lanyard.ok) {
        throw new Error('Failed to fetch lanyard')
    }

    const lanyardJson = await lanyard.json()
    const user = lanyardJson?.data?.discord_user

    if (!user?.id || !user?.avatar) {
        throw new Error('Missing discord data')
    }

    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
    const avatar = await fetch(avatarUrl)

    if (!avatar.ok) {
        throw new Error('Failed to fetch avatar')
    }

    // const buffer = await avatar.arrayBuffer()
    return avatar.arrayBuffer()
}

export async function GET(): Promise<Response> {
    try {
        const avatar = await getAvatar()
        return new Response(avatar)
    } catch (error) {
        const fallback = await getFallback()
        return new Response(fallback)
    }
}
