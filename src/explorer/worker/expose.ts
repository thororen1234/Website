import * as comlink from "comlink"

export function exposeWorker(api: object) {
    comlink.expose(api)
}
