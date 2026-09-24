import * as comlink from "comlink"

export function exposeToClients(obj: unknown) {
    const scope = globalThis as unknown as {
        onconnect?: ((e: MessageEvent) => void) | null
    }

    if ("onconnect" in scope) {
        scope.onconnect = ({ ports: [port] }) => comlink.expose(obj, port)
    } else {
        comlink.expose(obj)
    }
}
