import { useEffect, useState } from "react"
import "../css/reset-timers.scss"

function getNextDailyReset(now = new Date()) {
    const reset = new Date(now)
    reset.setHours(1, 0, 0, 0)
    if (reset <= now) reset.setDate(reset.getDate() + 1)
    return reset
}

function formatRemaining(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    const units = [
        ["day", Math.floor(totalSeconds / 86400)],
        ["hour", Math.floor((totalSeconds % 86400) / 3600)],
        ["minute", Math.floor((totalSeconds % 3600) / 60)],
        ["second", totalSeconds % 60],
    ]
    return units
        .map(([unit, value]) => `${value} ${unit}${value === 1 ? "" : "s"}`)
        .join(", ")
}

function ResetTimers() {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const interval = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(interval)
    }, [])

    const dailyReset = getNextDailyReset(new Date(now))
    const weeklyReset = new Date(dailyReset)
    weeklyReset.setDate(weeklyReset.getDate() + 5)

    return (
        <section className="reset-timers-row" aria-label="Reset timers">
            <div className="reset-timer card">
                <span className="reset-timer-label header">Daily Reset</span>
                <span className="reset-timer-countdown text-big">{formatRemaining(dailyReset.getTime() - now)}</span>
            </div>
            <div className="reset-timer card">
                <span className="reset-timer-label header">Weekly Reset</span>
                <span className="reset-timer-countdown text-big">{formatRemaining(weeklyReset.getTime() - now)}</span>
            </div>
        </section>
    )
}

export default ResetTimers
