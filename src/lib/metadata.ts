import type { Metadata } from "next"

const image = "/assets/fallback.png"

interface Options {
    title: string
    description: string
    path?: string
}

export function createMetadata({
    title,
    description,
    path,
}: Options): Metadata {
    return {
        title,
        description,
        other: { title },
        openGraph: {
            type: "website",
            url: path,
            title,
            description,
            images: image,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: image,
        },
    }
}
