import { Users } from "lucide-react"
import { friends } from "@/consts"
import FriendCard from "@/components/Cards/FriendCard"
import Box from "@/components/Base/Box"

export default function FriendsSection() {
    return (
        <>
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <Users size={18} /> Friends
            </span>

            <Box className="grid grid-cols-2 gap-4">
                {friends.map((friend, i) => (
                    <div
                        key={friend.id}
                        className={
                            friends.length % 2 !== 0 && i === friends.length - 1
                                ? "col-span-2 flex justify-center"
                                : ""
                        }
                    >
                        <FriendCard {...friend} />
                    </div>
                ))}
            </Box>
        </>
    )
}
