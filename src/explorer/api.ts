import * as comlink from "comlink"
import { SERVER_BASE_URL } from "./config"
import type { AndroidBuild } from "./types"
import type { GetBuilds } from "./worker/builds.worker"
import type { BundleWorkerApi } from "./worker/bundle.worker"
import type { SourcesWorkerApi } from "./worker/sources.worker"

export type BundleApi = comlink.Remote<BundleWorkerApi>
export type SourcesApi = comlink.Remote<SourcesWorkerApi>

let builds: comlink.Remote<GetBuilds> | undefined

export function getBuilds() {
    builds ??= comlink.wrap<GetBuilds>(
        new Worker(new URL("./worker/builds.worker.ts", import.meta.url), {
            type: "module",
            name: "discord-builds",
        }),
    )
    return builds()
}

export async function getAndroidBuilds(): Promise<AndroidBuild[]> {
    const res = await fetch(`${SERVER_BASE_URL}/android/builds`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

const bundleApis = new Map<string, Promise<BundleApi>>()

export function getBundleApi(buildHash: string) {
    let bundleApi = bundleApis.get(buildHash)

    if (!bundleApi) {
        const api = comlink.wrap<BundleWorkerApi>(
            new Worker(new URL("./worker/bundle.worker.ts", import.meta.url), {
                type: "module",
                name: `discord-bundle-${buildHash}`,
            }),
        )

        bundleApi = api.loadBuild(buildHash).then(() => api)
        bundleApi.catch(() => bundleApis.delete(buildHash))
        bundleApis.set(buildHash, bundleApi)
    }

    return bundleApi
}

const sourcesApis = new Map<number, Promise<SourcesApi>>()

export function getSourcesApi(versionCode: number) {
    let sourcesApi = sourcesApis.get(versionCode)

    if (!sourcesApi) {
        const api = comlink.wrap<SourcesWorkerApi>(
            new Worker(new URL("./worker/sources.worker.ts", import.meta.url), {
                type: "module",
                name: `discord-sources-${versionCode}`,
            }),
        )

        sourcesApi = api.loadSources(versionCode).then(() => api)
        sourcesApi.catch(() => sourcesApis.delete(versionCode))
        sourcesApis.set(versionCode, sourcesApi)
    }

    return sourcesApi
}
