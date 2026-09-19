interface Props {
    src: string
    size: number
    rounded?: string
    padding?: string
}

export default function ProjectIcon({
    src,
    size,
    rounded = "rounded-lg",
    padding = "p-1",
}: Props) {
    return (
        <img
            src={src}
            alt=""
            width={size}
            height={size}
            draggable={false}
            className={`shrink-0 bg-zinc-800 object-contain select-none dark:bg-transparent dark:p-0 ${rounded} ${padding}`}
        />
    )
}
