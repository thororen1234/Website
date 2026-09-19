interface Option<T extends string> {
    value: T
    label: string
}

interface Props<T extends string> {
    label: string
    options: Option<T>[]
    value: T
    onChange: (value: T) => void
}

export default function SegmentedControl<T extends string>({
    label,
    options,
    value,
    onChange,
}: Props<T>) {
    return (
        <div
            role="group"
            aria-label={label}
            className="inline-flex w-fit rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800"
        >
            {options.map((option) => {
                const active = option.value === value

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        aria-pressed={active}
                        className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            active
                                ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        }`}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
