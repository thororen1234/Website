import * as comlink from "comlink"
import type { TBundleHash } from "./types"
import type { GetBuildsFn } from "./worker/builds.worker"
import type { RawBuildService } from "./worker/bundle.worker"

export type RemoteBuildService = comlink.Remote<RawBuildService>

const sharedOptions = (name: string) =>
    ({
        type: "module",
        name,
        extendedLifetime: process.env.NODE_ENV === "production",
    }) as WorkerOptions

let getBuildsFn: comlink.Remote<GetBuildsFn> | null = null

export function getBuilds() {
    if (!getBuildsFn) {
        const name = "explorer-builds"

        getBuildsFn =
            typeof SharedWorker !== "undefined"
                ? comlink.wrap<GetBuildsFn>(
                      new SharedWorker(
                          new URL("./worker/builds.worker.ts", import.meta.url),
                          sharedOptions(name),
                      ).port,
                  )
                : comlink.wrap<GetBuildsFn>(
                      new Worker(
                          new URL("./worker/builds.worker.ts", import.meta.url),
                          { type: "module", name },
                      ),
                  )
    }

    return getBuildsFn()
}

const services = new Map<TBundleHash, Promise<RemoteBuildService>>()

export function getBuildService(hash: TBundleHash) {
    let service = services.get(hash)

    if (!service) {
        const name = `explorer-build-${hash}`
        const remote =
            typeof SharedWorker !== "undefined"
                ? comlink.wrap<RawBuildService>(
                      new SharedWorker(
                          new URL("./worker/bundle.worker.ts", import.meta.url),
                          sharedOptions(name),
                      ).port,
                  )
                : comlink.wrap<RawBuildService>(
                      new Worker(
                          new URL("./worker/bundle.worker.ts", import.meta.url),
                          { type: "module", name },
                      ),
                  )

        service = remote.init(hash).then(() => remote)
        service.catch(() => services.delete(hash))
        services.set(hash, service)
    }

    return service
}
