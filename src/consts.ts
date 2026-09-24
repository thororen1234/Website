import type { Info, MiscPage, NavLink, Social, Project } from "./types"
import {
    Archive,
    Bot,
    Clock,
    Hash,
    Heart,
    House,
    KeyRound,
    MapPin,
    MessageSquareCode,
    Notebook,
    PackageSearch,
    Palette,
    Pickaxe,
    Radio,
    Shapes,
    User,
    Wrench,
} from "lucide-react"
import Github from "./components/Icons/Github"
import Twitter from "./components/Icons/Twitter"
import LastFM from "./components/Icons/LastFM"
import Codeberg from "./components/Icons/Codeberg"
import Discord from "./components/Icons/Discord"
import Steam from "./components/Icons/Steam"

export const siteUrl = "https://www.thororen.com"
export const discordUserId = "848339671629299742"
export const pfpFallback = "/assets/avatar/fallback.png"
export const githubUser = "thororen1234"
export const lastfmUser = "thororen"
export const lastfmApiKey = "ac7abdcfbbad42c788e072bbe43f1be6"

export const malUsername = "thororen"
export const steamId = "76561198278966555"
export const mcUsername = "thororen"
export const mcUuid = "64acee6ee5e14ba881146464cca7989c"

export const liveRefreshSeconds = 15

export const bio =
    "Hi! I'm Thor! I'm a software developer from the United States of America with experience in languages such as TypeScript, JavaScript, Python, and Go."

export const navLinks: NavLink[] = [
    { text: "Home", href: "/", icon: House },
    { text: "Projects", href: "/projects", icon: Notebook },
    { text: "Now", href: "/now", icon: Radio },
    { text: "Discord", href: "/discord", icon: Discord },
    { text: "Misc", href: "/misc", icon: Shapes },
]

export const discordPages: MiscPage[] = [
    {
        title: "Discord Module Explorer",
        description:
            "Browse, search and cross-reference the webpack modules of recent Discord builds.",
        href: "/discord/modules",
        icon: PackageSearch,
    },
    {
        title: "Embed Color Converter",
        description:
            "Convert between hex, decimal, RGB and HSL values for Discord embed colors.",
        href: "/discord/color",
        icon: Palette,
    },
    {
        title: "Bot Invite Generator",
        description:
            "Build a Discord bot invite link and inspect its permission number.",
        href: "/discord/bot-invite",
        icon: Bot,
    },
    {
        title: "Snowflake Decoder",
        description:
            "Paste a Discord ID, mention or message link to see when it was created.",
        href: "/discord/snowflake",
        icon: Hash,
    },
    {
        title: "Timestamp Generator",
        description:
            "Make Discord timestamp codes that show the right time for everyone.",
        href: "/discord/timestamp",
        icon: Clock,
    },
    {
        title: "Discord Markdown Preview",
        description:
            "Preview Discord markdown, spoilers, quotes and code blocks before you send them.",
        href: "/discord/markdown",
        icon: MessageSquareCode,
    },
]

export const miscPages: MiscPage[] = [
    {
        title: "Developer Tools",
        description:
            "Encode Base64, format JSON and generate hashes without sending your text anywhere.",
        href: "/misc/dev-tools",
        icon: Wrench,
    },
    {
        title: "Minecraft Formatting",
        description:
            "Preview Minecraft color and style codes written with & or §.",
        href: "/misc/minecraft-formatting",
        icon: Pickaxe,
    },
    {
        title: "MeshOS Keygen",
        description:
            "Generate device keys for MeshOS, with APK and firmware downloads.",
        href: "/misc/meshos",
        icon: KeyRound,
    },
    {
        title: "Beycord",
        description:
            "A small memorial for the Beycord Discord bot, which stopped running on April 1st, 2021.",
        href: "/beycord",
        icon: Archive,
    },
]

export const information: Info[] = [
    {
        icon: MapPin,
        text: "United States",
    },
    {
        icon: User,
        text: "He/Him",
    },
]

export const socials: Social[] = [
    {
        text: "Donate",
        url: "https://github.com/sponsors/thororen1234",
        icon: Heart,
    },
    {
        text: "GitHub",
        url: "https://github.com/thororen1234",
        icon: Github,
    },
    {
        text: "Codeberg",
        url: "https://codeberg.org/thororen",
        icon: Codeberg,
    },
    {
        text: "Twitter",
        url: "https://x.com/thororen",
        icon: Twitter,
    },
    {
        text: "Last.fm",
        url: "https://www.last.fm/user/thororen",
        icon: LastFM,
    },
    ...(steamId
        ? [
              {
                  text: "Steam",
                  url: /^\d{17}$/.test(steamId)
                      ? `https://steamcommunity.com/profiles/${steamId}`
                      : `https://steamcommunity.com/id/${steamId}`,
                  icon: Steam,
              },
          ]
        : []),
    {
        text: "Discord",
        url: `https://discord.com/users/${discordUserId}`,
        icon: Discord,
    },
]

export const projects: Project[] = [
    {
        slug: "equicord",
        start: 2023,
        title: "Equicord",
        description:
            "The other cutest Discord mod. A fork of Vencord which just adds more plugins and features.",
        url: "https://equicord.org",
        github: "https://github.com/Equicord",
        icon: "/assets/icons/equicord.png",
        details: [
            "It ships with 300+ plugins on top of the base client mod and installs through GUI or CLI installers on Windows, macOS and Linux, or can be built from source with pnpm.",
        ],
        tags: ["TypeScript", "Node.js", "Go", "Rust", "SolidJS"],
        tasks: [
            "Maintaining the project",
            "Working across the entire codebase",
        ],
    },
    {
        slug: "cheatbreaker",
        start: 2023,
        title: "CheatBreaker",
        description:
            "CheatBreaker is a free FPS-boosting modpack for Minecraft.",
        url: "https://cheatbreaker.net",
        github: "https://github.com/CheatBreakerNet",
        icon: "/assets/icons/cheatbreaker.png",
        details: [
            "It targets Minecraft 1.7 and 1.8 and comes with an integrated launcher, Discord integration and cosmetics.",
        ],
        tags: ["Java", "Kotlin", "Python", "TypeScript"],
        tasks: [
            "Helping with the development, flushing out, and features of the new website",
            "Helping with the development and features of the new launcher",
        ],
    },
    {
        slug: "disbored",
        start: 2025,
        title: "Disbored",
        description:
            "Disbored (aka surg) is just a giant repository org handling Discord bots, prs to places, websites and more.",
        url: "https://surg.fyi/",
        github: "https://github.com/disbored",
        icon: "/assets/icons/disbored.png",
        details: ["The organization is verified for the surg.fyi domain."],
        tags: ["TypeScript", "JavaScript", "C#", "Express"],
        tasks: [
            "Contributing Discord bots, tools, and websites across the org",
            "Sending PRs to other projects under the org",
        ],
    },
    {
        slug: "surge",
        start: 2024,
        end: 2025,
        title: "Surge",
        description:
            "Surge was a continuation of Hybris after it was abandoned and was greatly expanded upon but ultimately abandoned as well.",
        github: "https://github.com/SurgeLauncher",
        icon: "/assets/icons/surge.png",
        details: [
            "The organization's only public repository holds the Surge Launcher's translation files (MIT licensed JSON). The launcher's own source isn't public.",
        ],
        tasks: [
            "Moderated the community",
            "Suggested ideas and features",
            "Helped with bug testing",
            "Contributed to client development",
        ],
    },
    {
        slug: "hybris",
        start: 2023,
        end: 2023,
        title: "Hybris",
        description:
            "Hybris was a Minecraft client that was built around the success of Solar Tweaks after it permanently shut down but was abandoned.",
        url: "https://hybrismc.dev",
        github: "https://github.com/hybrismc",
        icon: "/assets/icons/hybris.png",
        details: [
            'It was free and open source under GPL-3.0, billed by the organization as "the ultimate Minecraft client".',
        ],
        tags: ["Kotlin", "TypeScript"],
        tasks: [
            "Moderated the community",
            "Suggested ideas and features",
            "Helped with bug testing",
        ],
    },
    {
        slug: "solar-tweaks",
        start: 2022,
        end: 2023,
        title: "Solar Tweaks",
        description:
            "Solar Tweaks is a custom Lunar Client launcher that provides different modifications for the client.",
        github: "https://github.com/Solar-Tweaks",
        icon: "/assets/icons/solartweaks.png",
        details: [
            "Its modifications included freelook and server customization.",
            "The organization announced it ceased operations on May 5, 2023.",
        ],
        tags: ["TypeScript", "JavaScript"],
        tasks: [
            "Moderated the community",
            "Suggested ideas and features",
            "Helped with bug testing",
        ],
    },
    {
        slug: "neoblade",
        start: 2022,
        end: 2022,
        title: "Neoblade",
        description:
            "Neoblade was a continuation of Beycord after multiple attempts from others such as Beycord+ or Beycord (2021) but was considered a failed project and abandoned.",
        github: "https://github.com/thororen1234/Beycord/tree/neoblade",
        icon: "/assets/icons/neoblade.png",
        details: [
            "It lives on as a branch of the Beycord repository, a mash-up of Beycord+, Beycord and Beycord Rewrite with extra beys and features, kept for archival purposes.",
            "It is a Node.js Discord bot with commands, a quest and item system, and Beyblade parts and bey data organized in their own folders.",
        ],
        tags: ["JavaScript", "Node.js"],
        tasks: [
            "Built on the open source Beycord and Beycord+ codebases",
            "Designed new commands and features",
        ],
    },
    {
        slug: "beycord",
        start: 2020,
        end: 2021,
        title: "Beycord",
        description:
            "Beycord is an open source Discord bot dedicated to bringing the fun and memes of Beyblade into Discord.",
        url: "https://thororen.com/beycord",
        github: "https://github.com/thororen1234/Beycord",
        icon: "/assets/icons/beycord.png",
        details: [
            "Beycord was created by SunSOG as a hobby to learn programming and improve his English. It stopped running on April 1, 2021 and was later opened up as an open-source archive.",
            "The repository preserves several generations of the bot: Beycord Original, Packaged and V13, Beycord+, Neoblade, and the related Beyblade-crafting tools BCWorkshop and BeyKit.",
        ],
        tags: ["JavaScript", "Node.js", "Discord.js"],
        tasks: [
            "Suggested ideas and features for the bot",
            "Helped with bug testing",
            "Moderated the community",
        ],
    },
]

const friendsList = [
    {
        url: "https://naibuu.dev",
        fallback: "https://avatars.githubusercontent.com/u/81579850",
        alt: "itsnaibuu",
        name: "Naibuu",
        id: "1120045713867423835",
    },
    {
        url: "https://creations.works",
        fallback: "https://creations.works/api/pfp",
        alt: "creations",
        name: "creations",
        id: "209830981060788225",
    },
    {
        url: "https://krystal.thororen.com",
        fallback: "https://avatars.githubusercontent.com/u/150982280",
        alt: "krystalskull",
        name: "Krystal",
        id: "929208515883569182",
    },
]

export const friends = friendsList.map(({ fallback, ...f }) => ({
    ...f,
    img: `/assets/profile?userId=${f.id}`,
}))

export const avatarFallbacks = new Map<string, string>([
    [discordUserId, pfpFallback],
    ...friendsList.map((f) => [f.id, f.fallback] as [string, string]),
])
