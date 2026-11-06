import lang_enUS from "./lang_enUS.jsx"
import lang_deDE from "./lang_deDE.jsx"

export const DEFAULT_LANGUAGE = "enUS"

/**
 * Register each language dictionary here. The key is the locale identifier
 * passed to LocalizationProvider / useTranslation.
 */
export const LANGUAGE_DICTIONARIES = {
    enUS: lang_enUS,
    deDE: lang_deDE,
}

function getValueAtPath(dictionary, context) {
    return String(context ?? "").split(".").reduce((value, key) => {
        if (value === null || typeof value !== "object") return undefined
        return value[key]
    }, dictionary)
}

/** Resolve UI copy with English fallback and named {{placeholder}} interpolation. */
export function translate(context, language = DEFAULT_LANGUAGE, values = {}) {
    const dictionary = LANGUAGE_DICTIONARIES[language] ?? LANGUAGE_DICTIONARIES[DEFAULT_LANGUAGE]
    const fallback = LANGUAGE_DICTIONARIES[DEFAULT_LANGUAGE]
    const value = getValueAtPath(dictionary, context) ?? getValueAtPath(fallback, context)
    if (typeof value !== "string") return String(context ?? "")
    return value.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (placeholder, key) => (
        Object.prototype.hasOwnProperty.call(values, key) ? String(values[key] ?? "") : placeholder
    ))
}
