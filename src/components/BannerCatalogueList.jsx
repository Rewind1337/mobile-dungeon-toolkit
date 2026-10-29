import { useMemo } from "react"
import { matchesSearchQuery } from "../js/search.jsx"
import { BANNERS, getBannerLiveDateInfo, hasValidBannerDate, getSearchableValues, matchesBannerHeroQuery, parseBannerDate } from "./bannerCatalogueUtils.jsx"
import BannerCatalogueCard from "./BannerCatalogueCard.jsx"
import "../css/other.scss"

export default function BannerCatalogueList({ heroesRef, search, setSearch, commitSearch }) {
    const heroesById = useMemo(() => {
        const heroes = Array.isArray(heroesRef) ? heroesRef : []
        return new Map(heroes.map(hero => [hero.id, hero]))
    }, [heroesRef])
    const query = search.trim().toLowerCase()

    const filteredBanners = useMemo(() => {
        const allDated = BANNERS.every(banner =>
            banner.id === "everyday_heroes" || hasValidBannerDate(banner)
        )

        return BANNERS.map((banner, sourceIndex) => {
            const resolveList = ids => (Array.isArray(ids) ? ids : [])
                .map(id => heroesById.get(id) ?? null)
            const primaryRaw = resolveList(banner.heroIds)
            const conditionalRaw = resolveList(banner.conditionalHeroIDs)
            const missingHeroCount = primaryRaw.filter(hero => !hero).length
                + conditionalRaw.filter(hero => !hero).length
            const bannerMetadata = {
                ...banner,
                heroIds: [],
                conditionalHeroIDs: [],
                featuredHeroId: null,
            }

            // Search both banner metadata and the text represented by its visible detail chips.
            // Hero data is searched separately so a matching hero doesn't expose unrelated heroes.
            const liveDateInfo = getBannerLiveDateInfo(BANNERS, sourceIndex)
            const searchableBannerMetadata = [
                ...getSearchableValues(bannerMetadata),
                banner.standardBanner ? "standard standard banner" : "event banner",
                `${Array.isArray(banner.heroIds) ? banner.heroIds.length : 0} listed heroes`,
                banner.featuredHeroId ? "featured featured hero" : "",
                liveDateInfo.date ? `last live ${liveDateInfo.date}` : "last live n/a",
                ...(Array.isArray(banner.conditionalHeroIDs) && banner.conditionalHeroIDs.length > 0
                    ? ["conditional conditional heroes", `${banner.conditionalHeroIDs.length} conditional heroes`]
                    : []),
            ].join(" ").toLowerCase()
            const bannerMatches = matchesSearchQuery(searchableBannerMetadata, query)
            const visibleHeroes = primaryRaw.filter(
                hero => hero && (bannerMatches || matchesBannerHeroQuery(hero, query))
            )
            const featuredHero = banner.featuredHeroId
                ? (heroesById.get(banner.featuredHeroId) ?? null)
                : null
            const featuredHeroMatches = featuredHero
                && (bannerMatches || matchesBannerHeroQuery(featuredHero, query))
            if (featuredHeroMatches && !visibleHeroes.some(hero => hero.id === featuredHero.id)) {
                visibleHeroes.push(featuredHero)
            }
            const visibleConditionalHeroes = conditionalRaw.filter(
                hero => hero && (bannerMatches || matchesBannerHeroQuery(hero, query))
            )

            return {
                banner,
                sourceIndex,
                bannerMatches,
                // Keep the complete known pool for odds; search should only hide cards,
                // not change the probability assigned to the heroes that remain visible.
                allHeroes: primaryRaw.filter(Boolean),
                heroes: visibleHeroes,
                conditionalHeroes: visibleConditionalHeroes,
                missingHeroCount,
            }
        })
            .filter(result =>
                result.bannerMatches || result.heroes.length > 0 || result.conditionalHeroes.length > 0
            )
            .sort((a, b) => {
                // The permanent Everyday Heroes banner always leads the catalogue.
                if (a.banner.id === "everyday_heroes") return b.banner.id === "everyday_heroes" ? 0 : -1
                if (b.banner.id === "everyday_heroes") return 1

                // Once all event banners have dates, sort chronologically (oldest first).
                // Until then preserve the curated source order, including the first special banner.
                if (allDated) {
                    return parseBannerDate(a.banner.lastLiveDate) - parseBannerDate(b.banner.lastLiveDate)
                        || a.sourceIndex - b.sourceIndex
                }
                return a.sourceIndex - b.sourceIndex
            })
    }, [heroesById, query])

    return (
        <div className="banner-catalogue-list">
            <label className="catalogue-search banner-catalogue-search card">
                <span className="catalogue-control-label text">
                    Search banners, heroes, and banner details
                    <span className="catalogue-result-count text">
                        Showing {filteredBanners.length} of {BANNERS.length} banners
                    </span>
                </span>
                <input
                    className="selectable catalogue-input"
                    type="search"
                    aria-label="Search all banner and hero details"
                    placeholder="Search banners, heroes, and details..."
                    value={search}
                    onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)}
                />
            </label>
            {filteredBanners.length === 0
                ? <p className="catalogue-empty card">No banners match that search.</p>
                : <div className="banner-catalogue-grid">
                    {filteredBanners.map(result => (
                        <BannerCatalogueCard key={result.banner.id} result={result} heroesById={heroesById} />
                    ))}
                </div>
            }
        </div>
    )
}
