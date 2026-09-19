import { getProject } from "@/lib/projects"
import { getRepos, ownerOf } from "@/lib/repos"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const owner = ownerOf(getProject((await params).slug)?.github)
    if (!owner) {
        return Response.json({ error: "No repositories" }, { status: 404 })
    }

    const repos = await getRepos(owner)
    if (!repos) {
        return Response.json(
            { error: "Failed to fetch repositories" },
            { status: 502 },
        )
    }

    return Response.json(repos)
}
