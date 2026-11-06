import { useEffect, useState } from "react"
import "../css/reset-timers.scss"
import Clock from "../sprites/special/clock.webp"
import { useTranslation } from "../hooks/useTranslation.jsx"

function getNextDailyReset(now = new Date()) {
    const reset = new Date(now)
    reset.setHours(1, 0, 0, 0)
    if (reset <= now) reset.setDate(reset.getDate() + 1)
    return reset
}

function formatRemaining(milliseconds, unitLabels, zeroSeconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    const units = [
        ["day", Math.floor(totalSeconds / 86400)],
        ["hour", Math.floor((totalSeconds % 86400) / 3600)],
        ["minute", Math.floor((totalSeconds % 3600) / 60)],
        ["second", totalSeconds % 60],
    ]
    const readableUnits = units.filter(([, value]) => value > 0)
    if (readableUnits.length === 0) return zeroSeconds

    return readableUnits
        .map(([unit, value]) => `${value} ${unitLabels[unit][value === 1 ? "one" : "other"]}`)
        .join(", ")
}

function ResetTimers() {
    const [now, setNow] = useState(() => Date.now())
    const dailyLabel = useTranslation("app.pages.resetTimers.daily")
    const weeklyLabel = useTranslation("app.pages.resetTimers.weekly")
    const zeroSeconds = useTranslation("app.pages.resetTimers.zeroSeconds")
    const unitLabels = {
        day: {
            one: useTranslation("app.pages.resetTimers.units.day.one"),
            other: useTranslation("app.pages.resetTimers.units.day.other"),
        },
        hour: {
            one: useTranslation("app.pages.resetTimers.units.hour.one"),
            other: useTranslation("app.pages.resetTimers.units.hour.other"),
        },
        minute: {
            one: useTranslation("app.pages.resetTimers.units.minute.one"),
            other: useTranslation("app.pages.resetTimers.units.minute.other"),
        },
        second: {
            one: useTranslation("app.pages.resetTimers.units.second.one"),
            other: useTranslation("app.pages.resetTimers.units.second.other"),
        },
    }

    useEffect(() => {
        const interval = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(interval)
    }, [])

    const dailyReset = getNextDailyReset(new Date(now))
    const weeklyReset = new Date(dailyReset)
    weeklyReset.setDate(weeklyReset.getDate() + 5)

    return (
        <div className="splash-status-panel" style={{height: "50px"}}>
            <section className="reset-timers-row" >
                <div className="reset-timer card">
                    <span className="reset-timer-label header">{dailyLabel}</span>
                    <span className="reset-timer-countdown text-big">{formatRemaining(dailyReset.getTime() - now, unitLabels, zeroSeconds)}</span>
                </div>
                <div className="reset-timer-clock card" >
                    <img src={Clock} alt="" draggable={false} />
                </div>
                <div className="reset-timer card">
                    <span className="reset-timer-label header">{weeklyLabel}</span>
                    <span className="reset-timer-countdown text-big">{formatRemaining(weeklyReset.getTime() - now, unitLabels, zeroSeconds)}</span>
                </div>
            </section>
        </div>
    )
}

export default ResetTimers
