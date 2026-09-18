import Avatar from '@/components/Base/Avatar'
import AboutSection from '@/components/Sidebar/AboutSection'
import BadgesSection from '@/components/Sidebar/BadgesSection'
import FriendsSection from '@/components/Sidebar/FriendsSection'
import SocialsSection from '@/components/Sidebar/SocialsSection'
import { ProfileProvider } from '@/lib/profile'

export default function Sidebar() {
    return (
        <ProfileProvider>
            <aside className="flex w-full flex-col gap-4 md:max-w-60">
                <div className="mb-2 flex w-full flex-col items-center gap-4">
                    <Avatar size={240} />
                </div>

                <BadgesSection />
                <AboutSection />
                <SocialsSection />
                <FriendsSection />
            </aside>
        </ProfileProvider>
    )
}
