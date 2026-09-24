import { PackageSearch } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import ToolPage from "@/components/Tools/ToolPage"
import {
    SITE_REPO_URL,
    TRACKER_REPO_URL,
    UPSTREAM_REPO_URL,
} from "@/explorer/config"
import { BuildListClient } from "@/explorer/ui/client"

export const metadata = createMetadata({
    title: "Discord Module Explorer",
    description:
        "Browse, search and cross-reference the webpack modules of recent Discord client builds.",
    path: "/discord/modules",
})

const creditLinkClass = "text-rose-600 hover:underline dark:text-rose-400"

export default function ExplorerPage() {
    return (
        <ToolPage
            section="discord"
            icon={PackageSearch}
            title="Discord Module Explorer"
            slug="modules"
        >
            <div className="flex flex-col gap-4">
                <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    Pick a Discord client build to browse its webpack modules
                    with search, go to definition, find references, export maps
                    and a dependency graph. Everything runs in your browser.
                </p>

                <BuildListClient />

                <p className="text-xs leading-5 text-neutral-500">
                    Explorer by{" "}
                    <a
                        href={UPSTREAM_REPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className={creditLinkClass}
                    >
                        sadan4
                    </a>
                    , licensed under the AGPL-3.0. Build data from{" "}
                    <a
                        href={TRACKER_REPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className={creditLinkClass}
                    >
                        tracker.thororen.com
                    </a>
                    .{" "}
                    <a
                        href={`${SITE_REPO_URL}/tree/main/src/explorer`}
                        target="_blank"
                        rel="noreferrer"
                        className={creditLinkClass}
                    >
                        Source for this version
                    </a>
                    .
                </p>
            </div>
        </ToolPage>
    )
}
