import type { NextConfig } from "next"

const movedToDiscord = {
    color: "color",
    "bot-invite": "bot-invite",
    snowflake: "snowflake",
    timestamp: "timestamp",
    "discord-markdown": "markdown",
}

const nextConfig: NextConfig = {
    output: "standalone",
    async redirects() {
        return Object.entries(movedToDiscord).map(([from, to]) => ({
            source: `/misc/${from}`,
            destination: `/discord/${to}`,
            permanent: true,
        }))
    },
}

export default nextConfig
