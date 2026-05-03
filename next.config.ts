import type { NextConfig } from "next"

const flaskUrl = process.env.FLASK_URL || "http://127.0.0.1:5328"
const docsUrl = process.env.DOCS_DOMAIN || "https://docs.songup.tv"

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/flask/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:5328/flask/:path*"
                        : `${flaskUrl}/flask/:path*`,
            },
            {
                source: "/relay-iljT/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/relay-iljT/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
            {
                source: "/docs",
                destination: `${docsUrl}/docs`,
            },
            {
                source: "/docs/:path+",
                destination: `${docsUrl}/docs/:path+`,
            },
            {
                source: "/docs-static/:path+",
                destination: `${docsUrl}/docs-static/:path+`,
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                hostname: "*.googleusercontent.com",
            },
            {
                hostname: "*.imgix.net",
            },
            {
                hostname: "*.redditstatic.com",
            },
            {
                hostname: "styles.redditmedia.com",
            },
        ],
    },
    skipTrailingSlashRedirect: true,
}

export default nextConfig
