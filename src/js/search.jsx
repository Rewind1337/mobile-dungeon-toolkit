import { useCallback, useEffect, useState } from "react"

const SEARCH_PARAM = "search"

/**
 * Read the raw query value so a literal "+" can act as the AND separator.
 * Spaces in our URLs are encoded as "%20", so they remain distinct from "+".
 */
function getSearchFromLocation() {
    if (typeof window === "undefined") return ""

    const rawParams = window.location.search.startsWith("?")
        ? window.location.search.slice(1).split("&")
        : window.location.search.split("&")
    for (const param of rawParams) {
        const separatorIndex = param.indexOf("=")
        const rawKey = separatorIndex === -1 ? param : param.slice(0, separatorIndex)
        let key
        try {
            key = decodeURIComponent(rawKey)
        } catch {
            continue
        }
        if (key !== SEARCH_PARAM) continue

        const rawValue = separatorIndex === -1 ? "" : param.slice(separatorIndex + 1)
        try {
            return decodeURIComponent(rawValue)
        } catch {
            return rawValue
        }
    }

    return ""
}

/** Return true for object fields that store asset locations rather than searchable content. */
export function isSearchAssetField(key) {
    return /(?:src|sprites?|icons?|images?|urls?|paths?)$/i.test(String(key ?? ""))
}

/**
 * Match all plus-separated search terms against one searchable text corpus.
 * "&" remains accepted as a separator for older search URLs. A leading "!"
 * negates that term. Matching is case-insensitive substring matching.
 */
export function matchesSearchQuery(searchableValues, rawQuery, matchSpecialTerm) {
    const queryTerms = String(rawQuery ?? "")
        .toLowerCase()
        .split(/[+&]/)
        .map(term => term.trim())
        .filter(Boolean)

    if (queryTerms.length === 0) return true

    const searchableText = (Array.isArray(searchableValues) ? searchableValues : [searchableValues])
        .filter(value => value !== null && value !== undefined)
        .map(value => String(value))
        .join(" ")
        .toLowerCase()

    return queryTerms.every(rawTerm => {
        const negated = rawTerm.startsWith("!")
        const term = (negated ? rawTerm.slice(1) : rawTerm).trim()
        if (!term) return true

        const specialMatch = matchSpecialTerm?.(term)
        const matched = typeof specialMatch === "boolean"
            ? specialMatch
            : searchableText.includes(term)

        return negated ? !matched : matched
    })
}

/**
 * Clear search from the current history entry before leaving its view.
 * Replacing the current entry prevents Back from restoring an old search.
 * The event clears the live search inputs even when their component stays mounted.
 */
export function clearSearchFromUrl() {
    if (typeof window === "undefined") return

    const url = new URL(window.location.href)
    if (url.searchParams.has(SEARCH_PARAM)) {
        url.searchParams.delete(SEARCH_PARAM)
        const nextUrl = `${url.pathname}${url.search}${url.hash}`
        window.history.replaceState(window.history.state, "", nextUrl)
    }

    window.dispatchEvent(new Event("search-reset"))
}

/**
 * Keep a search input in local state while typing, then synchronize it to the
 * URL with replaceState when the input blurs. replaceState avoids polluting
 * the browser's Back/Forward history for each search.
 */
export function useUrlSearch() {
    const [search, setSearch] = useState(() => {
        if (typeof window === "undefined") return ""
        return getSearchFromLocation()
    })

    useEffect(() => {
        if (typeof window === "undefined") return undefined

        const syncSearchFromUrl = () => {
            setSearch(getSearchFromLocation())
        }
        window.addEventListener("popstate", syncSearchFromUrl)
        window.addEventListener("search-reset", syncSearchFromUrl)
        return () => {
            window.removeEventListener("popstate", syncSearchFromUrl)
            window.removeEventListener("search-reset", syncSearchFromUrl)
        }
    }, [])

    const commitSearch = useCallback(value => {
        if (typeof window === "undefined") return

        const query = String(value ?? "")
        const url = new URL(window.location.href)
        url.searchParams.delete(SEARCH_PARAM)

        // Encode each term independently and join with a literal "+" so the
        // separator stays readable in the URL. Spaces inside terms become "%20".
        let nextSearch = url.search
        if (query.trim()) {
            const encodedQuery = query.split("+").map(term => encodeURIComponent(term)).join("+")
            nextSearch += `${nextSearch ? "&" : "?"}${SEARCH_PARAM}=${encodedQuery}`
        }

        const nextUrl = `${url.pathname}${nextSearch}${url.hash}`
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
        if (nextUrl !== currentUrl) {
            window.history.replaceState(window.history.state, "", nextUrl)
        }
    }, [])

    return [search, setSearch, commitSearch]
}
