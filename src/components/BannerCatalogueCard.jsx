import { RARITY_DEFINITIONS } from "../database/enums.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import { resourceSprites } from "../database/db_sprites.jsx"
import { getBannerLastLiveLabel } from "../js/bannerUtils.jsx"
import Hero from "./Hero.jsx"
import { BANNERS, BANNER_RARITY_PULL_CHANCES, STARRED_HERO_PULL_WEIGHT, FEATURED_HERO_PULL_CHANCE, getBannerLiveDateInfo } from "../js/bannerCatalogueUtils.jsx"
import "../css/infos.scss"
import "../css/infos_resources.scss"

function BannerHeroGroup({ title, heroes, oddsPool = [], rarityChance = null, featuredHero = null }) {
    const t = useTranslate()
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
                                    {t("app.shared.chance", { percent: (odds * 100).toFixed(3) })}
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
    const t = useTranslate()
    const tc = useContentTranslation()
    const { banner, heroes, allHeroes = heroes, conditionalHeroes, missingHeroCount, sourceIndex } = result
    const bannerName = tc("banner", banner.id, "name", banner.name)
    const bannerCondition = tc("banner", banner.id, "conditionalHeroCondition", banner.conditionalHeroCondition)
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
            title: t("app.shared.legendaryHeroes"),
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
            title: t("app.shared.epicHeroes"),
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
            title: t("app.shared.otherHeroes"),
            heroes: heroes.filter(hero => Number(hero.rarity) !== RARITY_DEFINITIONS.LEGENDARY.id && Number(hero.rarity) !== RARITY_DEFINITIONS.EPIC.id),
            oddsPool: [],
            rarityChance: null,
        },
    ]

    return (
        <article className={`banner-catalogue-card card${isEverydayBanner ? " card-dark" : ""}`}>
            <header className="banner-catalogue-card-header">
                <h2 className="banner-catalogue-name header-big">{bannerName}</h2>
                <div className="banner-catalogue-meta">
                    <span className="catalogue-chip text">{t("app.pages.catalogues.listedHeroes", { count: banner.heroIds.length })}</span>
                    {banner.standardBanner && <span className="catalogue-chip text">{t("app.pages.catalogues.standardBanner")}</span>}
                    {featuredHero && <span className="catalogue-chip text">{t("app.pages.catalogues.featuredHero", { name: tc("hero", featuredHero.id, "name", featuredHero.name) })}</span>}
                    {!isEverydayBanner &&  <span
                        className="catalogue-chip banner-catalogue-live-date text"
                        title={liveDateInfo.estimated ? t("app.pages.catalogues.estimatedBannerDate") : t("app.pages.catalogues.recordedLastLiveDate")}
                    >
                        {t("app.shared.lastLive", { date: liveDateText })}
                    </span>}
                    {isEverydayBanner && <span className="catalogue-chip banner-catalogue-chip-permanent text">{t("app.pages.catalogues.alwaysAvailable")}</span>}
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
                    <h3 className="banner-catalogue-group-title text">{bannerCondition || t("app.pages.catalogues.conditionalHeroes")} ({conditionalHeroes.length})</h3>
                    <div className="banner-catalogue-hero-grid">
                        {conditionalHeroes.map((hero, index) => (
                            <div className="banner-catalogue-hero" key={`${hero.id}-conditional-${index}`} title={hero.name}>
                                <Hero heroObj={hero} selected={false} level={null} onClick={() => {}} />
                                <span className="banner-catalogue-hero-odds banner-catalogue-hero-odds--conditional text">
                                    {t("app.shared.conditional")}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {missingHeroCount > 0 && (
                <p className="banner-catalogue-missing text">{t("app.pages.catalogues.bannerDataMissing")}
                    {t("app.shared.missingReferencedHeroes", { count: missingHeroCount, noun: t(missingHeroCount === 1 ? "app.shared.missingHeroSingular" : "app.shared.missingHeroPlural") })}
                </p>
            )}
        </article>
    )
}
