"use client"

import { ListMusic } from "lucide-react"
import { useProfile } from "@/lib/profile"
import Widget from "./Widget"

export default function ActivityWidget() {
    const { lanyard } = useProfile()
    const activity = lanyard?.activities?.find((a) => a.type !== 4)

    return (
        <Widget icon={ListMusic} title="Activity">
            {activity ? (
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-lg font-medium text-neutral-800 dark:text-neutral-200">
                        {activity.details || activity.name || ""}
                    </span>
                    {activity.state && (
                        <span className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                            by {activity.state}
                        </span>
                    )}
                </div>
            ) : (
                <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                    Nothing right now
                </span>
            )}
        </Widget>
    )
}
