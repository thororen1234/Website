export interface Permission {
    name: string
    label: string
    group: string
    bit: number
}

export const PERMISSION_GROUPS = [
    "General",
    "Membership",
    "Text",
    "Voice",
    "Apps",
    "Events",
    "Advanced",
    "Other",
]

export const PERMISSIONS: Permission[] = [
    {
        name: "ManageChannels",
        label: "Manage Channels",
        group: "General",
        bit: 4,
    },
    { name: "ManageGuild", label: "Manage Server", group: "General", bit: 5 },
    { name: "ViewAuditLog", label: "View Audit Log", group: "General", bit: 7 },
    { name: "ViewChannel", label: "View Channels", group: "General", bit: 10 },
    {
        name: "ViewGuildInsights",
        label: "View Server Insights",
        group: "General",
        bit: 19,
    },
    { name: "ManageRoles", label: "Manage Roles", group: "General", bit: 28 },
    {
        name: "ManageWebhooks",
        label: "Manage Webhooks",
        group: "General",
        bit: 29,
    },
    {
        name: "ManageGuildExpressions",
        label: "Manage Expressions",
        group: "General",
        bit: 30,
    },
    {
        name: "CreateGuildExpressions",
        label: "Create Expressions",
        group: "General",
        bit: 43,
    },
    {
        name: "CreateInstantInvite",
        label: "Create Invite",
        group: "Membership",
        bit: 0,
    },
    { name: "KickMembers", label: "Kick Members", group: "Membership", bit: 1 },
    { name: "BanMembers", label: "Ban Members", group: "Membership", bit: 2 },
    {
        name: "ChangeNickname",
        label: "Change Nickname",
        group: "Membership",
        bit: 26,
    },
    {
        name: "ManageNicknames",
        label: "Manage Nicknames",
        group: "Membership",
        bit: 27,
    },
    {
        name: "ModerateMembers",
        label: "Timeout Members",
        group: "Membership",
        bit: 40,
    },
    { name: "AddReactions", label: "Add Reactions", group: "Text", bit: 6 },
    { name: "SendMessages", label: "Send Messages", group: "Text", bit: 11 },
    {
        name: "SendTTSMessages",
        label: "Send Text-to-Speech Messages",
        group: "Text",
        bit: 12,
    },
    {
        name: "ManageMessages",
        label: "Manage Messages",
        group: "Text",
        bit: 13,
    },
    { name: "EmbedLinks", label: "Embed Links", group: "Text", bit: 14 },
    { name: "AttachFiles", label: "Attach Files", group: "Text", bit: 15 },
    {
        name: "ReadMessageHistory",
        label: "Read Message History",
        group: "Text",
        bit: 16,
    },
    {
        name: "MentionEveryone",
        label: "Mention Everyone",
        group: "Text",
        bit: 17,
    },
    {
        name: "UseExternalEmojis",
        label: "Use External Emoji",
        group: "Text",
        bit: 18,
    },
    { name: "ManageThreads", label: "Manage Threads", group: "Text", bit: 34 },
    {
        name: "CreatePublicThreads",
        label: "Create Public Threads",
        group: "Text",
        bit: 35,
    },
    {
        name: "CreatePrivateThreads",
        label: "Create Private Threads",
        group: "Text",
        bit: 36,
    },
    {
        name: "UseExternalStickers",
        label: "Use External Stickers",
        group: "Text",
        bit: 37,
    },
    {
        name: "SendMessagesInThreads",
        label: "Send Messages in Threads",
        group: "Text",
        bit: 38,
    },
    {
        name: "SendVoiceMessages",
        label: "Send Voice Messages",
        group: "Text",
        bit: 46,
    },
    { name: "SendPolls", label: "Create Polls", group: "Text", bit: 49 },
    { name: "PinMessages", label: "Pin Messages", group: "Text", bit: 51 },
    {
        name: "BypassSlowmode",
        label: "Bypass Slowmode",
        group: "Text",
        bit: 52,
    },
    {
        name: "PrioritySpeaker",
        label: "Priority Speaker",
        group: "Voice",
        bit: 8,
    },
    { name: "Stream", label: "Video", group: "Voice", bit: 9 },
    { name: "Connect", label: "Connect", group: "Voice", bit: 20 },
    { name: "Speak", label: "Speak", group: "Voice", bit: 21 },
    { name: "MuteMembers", label: "Mute Members", group: "Voice", bit: 22 },
    { name: "DeafenMembers", label: "Deafen Members", group: "Voice", bit: 23 },
    { name: "MoveMembers", label: "Move Members", group: "Voice", bit: 24 },
    { name: "UseVAD", label: "Use Voice Activity", group: "Voice", bit: 25 },
    { name: "UseSoundboard", label: "Use Soundboard", group: "Voice", bit: 42 },
    {
        name: "UseExternalSounds",
        label: "Use External Sounds",
        group: "Voice",
        bit: 45,
    },
    {
        name: "SetVoiceChannelStatus",
        label: "Set Voice Channel Status",
        group: "Voice",
        bit: 48,
    },
    {
        name: "UseApplicationCommands",
        label: "Use Application Commands",
        group: "Apps",
        bit: 31,
    },
    {
        name: "UseEmbeddedActivities",
        label: "Use Activities",
        group: "Apps",
        bit: 39,
    },
    {
        name: "UseExternalApps",
        label: "Use External Apps",
        group: "Apps",
        bit: 50,
    },
    { name: "ManageEvents", label: "Manage Events", group: "Events", bit: 33 },
    { name: "CreateEvents", label: "Create Events", group: "Events", bit: 44 },
    {
        name: "Administrator",
        label: "Administrator",
        group: "Advanced",
        bit: 3,
    },
    {
        name: "RequestToSpeak",
        label: "Request to Speak",
        group: "Other",
        bit: 32,
    },
    {
        name: "ViewCreatorMonetizationAnalytics",
        label: "View Creator Monetization Analytics",
        group: "Other",
        bit: 41,
    },
]

export const bitOf = (permission: Permission) => 1n << BigInt(permission.bit)

export const hasPermission = (value: bigint, permission: Permission) =>
    (value & bitOf(permission)) !== 0n

export const togglePermission = (value: bigint, permission: Permission) =>
    value ^ bitOf(permission)

export function parsePermissions(text: string): bigint | null {
    const trimmed = text.trim()
    if (!/^\d{1,20}$/.test(trimmed)) return null

    const value = BigInt(trimmed)
    return value < 2n ** 64n ? value : null
}

export function inviteUrl(
    clientId: string,
    permissions: bigint,
    scopes: string[],
) {
    const params = new URLSearchParams({ client_id: clientId })
    if (permissions > 0n) params.set("permissions", permissions.toString())
    params.set("scope", scopes.join(" "))

    return `https://discord.com/oauth2/authorize?${params}`
}
