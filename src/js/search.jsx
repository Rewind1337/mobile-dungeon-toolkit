import { useCallback, useEffect, useState } from "react"

const SEARCH_PARAM = "search"

/**
 * Match all ampersand-separated search terms against one searchable text corpus.
 * A leading "!" negates that term. Matching is case-insensitive substring matching.
 */
export function matchesSearchQuery(searchableValues, rawQuery, matchSpecialTerm) {
    const queryTerms = String(rawQuery ?? "")
        .toLowerCase()
        .split("&")
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
 * Keep a search input in local state while typing, then synchronize it to the
 * URL with replaceState when the input blurs. replaceState avoids polluting
 * the browser's Back/Forward history for each search.
 */
export function useUrlSearch() {
    const [search, setSearch] = useState(() => {
        if (typeof window === "undefined") return ""
        return new URLSearchParams(window.location.search).get(SEARCH_PARAM) ?? ""
    })

    useEffect(() => {
        if (typeof window === "undefined") return undefined

        const syncSearchFromUrl = () => {
            setSearch(new URLSearchParams(window.location.search).get(SEARCH_PARAM) ?? "")
        }
        window.addEventListener("popstate", syncSearchFromUrl)
        return () => window.removeEventListener("popstate", syncSearchFromUrl)
    }, [])

    const commitSearch = useCallback(value => {
        if (typeof window === "undefined") return

        const query = String(value ?? "")
        const url = new URL(window.location.href)
        if (query.trim()) {
            url.searchParams.set(SEARCH_PARAM, query)
        } else {
            url.searchParams.delete(SEARCH_PARAM)
        }

        const nextUrl = `${url.pathname}${url.search}${url.hash}`
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
        if (nextUrl !== currentUrl) {
            window.history.replaceState(window.history.state, "", nextUrl)
        }
    }, [])

    return [search, setSearch, commitSearch]
}
