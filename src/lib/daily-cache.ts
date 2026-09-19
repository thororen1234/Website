const ONE_DAY = 1000 * 60 * 60 * 24
const RETRY_AFTER = 1000 * 60 * 5

interface Options {
    ttl?: number
    retryAfter?: number
    now?: () => number
}

export function createCache<T>(
    load: (key: string) => Promise<T>,
    { ttl = ONE_DAY, retryAfter = RETRY_AFTER, now = Date.now }: Options = {},
) {
    const entries = new Map<string, { data: T; fetchedAt: number }>()
    const retryAt = new Map<string, number>()
    const inflight = new Map<string, Promise<T | null>>()

    async function refresh(key: string) {
        try {
            const data = await load(key)
            entries.set(key, { data, fetchedAt: now() })
            retryAt.delete(key)
            return data
        } catch (e) {
            console.error(`Refreshing ${key} failed:`, e)
            retryAt.set(key, now() + retryAfter)
            return entries.get(key)?.data ?? null
        }
    }

    return function get(key: string): Promise<T | null> {
        const entry = entries.get(key)
        const time = now()

        if (entry && time - entry.fetchedAt < ttl) {
            return Promise.resolve(entry.data)
        }
        if (time < (retryAt.get(key) ?? 0)) {
            return Promise.resolve(entry?.data ?? null)
        }

        let pending = inflight.get(key)
        if (!pending) {
            pending = refresh(key).finally(() => inflight.delete(key))
            inflight.set(key, pending)
        }
        return pending
    }
}
