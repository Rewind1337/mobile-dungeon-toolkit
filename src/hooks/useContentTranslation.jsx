import { useCallback } from "react"
import { useLocalization } from "./useLocalization.jsx"
import { LANGUAGE_DICTIONARIES } from "../localization/index.js"
import { translateContent } from "../localization/content.js"

/** Translate database-backed content by collection, stable ID, and field path. */
export function useContentTranslation() {
    const { language } = useLocalization()
    return useCallback((type, id, field, fallback, values = {}) => (
        translateContent(type, id, field, fallback, language, LANGUAGE_DICTIONARIES, values)
    ), [language])
}
