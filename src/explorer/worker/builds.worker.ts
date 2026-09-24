import { SERVER_BASE_URL } from "../config"
import init, {
    get_builds,
    set_server_base_url,
} from "../libsadancore/libsadancore.js"
import type { Build, ReleaseChannel } from "../types"
import { exposeWorker } from "./expose"

const isReleaseChannel = (channel: string): channel is ReleaseChannel =>
    channel === "stable" || channel === "canary"

async function getBuilds(): Promise<Build[]> {
    await init()
    set_server_base_url(SERVER_BASE_URL)

    const metadata = await get_builds()
    return metadata.map((build) => ({
        hash: build.build_hash,
        number: build.build_number,
        firstSeen: Number(build.first_seen),
        channels: build.channels.filter(isReleaseChannel),
    }))
}

export type GetBuilds = typeof getBuilds

exposeWorker(getBuilds)
