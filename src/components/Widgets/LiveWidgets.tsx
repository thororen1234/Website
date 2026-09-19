import ActivityWidget from "./ActivityWidget"
import ClockWidget from "./ClockWidget"
import StatusWidget from "./StatusWidget"

export default function LiveWidgets({ className = "" }) {
    return (
        <div
            className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-3 ${className}`}
        >
            <StatusWidget />
            <ActivityWidget />
            <ClockWidget />
        </div>
    )
}
