import { RARITY_DEFINITIONS } from "../database/enums.jsx"
import { resourceSprites } from "../database/db_sprites.jsx"
import { getBannerLastLiveLabel } from "../database/bannerUtils.jsx"
import Hero from "./Hero.jsx"
import { BANNERS, BANNER_RARITY_PULL_CHANCES, STARRED_HERO_PULL_WEIGHT, FEATURED_HERO_PULL_CHANCE, getBannerLiveDateInfo } from "./bannerCatalogueUtils.jsx"
import "../css/other.scss"

function BannerHeroGroup({ title, heroes, oddsPool = [], rarityChance = null, featuredHero = null }) {
    if (heroes.length === 0) return null
    const regularPool = oddsPool.filter(hero => hero.id !== featuredHero?.id)
    const totalPoolWeight = regularPool.reduce(
        (total, hero) => total + (hero.isStarred === true ? STARRED_HERO_PULL_WEIGHT : 1),
        0
    )

    return (
        <section className="banner-catalogue-rarity-group">
            <h3 className="banner-catalogue-group-title text">{title} <span>({heroes.length})</span></h3>
            <div className="banner-catalogue-hero-grid">
                {heroes.map((hero, index) => {
                    const isFeaturedHero = featuredHero?.id === hero.id
                    const heroWeight = hero.isStarred === true ? STARRED_HERO_PULL_WEIGHT : 1
                    const remainingRarityChance = featuredHero && Number(featuredHero.rarity) === Number(hero.rarity)
                        ? Math.max(0, (rarityChance ?? 0) - FEATURED_HERO_PULL_CHANCE)
                        : rarityChance
                    const odds = isFeaturedHero
                        ? FEATURED_HERO_PULL_CHANCE
                        : remainingRarityChance !== null && remainingRarityChance !== undefined && totalPoolWeight > 0
                            ? remainingRarityChance * heroWeight / totalPoolWeight
                            : null

                    return (
                        <div className="banner-catalogue-hero card" key={`${hero.id}-${index}`} title={hero.name}>
                            <Hero className="hero-static" heroObj={hero} selected={false} level={null} onClick={() => {}} />
                            {odds !== null && (
                                <span className={`banner-catalogue-hero-odds catalogue-chip text${isFeaturedHero ? " banner-catalogue-hero-odds--featured" : ""}`}>
                                    {isFeaturedHero && <img className="banner-catalogue-booster" src={resourceSprites.neutral_banner_booster} alt="" loading="lazy" decoding="async" />}
                                    {(odds * 100).toFixed(3)}% chance
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default function BannerCatalogueCard({ result, heroesById }) {
    const { banner, heroes, allHeroes = heroes, conditionalHeroes, missingHeroCount, sourceIndex } = result
    const isEverydayBanner = banner.id === "everyday_heroes"
    const featuredHero = banner.featuredHeroId
        ? (heroesById.get(banner.featuredHeroId) ?? null)
        : null
    const liveDateInfo = getBannerLiveDateInfo(BANNERS, sourceIndex)
    const lastLiveLabel = liveDateInfo.date ? getBannerLastLiveLabel(liveDateInfo.date) : ""
    const liveDateText = liveDateInfo.date
        ? `${liveDateInfo.estimated ? "~" : ""}${liveDateInfo.date}${lastLiveLabel}`
        : "N/A"
    const rarityGroups = [
        {
            title: "Legendary Heroes",
            heroes: [
                ...heroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.LEGENDARY.id),
                ...(featuredHero
                    && Number(featuredHero.rarity) === RARITY_DEFINITIONS.LEGENDARY.id
                    && !heroes.some(hero => hero.id === featuredHero.id)
                    ? [featuredHero]
                    : []),
            ],
            oddsPool: allHeroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.LEGENDARY.id),
            rarityChance: BANNER_RARITY_PULL_CHANCES[RARITY_DEFINITIONS.LEGENDARY.id],
        },
        {
            title: "Epic Heroes",
            heroes: [
                ...heroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.EPIC.id),
                ...(featuredHero
                    && Number(featuredHero.rarity) === RARITY_DEFINITIONS.EPIC.id
                    && !heroes.some(hero => hero.id === featuredHero.id)
                    ? [featuredHero]
                    : []),
            ],
            oddsPool: allHeroes.filter(hero => Number(hero.rarity) === RARITY_DEFINITIONS.EPIC.id),
            rarityChance: BANNER_RARITY_PULL_CHANCES[RARITY_DEFINITIONS.EPIC.id],
        },
        {
            title: "Other Heroes",
            heroes: heroes.filter(hero => Number(hero.rarity) !== RARITY_DEFINITIONS.LEGENDARY.id && Number(hero.rarity) !== RARITY_DEFINITIONS.EPIC.id),
            oddsPool: [],
            rarityChance: null,
        },
    ]

    return (
        <article className={`banner-catalogue-card card${isEverydayBanner ? " card-dark" : ""}`}>
            <header className="banner-catalogue-card-header">
                <h2 className="banner-catalogue-name header-big">{banner.name}</h2>
                <div className="banner-catalogue-meta">
                    <span className="catalogue-chip text">{banner.heroIds.length} listed heroes</span>
                    {banner.standardBanner && <span className="catalogue-chip text">Standard banner</span>}
                    {featuredHero && <span className="catalogue-chip text">Featured: {featuredHero.name}</span>}
                    {!isEverydayBanner &&  <span
                        className="catalogue-chip banner-catalogue-live-date text"
                        title={liveDateInfo.estimated ? "Estimated from the previous and next banner dates" : "Recorded last-live date"}
                    >
                        Last live: {liveDateText}
                    </span>}
                    {isEverydayBanner && <span className="catalogue-chip banner-catalogue-chip-permanent text">Always available</span>}
                </div>
            </header>

            <div className="banner-catalogue-groups">
                {rarityGroups.map(({ title, heroes: groupHeroes, oddsPool, rarityChance }) => (
                    <BannerHeroGroup
                        key={title}
                        title={title}
                        heroes={groupHeroes}
                        oddsPool={oddsPool}
                        rarityChance={rarityChance}
                        featuredHero={featuredHero}
                    />
                ))}
            </div>

            {conditionalHeroes.length > 0 && (
                <section className="banner-catalogue-conditional">
                    <h3 className="banner-catalogue-group-title text">Conditional Heroes ({conditionalHeroes.length})</h3>
                    <div className="banner-catalogue-hero-grid">
                        {conditionalHeroes.map((hero, index) => (
                            <div className="banner-catalogue-hero" key={`${hero.id}-conditional-${index}`} title={hero.name}>
                                <Hero heroObj={hero} selected={false} level={null} onClick={() => {}} />
                                <span className="banner-catalogue-hero-odds banner-catalogue-hero-odds--conditional text">
                                    Conditional
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {missingHeroCount > 0 && (
                <p className="banner-catalogue-missing text">
                    {missingHeroCount} referenced {missingHeroCount === 1 ? "hero is" : "heroes are"} not defined in the hero database.
                </p>
            )}
        </article>
    )
}
