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

export function TalentEffect({ effect }) {
    const entries = (Array.isArray(effect) ? effect : [effect]).flatMap(value => {
        if (value && typeof value === "object" && !Array.isArray(value)) return Object.entries(value)
        return [["Effect", value]]
    })
    return <dl className="talent-effect-list flex-row justify-center">
        {entries.map(([key, value], index) => <div className="talent-effect-entry w-fit" key={key + "-" + index}>
            <dt className="text">{humanizeKey(key)}</dt>
            <dd className="text">{typeof value === "object" && value !== null ? stringify(value) : String(value)}</dd>
        </div>)}
    </dl>
}
