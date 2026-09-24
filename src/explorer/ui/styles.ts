export const iconButtonClass =
    "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-neutral-600 transition-colors hover:bg-zinc-200 hover:text-rose-500 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:bg-zinc-800"

export const hiddenScrollbarClass =
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

export const mutedTextClass = "text-sm text-neutral-500 dark:text-neutral-400"

export const linkTextClass =
    "cursor-pointer text-rose-600 hover:underline dark:text-rose-400"

export function tabClass(active: boolean, padding = "px-3") {
    return `flex cursor-pointer items-center gap-1.5 rounded-lg ${padding} py-1.5 text-sm font-medium transition-colors ${
        active
            ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    }`
}

export const tabGroupClass = "rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800"
