import type { Skill } from "@/types"

export default function SkillCard({ text, description, progress }: Skill) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {text}
            </span>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {description}
            </p>

            <div className="h-6 w-full rounded-lg bg-zinc-400 dark:bg-zinc-950">
                <div
                    style={{ width: `${progress}%` }}
                    className="h-full rounded-lg bg-linear-to-r from-rose-800 to-rose-500"
                />
            </div>
        </div>
    )
}
