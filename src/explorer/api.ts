import * as comlink from "comlink"
import type { GetBuilds } from "./worker/builds.worker"
import type { BundleWorkerApi } from "./worker/bundle.worker"

export type BundleApi = comlink.Remote<BundleWorkerApi>

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
