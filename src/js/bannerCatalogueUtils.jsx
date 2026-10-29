import { ATTRIBUTE_DEFINITIONS, ELEMENT_DEFINITIONS, RARITY_DEFINITIONS, ROLE_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { init_banner_db } from "../database/db_banners.jsx"
import { getSearchableValues, matchesSearchQuery } from "./search.jsx"

export const BANNERS = init_banner_db()
export const BANNER_RARITY_PULL_CHANCES = {
    [RARITY_DEFINITIONS.LEGENDARY.id]: 0.01,
    [RARITY_DEFINITIONS.EPIC.id]: 0.09,
}
export const STARRED_HERO_PULL_WEIGHT = 1 / 3
export const FEATURED_HERO_PULL_CHANCE = 0.005

export function parseBannerDate(dateString) {
    if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null

    const [year, month, day] = dateString.split("-").map(Number)
    const timestamp = Date.UTC(year, month - 1, day)
    const parsed = new Date(timestamp)
    if (
        parsed.getUTCFullYear() !== year
        || parsed.getUTCMonth() !== month - 1
        || parsed.getUTCDate() !== day
    ) return null

    return timestamp
}

// Prefer a recorded date. If it is missing, estimate it from the previous and next
// banners only when both adjacent dates exist; until then the UI displays N/A.
export function getBannerLiveDateInfo(banners, index) {
    const currentBanner = banners[index]
    const currentTimestamp = parseBannerDate(currentBanner?.lastLiveDate)
    if (currentTimestamp !== null) {
        return { date: currentBanner.lastLiveDate, estimated: false }
    }

    const previousTimestamp = parseBannerDate(banners[index - 1]?.lastLiveDate)
    const nextTimestamp = parseBannerDate(banners[index + 1]?.lastLiveDate)
    if (previousTimestamp !== null && nextTimestamp !== null && nextTimestamp >= previousTimestamp) {
        const estimatedTimestamp = Math.round((previousTimestamp + nextTimestamp) / 2)
        return { date: new Date(estimatedTimestamp).toISOString().slice(0, 10), estimated: true }
    }

    return { date: null, estimated: false }
}

export function hasValidBannerDate(banner) {
    return parseBannerDate(banner?.lastLiveDate) !== null
}

export function matchesBannerHeroQuery(hero, query) {
    const rarity = getEnumNameById(RARITY_DEFINITIONS, Number(hero.rarity)) ?? ""
    const attribute = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? ""
    const element = getEnumNameById(ELEMENT_DEFINITIONS, Number(hero.element)) ?? ""
    const role = getEnumNameById(ROLE_DEFINITIONS, Number(hero.role)) ?? ""
    return matchesSearchQuery([
        ...getSearchableValues(hero),
        rarity,
        attribute,
        element,
        role,
    ], query, term => {
        if (term === "starred") return hero.isStarred === true
        if (term === "not starred") return hero.isStarred !== true
        return undefined
    })
}
