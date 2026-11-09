import { useCallback } from "react"
import { useLocalization } from "./useLocalization.jsx"
import { translate } from "../localization/index.js"

/**
 * Return a translator bound to the active locale.
 * Values may be supplied for {{placeholder}} interpolation.
 */
export function useTranslate() {
    const { language } = useLocalization()
    return useCallback((context, values) => translate(context, language, values), [language])
}
