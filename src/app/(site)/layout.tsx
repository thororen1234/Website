import type { ReactNode } from 'react'
import Footer from '@/components/Layout/Footer'
import Sidebar from '@/components/Layout/Sidebar'
import { siteUrl } from '@/consts'

// The footer shows the current year, so refresh the prerendered page hourly
export const revalidate = 3600

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* Discord requires an absolute https URL here */}
            <link
                rel="discord:component-embed"
                type="application/json"
                href={`${siteUrl}/embed.json`}
            />

            <main className="flex flex-col items-start gap-3 px-3 pt-16 md:flex-row md:gap-6">
                <Sidebar />
                <div className="flex flex-col gap-3">{children}</div>
            </main>
            <Footer />
        </>
    )
}
