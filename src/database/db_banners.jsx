import { getBannerLastLiveLabel } from "./bannerUtils.jsx"

let BASE_BANNERS = []

function add_banner(name, date, heroIDs) {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    if (BASE_BANNERS.some(banner => banner.id === id)) {
        throw new Error(`Duplicate stable banner ID "${id}". Give the banner a distinct name.`)
    }

    const heroIds = [...heroIDs]
    BASE_BANNERS.push({
        id: id,
        name: name,
        lastLiveDate: date,
        heroIds: heroIds,
        featuredHeroId: heroIds[0] ?? null,
        lastLiveLabel: getBannerLastLiveLabel(date),
    })
}

export function init_banner_db() {
    BASE_BANNERS = []

    // Replace these placeholders with manually verified banner data.
    // Keep each heroIDs array in the order you want it displayed.
    add_banner("Banner 1", null, [])
    add_banner("Banner 2", null, [])

    return BASE_BANNERS
}
