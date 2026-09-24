import { useEffect, useState } from "react"

export type AsyncState<T> =
    | { status: "idle"; data?: undefined; error?: undefined }
    | { status: "pending"; data?: undefined; error?: undefined }
    | { status: "success"; data: T; error?: undefined }
    | { status: "error"; data?: undefined; error: unknown }

export function useAsync<T>(load: (() => Promise<T>) | null): AsyncState<T> {
    const [state, setState] = useState<AsyncState<T>>({ status: "idle" })

    useEffect(() => {
        if (!load) {
            setState({ status: "idle" })
            return
        }

        let cancelled = false
        setState({ status: "pending" })

        load().then(
            (data) => !cancelled && setState({ status: "success", data }),
            (error) => !cancelled && setState({ status: "error", error }),
        )

        return () => {
            cancelled = true
        }
    }, [load])

    return state
}

export const errorMessage = (error: unknown) =>
    error instanceof Error ? error.message : String(error)
