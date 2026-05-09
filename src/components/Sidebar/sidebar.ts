const userId = '848339671629299742'

const platformIcons = {
    web: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
    mobile: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>',
    desktop:
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>',
    embedded:
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></svg>',
    vr: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8.46 8.64a1 1 0 0 1 1 1c0 .44-.3.8-.72.92l-.11.07c-.08.06-.2.19-.2.41a.99.99 0 0 1-.98.86h-.06a1 1 0 0 1-.94-1.05l.02-.32c.05-1.06.92-1.9 1.99-1.9ZM15.55 5a5.5 5.5 0 0 1 5.15 3.67h.3a2 2 0 0 1 2 2v3.18a2 2 0 0 1-2 1.99h-.2A4.54 4.54 0 0 1 16.55 19a4.45 4.45 0 0 1-3.6-1.83 1.2 1.2 0 0 0-1.9 0 4.44 4.44 0 0 1-3.9 1.82 4.54 4.54 0 0 1-3.94-3.15H3a2 2 0 0 1-2-2v-3.18c0-1.1.9-1.99 2-1.99h.3A5.5 5.5 0 0 1 8.46 5h7.09Zm-7.1 2C6.6 7 5.06 8.5 4.97 10.41l-.02.66v3.18c0 1.43 1.05 2.66 2.34 2.74.85.06 1.63-.32 2.14-1.01a3.2 3.2 0 0 1 2.57-1.3c1 0 1.97.48 2.57 1.3.5.69 1.3 1.08 2.14 1.01 1.3-.08 2.34-1.31 2.34-2.74l-.02-3.84a3.54 3.54 0 0 0-3.49-3.43H8.45Z"/></svg>',
}

async function fetchUserData() {
    try {
        const lanyardRes = await fetch(
            `https://lanyard.equicord.org/v1/users/${userId}`,
        )
        if (!lanyardRes.ok) throw new Error('Lanyard fetch failed')

        const lanyardJson = await lanyardRes.json()
        const lanyardData = lanyardJson?.data
        const user = lanyardData?.discord_user
        const clan = user?.primary_guild

        if (clan?.tag && clan?.identity_guild_id && clan?.badge) {
            const clanBadgeContainer = document.getElementById('clan-badge-container')
            const clanBadgeImg = document.getElementById('clan-badge-img') as HTMLImageElement
            const clanBadgeName = document.getElementById('clan-badge-name')

            if (clanBadgeContainer && clanBadgeImg && clanBadgeName) {
                clanBadgeImg.src = `https://cdn.discordapp.com/clan-badges/${clan.identity_guild_id}/${clan.badge}.png?size=16`
                clanBadgeName.textContent = clan.tag
                clanBadgeContainer.classList.remove('hidden')
                clanBadgeContainer.classList.add('flex')
            }
        }

        const platformIconsContainer = document.getElementById('platform-icons')
        if (platformIconsContainer) {
            let iconsHTML = ''
            if (lanyardData?.active_on_discord_web) iconsHTML += platformIcons.web
            if (lanyardData?.active_on_discord_mobile) iconsHTML += platformIcons.mobile
            if (lanyardData?.active_on_discord_desktop) iconsHTML += platformIcons.desktop
            if (lanyardData?.active_on_discord_embedded) iconsHTML += platformIcons.embedded
            if (lanyardData?.active_on_discord_vr) iconsHTML += platformIcons.vr
            platformIconsContainer.innerHTML = iconsHTML
        }

        const customStatus = lanyardData?.activities?.find(
            (a: { type: number }) => a.type === 4,
        )
        if (customStatus?.state) {
            const customStatusContainer = document.getElementById('custom-status-container')
            const customStatusText = document.getElementById('custom-status-text')
            if (customStatusContainer && customStatusText) {
                customStatusText.textContent = customStatus.state
                customStatusContainer.classList.remove('hidden')
                customStatusContainer.classList.add('flex')
            }
        }

        const activity = lanyardData?.activities?.find(
            (a: { type: number }) => a.type !== 4,
        )
        if (activity) {
            const activityContainer = document.getElementById('activity-container')
            const activityText = document.getElementById('activity-text')
            if (activityContainer && activityText) {
                activityText.textContent = activity?.details || activity?.name || ''
                activityContainer.classList.remove('hidden')
                activityContainer.classList.add('flex')
            }
        }

        await fetchBadges()
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

async function fetchBadges() {
    try {
        const badges: any[] = []

        const badgeRes = await fetch(
            `https://badges.equicord.org/${userId}?seperated=true&capitalize=true`,
        )
        if (badgeRes.ok) {
            const badgeData = await badgeRes.json()
            if (badgeData?.badges) {
                Object.entries(badgeData.badges).forEach(([type, badgeList]) => {
                    if (Array.isArray(badgeList)) {
                        badgeList.forEach((badge) => {
                            if (badge?.badge) {
                                badges.push({
                                    tooltip: `${type}: ${badge.tooltip}`,
                                    icon: badge.badge,
                                })
                            }
                        })
                    }
                })
            }
        }

        const badgesContainer = document.getElementById('badges-container')
        if (badgesContainer && badges.length > 0) {
            badgesContainer.innerHTML = badges
                .map(
                    (badge) =>
                        `<img src="${badge.icon}" alt="${badge.tooltip}" title="${badge.tooltip}" class="size-4 rounded" />`,
                )
                .join('')
        }
    } catch (error) {
        console.error('Error fetching badges:', error)
    }
}

async function fetchTimezone() {
    const timezoneRes = await fetch(
        `https://timezone.creations.works/get?id=${userId}`,
    )
    if (timezoneRes.ok) {
        const timezoneData = await timezoneRes.json()
        return timezoneData.timezone || 'America/New_York'
    }
    return 'America/New_York'
}

function initTimezoneClock(timezone: string, elementId: string) {
    const el = document.getElementById(elementId)!
    if (!el) return

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })

    function updateTime() {
        el.textContent = formatter.format(new Date())
    }

    updateTime()
    return setInterval(updateTime, 60000)
}

; (async () => {
    await fetchUserData()
    const tz = await fetchTimezone()
    initTimezoneClock(tz, 'user-timezone-text')
})()