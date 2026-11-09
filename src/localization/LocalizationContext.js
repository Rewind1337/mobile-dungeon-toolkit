import { createContext } from "react"
import { DEFAULT_LANGUAGE } from "./index.js"

export const LocalizationContext = createContext({
    language: DEFAULT_LANGUAGE,
    setLanguage: () => {},
})
