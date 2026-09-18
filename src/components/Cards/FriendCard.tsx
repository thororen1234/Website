interface Props {
    url: string
    img: string
    alt: string
    name: string
}

export default function FriendCard({ url, img, alt, name }: Props) {
    return (
        <div className="min-w-0 overflow-hidden">
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-1 text-center"
            >
                <img
                    src={img}
                    alt={alt}
                    className="size-12 rounded-md object-cover"
                />
                <span className="truncate text-xs text-neutral-700 group-hover:text-rose-500 dark:text-neutral-200">
                    {name}
                </span>
            </a>
        </div>
    )
}
