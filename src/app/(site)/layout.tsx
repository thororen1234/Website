import type { ReactNode } from "react"
import Footer from "@/components/Layout/Footer"
import Header from "@/components/Layout/Header"
import { ProfileProvider } from "@/lib/profile"

export const revalidate = 3600

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="flex min-h-dvh flex-col">
                <ProfileProvider>
                    <Header />
                    <main className="flex flex-1 flex-col gap-8 px-3 pt-6">
                        {children}
                    </main>
                </ProfileProvider>
                <Footer />
            </div>
        </>
    )
}
