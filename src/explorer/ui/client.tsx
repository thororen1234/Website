"use client"

import { LoaderCircle } from "lucide-react"
import dynamic from "next/dynamic"

export const BuildListClient = dynamic(() => import("./BuildList"), {
    ssr: false,
    loading: () => (
        <p className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <LoaderCircle size={16} className="animate-spin" /> Loading builds…
        </p>
    ),
})

export const ExplorerClient = dynamic(() => import("./Explorer"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-950">
            <LoaderCircle className="animate-spin text-rose-500" />
        </div>
    ),
})
