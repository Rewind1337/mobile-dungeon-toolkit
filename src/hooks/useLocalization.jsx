import { useContext } from "react"
import { LocalizationContext } from "../localization/LocalizationContext.js"

export function useLocalization() {
    return useContext(LocalizationContext)
}
