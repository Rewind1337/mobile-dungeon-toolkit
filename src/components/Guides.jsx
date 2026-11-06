import { useTranslate } from "../hooks/useTranslate.jsx"
import AeternaSprite from "../sprites/heroes/aeterna.webp"
import AliceSprite from "../sprites/heroes/alice.webp"
import AnubisSprite from "../sprites/heroes/anubis.webp"
import AthenaSprite from "../sprites/heroes/athena.webp"
import ApolloSprite from "../sprites/heroes/apollo.webp"
import MercySprite from "../sprites/heroes/mercy.webp"
import VoidAssassinSprite from "../sprites/heroes/void_assassin.webp"
import CandyElementalSprite from "../sprites/heroes/candy_elemental.webp"
import LightSwordSprite from "../sprites/weapons/unique/light_sword.webp"
import BreakerHelmetSprite from "../sprites/helmets/sets/breaker.webp"
import BreakerArmorSprite from "../sprites/armors/sets/breaker.webp"
import BreakerRingSprite from "../sprites/rings/sets/breaker.webp"
import BreakerNecklaceSprite from "../sprites/necklaces/sets/breaker.webp"
import SoulSprite from "../sprites/resources/soul.webp"
import ShimmeringSoulSprite from "../sprites/resources/shimmering_soul.webp"
import LegendaryBoosterSprite from "../sprites/resources/legendary_banner_booster.webp"
import EpicBoosterSprite from "../sprites/resources/epic_banner_booster.webp"

function GuideStep({ number, title, children }) {
    return (
        <section className="guide-step card">
            <span className="guide-step-number card card-static header">{number}</span>
            <div className="guide-step-body">
                <h3 className="guide-step-title header">{title}</h3>
                <div className="guide-step-copy text">{children}</div>
            </div>
        </section>
    )
}

function GuideAsset({ src, label, alt = "" }) {
    return (
        <div className="guide-asset card">
            <img src={src} alt={alt || label} loading="lazy" decoding="async" draggable={false} />
            <span className="text">{label}</span>
        </div>
    )
}

function GuideLead({ eyebrow, title, children }) {
    return (
        <header className="guide-lead">
            <span className="guide-eyebrow text">{eyebrow}</span>
            <h2 className="guide-lead-title text">{title}</h2>
            <p className="guide-copy-header text">{children}</p>
        </header>
    )
}

export function HeroManagementGuide() {
    const t = useTranslate()
    return (
        <div className="page-guide">
            <GuideLead eyebrow={t("app.pages.guides.heroEyebrow")} title={t("app.pages.guides.heroTitle")}>{t("app.pages.guides.heroLeadCopy")}</GuideLead>

            <span className="guide-example-kicker text">{t("app.pages.guides.exampleHeroes")}</span>
            <div className="guide-equipment-strip">
                <GuideAsset src={AeternaSprite} label="Aeterna" />
                <GuideAsset src={AliceSprite} label="Alice" />
                <GuideAsset src={AnubisSprite} label="Anubis" />
                <GuideAsset src={AthenaSprite} label="Athena" />
                <GuideAsset src={ApolloSprite} label="Apollo" />
            </div>

            <p className="guide-copy text">{t("app.pages.guides.heroPreview")}</p>

            <div className="guide-steps">
                <GuideStep number="1" title={t("app.pages.guides.searchCombineFilters")}>{t("app.pages.guides.heroStep1")}</GuideStep>
                <GuideStep number="2" title={t("app.pages.guides.inspectPreview")}>{t("app.pages.guides.heroStep2")}</GuideStep>
                <GuideStep number="3" title={t("app.pages.guides.saveHero")}>{t("app.pages.guides.heroStep3")}</GuideStep>
                <GuideStep number="4" title={t("app.pages.guides.modifyBuilds")}>{t("app.pages.guides.heroStep4")}</GuideStep>
            </div>
            <p className="guide-tip card text"><strong>{t("app.pages.guides.tip")}</strong> {t("app.pages.guides.savedBuildTip")}</p>
        </div>
    )
}

export function ItemManagementGuide() {
    const t = useTranslate()
    return (
        <div className="page-guide">
            <GuideLead eyebrow={t("app.pages.guides.itemEyebrow")} title={t("app.pages.guides.itemTitle")}>{t("app.pages.guides.itemLeadCopy")}</GuideLead>

            <span className="guide-example-kicker text">{t("app.pages.guides.exampleEquipment")}</span>

            <div className="guide-equipment-showcase">
                <GuideAsset src={LightSwordSprite} label="Light Sword" />
                <GuideAsset src={BreakerHelmetSprite} label="Breaker Helmet" />
                <GuideAsset src={BreakerArmorSprite} label="Breaker Armor" />
                <GuideAsset src={BreakerRingSprite} label="Breaker Ring" />
                <GuideAsset src={BreakerNecklaceSprite} label="Breaker Necklace" />
            </div>

            <div className="guide-steps">
                <GuideStep number="1" title={t("app.pages.guides.narrowList")}>{t("app.pages.guides.itemStep1")}</GuideStep>
                <GuideStep number="2" title={t("app.pages.guides.inspectItem")}>{t("app.pages.guides.itemStep2")}</GuideStep>
                <GuideStep number="3" title={t("app.pages.guides.saveItem")}>{t("app.pages.guides.itemStep3")}</GuideStep>
                <GuideStep number="4" title={t("app.pages.guides.modifyBuilds")}>{t("app.pages.guides.itemStep4")}</GuideStep>
            </div>
            <p className="guide-tip card text"><strong>{t("app.pages.guides.tip")}</strong> {t("app.pages.guides.savedBuildTip")}{t("app.pages.guides.itemTipExtra")}</p>
        </div>
    )
}

export function TeamManagementGuide() {
    const t = useTranslate()
    const members = [
        [AeternaSprite, "Aeterna"],
        [VoidAssassinSprite, "Void Assassin"],
        [MercySprite, "Mercy"],
        [AthenaSprite, "Athena"],
        [CandyElementalSprite, "Candy Elemental"],
    ]

    return (
        <div className="page-guide">
            <GuideLead eyebrow={t("app.pages.guides.teamsEyebrow")} title={t("app.pages.guides.teamsTitle")}>{t("app.pages.guides.teamLeadCopy")}</GuideLead>


            <span className="guide-example-kicker text">{t("app.pages.guides.exampleLineup")}</span>

            <div className="guide-team-roster card card-dark card-static">
                {members.map(([src, name], index) => (
                    <div className="guide-team-member card" key={name}>
                        <span className="guide-team-slot text">{t("app.shared.slot", { number: index + 1 })}</span>
                        <img src={src} alt={name} loading="lazy" decoding="async" draggable={false} />
                        <span className="text">{name}</span>
                    </div>
                ))}
            </div>

            <div className="guide-steps">
                <GuideStep number="1" title={t("app.pages.guides.createNameTeams")}>{t("app.pages.guides.teamStep1")}</GuideStep>
                <GuideStep number="2" title={t("app.pages.guides.fillHeroSlots")}>{t("app.pages.guides.teamStep2")}</GuideStep>
                <GuideStep number="3" title={t("app.pages.guides.reviewTeamSummary")}>{t("app.pages.guides.teamStep3")}</GuideStep>
                <GuideStep number="4" title={t("app.pages.guides.organizeRoster")}>{t("app.pages.guides.teamStep4")}</GuideStep>
                <GuideStep number="5" title={t("app.pages.guides.exportFullTeams")}>{t("app.pages.guides.teamStep5")}</GuideStep>
            </div>
            <p className="guide-tip"><strong>{t("app.pages.guides.tip")}</strong> {t("app.pages.guides.teamTip")}</p>
        </div>
    )
}

export function SimulatorsGuide() {
    const t = useTranslate()
    return (
        <div className="page-guide">
            <GuideLead eyebrow={t("app.navigation.simulators")} title={t("app.pages.guides.simulatorTitle")}>{t("app.pages.guides.simulatorLeadCopy")}</GuideLead>

            <span className="guide-example-kicker text">{t("app.pages.guides.trackUsage")}</span>

            <div className="guide-equipment-showcase">
                <GuideAsset src={SoulSprite} label="Souls" />
                <GuideAsset src={ShimmeringSoulSprite} label="Shimmering Souls" />
                <GuideAsset src={EpicBoosterSprite} label="Epic Boosters" />
                <GuideAsset src={LegendaryBoosterSprite} label="Legendary Boosters" />
            </div>

            <div className="guide-steps">
                <GuideStep number="1" title={t("app.pages.guides.chooseBannerPity")}>{t("app.pages.guides.simulatorStep1")}</GuideStep>
                <GuideStep number="2" title={t("app.pages.guides.configureBoosters")}>{t("app.pages.guides.simulatorStep2")}</GuideStep>
                <GuideStep number="3" title={t("app.pages.guides.chooseFlush")}>{t("app.pages.guides.simulatorStep3")}</GuideStep>
                <GuideStep number="4" title={t("app.pages.guides.reviewResults")}>{t("app.pages.guides.simulatorStep4")}</GuideStep>
            </div>
            <p className="guide-tip"><strong>{t("app.pages.guides.tip")}</strong> {t("app.pages.guides.simulatorTip")}</p>
            <p className="guide-tip"><strong>{t("app.pages.guides.warning")}</strong> {t("app.pages.guides.simulatorWarning")}</p>
        </div>
    )
}

export function GamesGuide() {
    const t = useTranslate()
    return (
        <div className="page-guide">
            <GuideLead eyebrow={t("app.navigation.games")} title={t("app.pages.guides.gamesTitle")}>{t("app.pages.guides.gamesLeadCopy")}</GuideLead>
            <p className="guide-tip"><strong>{t("app.pages.guides.comingLater")}</strong> {t("app.pages.guides.gamesComingLater")}</p>
        </div>
    )
}
