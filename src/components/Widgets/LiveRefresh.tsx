"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LiveRefresh({ seconds }: { seconds: number }) {
    const router = useRouter()

    useEffect(() => {
        const interval = seconds * 1000
        let last = Date.now()

        const refresh = () => {
            if (document.hidden) return
            last = Date.now()
            router.refresh()
        }

        const onVisible = () => {
            if (Date.now() - last >= interval) refresh()
        }

        const timer = setInterval(refresh, interval)
        document.addEventListener("visibilitychange", onVisible)

        return () => {
            clearInterval(timer)
            document.removeEventListener("visibilitychange", onVisible)
        }
    }, [router, seconds])

    return null
}
