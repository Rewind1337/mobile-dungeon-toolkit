// Format a date-only banner record as the suffix requested by the catalogue UI.
// Input format: YYYY-MM-DD. A missing/invalid date produces an empty suffix.
export function getBannerLastLiveLabel(dateString, now = new Date()) {
    if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ""

    const [year, month, day] = dateString.split("-").map(Number)
    const parsedDate = new Date(Date.UTC(year, month - 1, day))
    if (
        parsedDate.getUTCFullYear() !== year ||
        parsedDate.getUTCMonth() !== month - 1 ||
        parsedDate.getUTCDate() !== day
    ) return ""

    const liveDate = parsedDate.getTime()
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    if (liveDate > today) return ""

    const daysAgo = Math.floor((today - liveDate) / 86_400_000)
    return ` - ${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`
}
