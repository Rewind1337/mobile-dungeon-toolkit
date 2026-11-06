import { attributeSprites, perkSprites } from "../database/db_sprites.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import CataloguePerkList from "./CataloguePerkList.jsx"
import { PRIMARY_STAT_DEFINITIONS } from "../database/enums.jsx"
import { ATTRIBUTE_ICON_KEYS, getAttributeRequirementLabel, getDropSourceLabel, getSetLocations } from "../js/catalogueItemUtils.jsx"
import "../css/item.scss"
import "../css/infos.scss"
import "../css/infos_items.scss"

export default function SetCatalogueCard({ set, pieces }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const setName = tc("set", set.id, "name", set.name)
    const locations = getSetLocations(set, pieces)
    const rawAttributeLabel = getAttributeRequirementLabel(set.attributeRequirement)
    const attributeLabel = rawAttributeLabel === "Not specified" ? t("app.shared.notSpecified") : rawAttributeLabel === "None" ? t("app.shared.none") : tc("attribute", rawAttributeLabel.toUpperCase(), "name", rawAttributeLabel)
    const attributeKey = ATTRIBUTE_ICON_KEYS[rawAttributeLabel.toLowerCase()]
    const mainAttribute = Object.values(PRIMARY_STAT_DEFINITIONS).find(attribute => attribute.id === Number(set.mainAttribute))
    const mainAttributeSprite = mainAttribute ? perkSprites[`${mainAttribute.name}_FLAT`] : null
    const mainAttributeLabel = mainAttribute ? tc("primaryStat", mainAttribute.name, "name", { ATTACK: "Attack", DEFENCE: "Defense", AGILITY: "Agility" }[mainAttribute.name] ?? mainAttribute.name) : ""
    const attributeClass = rawAttributeLabel.toLowerCase().includes("strength")
        ? "catalogue-chip-attribute-strength"
        : rawAttributeLabel.toLowerCase().includes("dexterity")
            ? "catalogue-chip-attribute-dexterity"
            : rawAttributeLabel.toLowerCase().includes("intelligence")
                ? "catalogue-chip-attribute-intelligence"
                : ""

    return (
        <article className="catalogue-set-card card">
            <header className="catalogue-set-header">
                <div className="catalogue-set-name text">{setName}</div>
                <div className="catalogue-set-attribute-row flex-row justify-center">
                    <span className={`catalogue-set-requirement catalogue-chip text catalogue-chip-attribute ${attributeClass}`}>
                        {attributeSprites[attributeKey] && <img className="catalogue-chip-icon" src={attributeSprites[attributeKey]} alt="" />}
                        {attributeLabel}
                    </span>
                    {mainAttribute && <span className="catalogue-chip text catalogue-chip-main-attribute" title={mainAttributeLabel}>
                        {mainAttributeSprite && <img className="catalogue-chip-icon" src={mainAttributeSprite} alt="" />}
                        {mainAttributeLabel}
                    </span>}
                </div>
                <div className="catalogue-set-meta flex-row justify-center text">
                    <span className="catalogue-chip text">{getDropSourceLabel(set.dropSource, locations, { label: t("app.shared.dropSource"), unspecified: t("app.shared.unspecified"), guildHuntShort: t("app.shared.guildHuntShort") })}</span>
                </div>
                <section className="catalogue-set-pieces">
                    <div className="catalogue-section-label text">{t("app.pages.catalogues.piecesCount", { count: pieces.length })}</div>
                    {pieces.length > 0
                        ? <ul className="catalogue-piece-list">
                            {pieces.map(item => (
                                <li className="catalogue-piece card" key={item.id}>
                                    <img className="catalogue-piece-image" src={item.itemSrc} alt="" draggable={false} />
                                    <span className="catalogue-piece-name text">{tc("item", item.id, "name", item.name)}</span>
                                </li>
                            ))}
                        </ul>
                        : <p className="catalogue-muted">{t("app.pages.catalogues.noSetPieces")}</p>
                    }
                </section>
            </header>
            <CataloguePerkList perks={set.setBonus} label={t("app.shared.setBonuses")} />
        </article>
    )
}
