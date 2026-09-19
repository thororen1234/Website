"use client"

import { AlarmClock } from "lucide-react"
import { useProfile } from "@/lib/profile"
import { useClock } from "@/lib/useClock"
import Widget from "./Widget"

export default function ClockWidget() {
    const { timezone } = useProfile()
    const time = useClock(timezone)

    return (
        <Widget icon={AlarmClock} title="Local time">
            <div className="flex flex-col">
                <span className="text-lg font-medium text-neutral-800 tabular-nums dark:text-neutral-200">
                    {time}
                </span>
                {timezone && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {timezone.replace(/_/g, " ")}
                    </span>
                )}
            </div>
        </Widget>
    )
}
