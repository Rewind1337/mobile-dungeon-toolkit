import { useLocalization } from "./useLocalization.jsx"
import { translate } from "../localization/index.js"

/**
 * Translate a dot-separated key such as
 * "app.pages.heroes.filters.search".
 *
 * An explicit locale can be supplied as the second argument. Otherwise the
 * active locale from LocalizationProvider is used.
 */
export function useTranslation(context, language, values) {
    const localization = useLocalization()
    return translate(context, language ?? localization.language, values)
}
