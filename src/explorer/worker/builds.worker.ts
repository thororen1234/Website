/// <reference lib="webworker" />
import { SERVER_BASE_URL } from "../config"
import initWasm, {
    get_builds,
    set_server_base_url,
} from "../libsadancore/libsadancore.js"
import type { BuildMeta, ReleaseChannel } from "../types"
import { exposeToClients } from "./expose"

const CHANNELS: ReleaseChannel[] = ["stable", "canary"]

async function getBuilds(): Promise<BuildMeta[]> {
    await initWasm()
    set_server_base_url(SERVER_BASE_URL)

    return (await get_builds()).map((meta) => ({
        build_hash: meta.build_hash,
        build_number: meta.build_number,
        entry_point: meta.entry_point,
        first_seen: meta.first_seen,
        channels: CHANNELS.filter((c) => meta.channels.includes(c)),
    }))
}

export type GetBuildsFn = typeof getBuilds

exposeToClients(getBuilds)
