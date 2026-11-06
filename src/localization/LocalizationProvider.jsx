import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { DEFAULT_LANGUAGE, LANGUAGE_DICTIONARIES } from "./index.js"

const LocalizationContext = createContext({
    language: DEFAULT_LANGUAGE,
    setLanguage: () => {},
})

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

export function useLocalization() {
    return useContext(LocalizationContext)
}
