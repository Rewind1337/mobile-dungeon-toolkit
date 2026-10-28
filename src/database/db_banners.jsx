import { getBannerLastLiveLabel } from "./bannerUtils.jsx"

// Banner entries are placeholders until the manually verified banner data is added.
// Keep IDs stable: they are identifiers, not display-order numbers.
export const BANNER_DATA = {
    banner_1: {
        id: "banner_1",
        name: "Banner 1",
        lastLiveDate: null, // Date string in YYYY-MM-DD format, or null until verified.
        heroIds: [], // Stable hero IDs from db_heroes.jsx, in banner order.
        featuredHeroIndex: 0, // Index into heroIds; defaults to the first hero.
    },
    banner_2: {
        id: "banner_2",
        name: "Banner 2",
        lastLiveDate: null,
        heroIds: [],
        featuredHeroIndex: 0,
    },
}

export function init_banner_db() {
    return Object.values(BANNER_DATA).map(banner => ({
        ...banner,
        featuredHeroId: banner.heroIds[banner.featuredHeroIndex] ?? banner.heroIds[0] ?? null,
        lastLiveLabel: getBannerLastLiveLabel(banner.lastLiveDate),
    }))
}
