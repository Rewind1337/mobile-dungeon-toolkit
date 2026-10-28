// Format a date-only banner record as the suffix requested by the catalogue UI.
// Input format: YYYY-MM-DD. A missing/invalid date produces an empty suffix.
export function getBannerLastLiveLabel(dateString, now = new Date()) {
    if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ""

    const [year, month, day] = dateString.split("-").map(Number)
    const liveDate = Date.UTC(year, month - 1, day)
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    if (!Number.isFinite(liveDate) || liveDate > today) return ""

    const daysAgo = Math.floor((today - liveDate) / 86_400_000)
    return ` - ${daysAgo} days ago`
}
