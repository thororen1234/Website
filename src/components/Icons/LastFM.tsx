import type { LucideProps } from "lucide-react"

export default function LastFM({
    size = 24,
    color = "currentColor",
    strokeWidth = 2,
    ...rest
}: LucideProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            {...rest}
        >
            <path
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                d="M22.5 9c-0.167 -0.667 -1.1 -2 -3.5 -2 -2.23 0 -3.5 1.5 -3.5 2.5 0 3.369 7 2.053 7 5 0 2.162 -3.5 2.5 -4.5 2.5 -7.891 0 -4.438 -10 -11 -10 -4 0 -5.5 2.5 -5.5 5s2.5 5 5 5c2 0 3.167 -0.667 3.5 -1"
            />
        </svg>
    )
}
