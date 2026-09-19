"use client"

import { useEffect, useState } from "react"

export function useClock(timezone: string | null) {
    const [time, setTime] = useState("--:--")

    useEffect(() => {
        if (!timezone) return

        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        const update = () => setTime(formatter.format(new Date()))

        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [timezone])

    return time
}
