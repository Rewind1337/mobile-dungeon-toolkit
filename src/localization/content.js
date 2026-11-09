/**
 * Database-backed content translation helpers.
 *
 * Values are rendered by React as text; templates are never interpreted as HTML.
 */
export function interpolateContent(template, values = {}) {
    if (typeof template !== "string") return template
    const safeValues = values && typeof values === "object" ? values : {}
    return template.replace(/\{\{\s*([a-zA-Z][\w]*)\s*\}\}/g, (placeholder, key) => (
        Object.prototype.hasOwnProperty.call(safeValues, key)
            ? String(safeValues[key] ?? "")
            : placeholder
    ))
}

function getContentOverride(dictionary, type, id, field) {
    const path = String(field ?? "").split(".").filter(Boolean)
    const overrides = dictionary?.data?.overrides
    if (!overrides || !Object.prototype.hasOwnProperty.call(overrides, type)) return undefined
    const collection = overrides[type]
    if (!collection || typeof collection !== "object" || !Object.prototype.hasOwnProperty.call(collection, id)) return undefined
    let value = collection[id]
    for (const key of path) {
        if (value === null || typeof value !== "object" || !Object.prototype.hasOwnProperty.call(value, key)) return undefined
        value = value[key]
    }
    return value
}

/**
 * Resolve a content field in this order:
 * active locale override -> English override -> original database value.
 */
export function translateContent(type, id, field, fallback, language, dictionaries, values = {}) {
    const english = dictionaries.enUS
    const locale = dictionaries[language] ?? english
    const localValue = getContentOverride(locale, type, id, field)
    const englishValue = getContentOverride(english, type, id, field)
    const value = typeof localValue === "string"
        ? localValue
        : typeof englishValue === "string"
            ? englishValue
            : fallback
    return typeof value === "string" ? interpolateContent(value, values) : value
}
