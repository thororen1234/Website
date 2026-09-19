export interface SteamStatus {
    name: string
    avatar: string | null
    profileUrl: string
    state: "online" | "offline" | "in-game"
    game: { name: string; icon: string | null; url: string | null } | null
}

function tag(xml: string, name: string) {
    const match = xml.match(
        new RegExp(
            `<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`,
        ),
    )
    return match?.[1]?.trim() || null
}

export function parseSteamProfile(xml: string): SteamStatus | null {
    const id64 = tag(xml, "steamID64")
    const name = tag(xml, "steamID")
    if (!id64 || !name) return null

    const onlineState = tag(xml, "onlineState")
    const gameBlock = tag(xml, "inGameInfo")
    const gameName = gameBlock && tag(gameBlock, "gameName")

    return {
        name,
        avatar: tag(xml, "avatarFull"),
        profileUrl: `https://steamcommunity.com/profiles/${id64}`,
        state:
            gameName || onlineState === "in-game"
                ? "in-game"
                : onlineState === "online"
                  ? "online"
                  : "offline",
        game: gameName
            ? {
                  name: gameName,
                  icon: gameBlock && tag(gameBlock, "gameIcon"),
                  url: gameBlock && tag(gameBlock, "gameLink"),
              }
            : null,
    }
}
