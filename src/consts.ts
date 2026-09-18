import type { Info, Social, Skill, Project } from './types'
import {
    AlarmClock,
    BookOpen,
    Heart,
    ListMusic,
    MapPin,
    User,
} from '@lucide/astro'
import Github from './components/Icons/Github.astro'
import Twitter from './components/Icons/Twitter.astro'

import Desktop from './assets/desktop.svg'
import Embedded from './assets/embedded.svg'
import LastFM from './assets/lastfm.svg'
import Mobile from './assets/mobile.svg'
import Web from './assets/web.svg'

export const discordUserId = '848339671629299742'
export const pfpFallback = '/assets/fallback.png'

export const information: Info[] = [
    {
        icon: MapPin,
        text: 'United States',
    },
    {
        icon: User,
        text: 'He/Him',
    },
]

export const MiscIcons = {
    User: User,
    AlarmClock: AlarmClock,
    BookOpen: BookOpen,
    ListMusic: ListMusic,
}

export const platforms = {
    Web: Web,
    Mobile: Mobile,
    Desktop: Desktop,
    Embedded: Embedded,
}

export const socials: Social[] = [
    {
        text: 'Donate',
        url: 'https://github.com/sponsors/thororen1234',
        icon: Heart,
    },
    {
        text: 'Twitter',
        url: 'https://x.com/thororen',
        icon: Twitter,
    },
    {
        text: 'Github',
        url: 'https://github.com/thororen1234',
        icon: Github,
    },
    {
        text: 'Last.FM',
        url: 'https://www.last.fm/user/thororen',
        icon: LastFM,
    },
]

export const skills: Skill[] = [
    {
        text: 'Software engineering',
        description: 'JavaScript, TypeScript, and more',
        progress: 95,
    },
    {
        text: 'Software development',
        description: 'Visual Studio Code',
        progress: 85,
    },
    {
        text: 'Web development',
        description: 'SSR Frameworks and React',
        progress: 75,
    },
]

export const projects: Project[] = [
    {
        start: 2023,
        title: 'Equicord',
        description: 'The other cutest Discord mod. A fork of Vencord which just adds more plugins and features.',
        url: 'https://equicord.org',
        icon: '/assets/icons/equicord.png',
        tasks: [
            'Maintaining the project',
            'Working across the entire codebase',
        ],
    },
    {
        start: 2023,
        title: 'CheatBreaker',
        description:
            'CheatBreaker is a free FPS-boosting modpack for Minecraft.',
        url: 'https://cheatbreaker.net',
        icon: '/assets/icons/cheatbreaker.png',
        tasks: ['Collaborated with the team on developing a new launcher'],
    },
    {
        start: 2025,
        title: 'Disbored',
        description:
            'Disbored (aka surg) is just a giant repository org handling Discord bots, prs to places, websites and more.',
        url: 'https://surg.fyi/',
        icon: '/assets/icons/disbored.png',
    },
    {
        start: 2024,
        end: 2025,
        title: 'Surge',
        description:
            'Surge was a continuation of Hybris after it was abandoned and was greatly expanded upon but ultimately abandoned as well.',
        url: 'https://github.com/SurgeLauncher',
        icon: '/assets/icons/surge.png',
    },
    {
        start: 2023,
        end: 2023,
        title: 'Hybris',
        description:
            'Hybris was a Minecraft client that was built around the success of Solar Tweaks after it permanently shut down but was abandoned.',
        url: 'https://github.com/hybrismc',
        icon: '/assets/icons/hybris.png',
    },
    {
        start: 2022,
        end: 2023,
        title: 'Solar Tweaks',
        description:
            'Solar Tweaks is a custom Lunar Client launcher that provides different modifications for the client.',
        url: 'https://github.com/hybrismc',
        icon: '/assets/icons/solartweaks.png',
    },
    {
        start: 2022,
        end: 2022,
        title: 'Neoblade',
        description:
            'Neoblade was a continuation of Beycord after multiple attempts from others such as Beycord+ or Beycord (2021) but was considered a failed project and abandoned.',
        url: 'https://github.com/disbored/beycord',
        icon: '/assets/icons/neoblade.png',
    },
    {
        start: 2020,
        end: 2021,
        title: 'Beycord',
        description:
            'Beycord is an open source Discord bot dedicated to bringing the fun and memes of Beyblade into Discord.',
        url: 'https://thororen.com/beycord',
        icon: '/assets/icons/beycord.png',
    },
]

const friendsList = [
    {
        url: 'https://www.naibuu.dev',
        fallback: 'https://avatars.githubusercontent.com/u/81579850',
        alt: 'itsnaibuu',
        name: 'Naibuu',
        id: '1120045713867423835',
    },
    {
        url: 'https://creations.works',
        fallback: 'https://creations.works/api/pfp',
        alt: 'creations',
        name: 'creations',
        id: '209830981060788225',
    },
    {
        url: 'https://krystal.thororen.com',
        fallback: 'https://avatars.githubusercontent.com/u/150982280',
        alt: 'krystalskull',
        name: 'Krystal',
        id: '929208515883569182',
    },
]

export const friends = friendsList.map(({ fallback, ...f }) => ({
    ...f,
    img: `/assets/profile?userId=${f.id}&fallbackUrl=${encodeURIComponent(fallback)}`,
}))
