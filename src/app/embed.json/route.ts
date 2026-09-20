import { getEmbed } from "@/lib/embed"

export async function GET(request: Request) {
    const embed = await getEmbed(new URL(request.url).searchParams)
    if (!embed)
        return Response.json({ error: "Embed not found" }, { status: 404 })

    return Response.json(
        { component: embed },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=300",
            },
        },
    )
}
