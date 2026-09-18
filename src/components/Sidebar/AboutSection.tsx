'use client'

import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import { information, MiscIcons } from '@/consts'
import Box from '@/components/Base/Box'
import { useProfile } from '@/lib/profile'

function useClock(timezone: string | null) {
    const [time, setTime] = useState('--:--')

    useEffect(() => {
        if (!timezone) return

        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
        const update = () => setTime(formatter.format(new Date()))

        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [timezone])

    return time
}

export default function AboutSection() {
    const { lanyard, timezone } = useProfile()
    const time = useClock(timezone)

    const customStatus = lanyard?.activities?.find((a) => a.type === 4)
    const activity = lanyard?.activities?.find((a) => a.type !== 4)

    return (
        <>
            <span className="flex gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <UserCircle size={18} /> About
            </span>

            <Box>
                {information.map((info) => (
                    <span
                        key={info.text}
                        className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-200"
                    >
                        <info.icon size={18} />
                        {info.text}
                    </span>
                ))}

                <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-200">
                    <MiscIcons.AlarmClock size={18} />
                    <span>{time}</span>
                </span>

                {customStatus?.state && (
                    <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-200">
                        <MiscIcons.BookOpen size={18} className="shrink-0" />
                        <span className="truncate">{customStatus.state}</span>
                    </span>
                )}

                {activity && (
                    <span className="flex items-start gap-1 font-medium text-neutral-700 dark:text-neutral-200">
                        <MiscIcons.ListMusic
                            size={18}
                            className="mt-0.5 shrink-0"
                        />
                        <span className="flex min-w-0 flex-col">
                            <span className="truncate">
                                {activity.details || activity.name || ''}
                            </span>
                            {activity.state && (
                                <span className="truncate text-xs font-normal text-neutral-500 dark:text-neutral-400">
                                    by {activity.state}
                                </span>
                            )}
                        </span>
                    </span>
                )}
            </Box>
        </>
    )
}
