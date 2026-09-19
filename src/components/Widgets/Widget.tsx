import type { ReactNode } from "react"
import Box from "@/components/Base/Box"
import type { Icon } from "@/types"

interface Props {
    icon: Icon
    title: string
    children: ReactNode
}

export default function Widget({ icon: Icon, title, children }: Props) {
    return (
        <Box compact className="flex flex-col gap-3">
            <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                <Icon size={14} />
                {title}
            </span>

            {children}
        </Box>
    )
}
