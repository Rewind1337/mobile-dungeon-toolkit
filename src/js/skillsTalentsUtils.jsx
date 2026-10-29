export const stringify = value => {
    if (value == null) return ""
    if (typeof value === "string") return value
    try { return JSON.stringify(value, null, 2) } catch { return String(value) }
}

export function getTalentPosition(talentId) {
    const id = String(talentId)
    const row = Number(id[0])
    const side = id.endsWith("0") ? "Center" : id.endsWith("1") ? "Left" : "Right"
    return `Row #${row} - ${side}`
}

export const humanizeKey = key => String(key).replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase())
