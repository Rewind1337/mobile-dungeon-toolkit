import { useCallback, useMemo, useState } from "react"
import { DEFAULT_LANGUAGE, LANGUAGE_DICTIONARIES } from "./index.js"
import { LocalizationContext } from "./LocalizationContext.js"

export function LocalizationProvider({ children, initialLanguage = DEFAULT_LANGUAGE }) {
    const [language, setLanguageState] = useState(
        LANGUAGE_DICTIONARIES[initialLanguage] ? initialLanguage : DEFAULT_LANGUAGE
    )

    const setLanguage = useCallback(nextLanguage => {
        if (LANGUAGE_DICTIONARIES[nextLanguage]) setLanguageState(nextLanguage)
    }, [])

    const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    )
}
