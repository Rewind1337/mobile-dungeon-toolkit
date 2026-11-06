import { attributeSprites, iconSprites, perkSprites } from "../database/db_sprites.jsx"
import { ATTRIBUTE_DEFINITIONS, PRIMARY_STAT_DEFINITIONS, RARITY_DEFINITIONS } from "../database/enums.jsx"
import { humanize } from "../js/utils.js"
import Item from "./Item.jsx"
import CataloguePerkList from "./CataloguePerkList.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import { ATTRIBUTE_ICON_KEYS, SLOT_ICON_KEYS, getAttributeRequirementLabel, getDropSourceLabel, getEffectStatuses, getLocations } from "../js/catalogueItemUtils.jsx"
import "../css/item.scss"
import "../css/infos.scss"
import "../css/infos_items.scss"

function renderUniqueEffectDescription(item, tc, statuses) {
    const fallback = item.unique?.description
    if (!fallback) return null
    const values = Array.isArray(item.unique?.rarityEffect) ? item.unique.rarityEffect : []
    const marker = "__UNIQUE_EFFECT_VALUE__"
    const statusNames = statuses.map(status => tc("status", status.key, "name", status.name)).join(", ")
    const duration = fallback.match(/\bfor\s+(\d+)\s+turns?\b/i)?.[1] ?? ""
    const template = tc("item", item.id, "effects.unique", fallback, {
        value: marker,
        chance: marker,
        status: statusNames,
        duration,
    })
    const effectArray = (
        <span className="rarity-effect-array">
            <span className="rarity-effect-bracket">[</span>
            {values.map((value, index) => (
                <span key={index}>
                    {index > 0 && <span className="rarity-effect-separator">, </span>}
                    <span className="rarity-effect-value" data-rarity={RARITY_DEFINITIONS.RARE.id + index}>
                        {Math.round((Number(value) - 1) * 100)}
                    </span>
                </span>
            ))}
            {values.length > 0 && <span className="rarity-effect-separator">, </span>}
            <span className="rarity-effect-unknown">?</span>
            <span className="rarity-effect-bracket">]</span>
        </span>
    )
    const parts = template.split(marker)
    if (parts.length === 1) return template
    return parts.map((part, index) => (
        <span key={index}>{part}{index < parts.length - 1 && <>{effectArray}<span className="rarity-effect-unit"> %</span></>}</span>
    ))
}

export default function ItemCatalogueCard({ item, set }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const statuses = getEffectStatuses(item)
    const effectDescription = item.unique?.description
    const itemName = tc("item", item.id, "name", item.name)
    const setName = set ? tc("set", set.id, "name", set.name) : ""
    const mainAttribute = Object.values(PRIMARY_STAT_DEFINITIONS).find(attribute => attribute.id === Number(item.mainAttribute))
    const mainAttributeSprite = mainAttribute ? perkSprites[`${mainAttribute.name}_FLAT`] : null
    const mainAttributeLabel = mainAttribute ? tc("primaryStat", mainAttribute.name, "name", { ATTACK: "Attack", DEFENCE: "Defense", AGILITY: "Agility" }[mainAttribute.name] ?? mainAttribute.name) : ""
    const slotKey = String(item.slotLabel ?? "").toUpperCase().replace(/S$/, "")
    const slotLabel = tc("equipmentSlot", slotKey, "name", humanize(item.slotLabel ?? "Unknown slot"))
    const attributeRequirement = getAttributeRequirementLabel(item.attributeRequirement)
    const attributeRequirementLabel = attributeRequirement === "Not specified" ? t("app.shared.notSpecified") : attributeRequirement === "None" ? t("app.shared.none") : tc("attribute", attributeRequirement.toUpperCase(), "name", attributeRequirement)
    const hasAllAttributeRequirement = item.attributeRequirement !== null
        && item.attributeRequirement !== undefined
        && Number(item.attributeRequirement) === ATTRIBUTE_DEFINITIONS.NONE.id

    return (
        <article className="catalogue-item-card card" data-rarity={item.rarity}>
            <div className="catalogue-item-identity">
                <div className="catalogue-item-preview" aria-hidden="true">
                    <Item itemObj={item} selected={false} level={null} />
                </div>
                <div className="catalogue-item-heading">
                    <div className="catalogue-item-name text">{itemName}</div>
                    <div className="catalogue-item-meta-row">
                        <div className="catalogue-item-meta text">
                            <span className="catalogue-chip text catalogue-item-slot-chip">
                                {iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]] && <img className="catalogue-chip-icon" src={iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]]} alt="" />}
                                {slotLabel}
                            </span>
                            {mainAttribute && <span className="catalogue-chip text catalogue-chip-main-attribute" title={mainAttributeLabel}>
                                {mainAttributeSprite && <img className="catalogue-chip-icon" src={mainAttributeSprite} alt="" />}
                                {mainAttributeLabel}
                            </span>}
                            {hasAllAttributeRequirement
                                ? <span className="catalogue-chip text catalogue-chip-attribute catalogue-item-attribute-all">
                                    {[ATTRIBUTE_DEFINITIONS.STRENGTH.id, ATTRIBUTE_DEFINITIONS.DEXTERITY.id, ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id].map(attributeId => (
                                        <img className="catalogue-chip-icon" key={attributeId} src={attributeSprites[attributeId]} alt="" />
                                    ))}
                                    {t("app.shared.all")}
                                </span>
                                : <span className={`catalogue-chip text catalogue-chip-attribute ${attributeRequirement.toLowerCase().includes("strength") ? "catalogue-chip-attribute-strength" : attributeRequirement.toLowerCase().includes("dexterity") ? "catalogue-chip-attribute-dexterity" : attributeRequirement.toLowerCase().includes("intelligence") ? "catalogue-chip-attribute-intelligence" : ""}`}>
                                    {attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]] && <img className="catalogue-chip-icon" src={attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]]} alt="" />}
                                    {attributeRequirementLabel}
                                </span>}
                            {set && <p className="catalogue-item-set catalogue-chip text">{t("app.shared.setName", { name: setName })}</p>}
                        </div>
                    </div>
                    <div className="catalogue-item-source-row text">
                        <p className="catalogue-item-source"><span className="catalogue-chip text">{getDropSourceLabel(item.dropSource, getLocations(item), { label: t("app.shared.dropSource"), unspecified: t("app.shared.unspecified"), guildHuntShort: t("app.shared.guildHuntShort") })}</span></p>
                    </div>
                </div>
            </div>

            {effectDescription && (
                <section className="catalogue-effect card">
                    <div className="catalogue-section-label text flex-row">
                        {statuses.length > 0 && (
                            <div className="catalogue-statuses" aria-label={t("app.shared.statusesAppliedByWeaponEffect")}>
                                {statuses.map(status => (
                                    <img className="catalogue-status-icon" key={status.key} src={status.sprite} alt={tc("status", status.key, "name", status.name)} title={tc("status", status.key, "name", status.name)} draggable={false} />
                                ))}
                            </div>
                        )}
                        <div className="text">{t("app.shared.uniqueEffect")}</div>
                    </div>
                    <p className="catalogue-effect-description text">{renderUniqueEffectDescription(item, tc, statuses)}</p>
                </section>
            )}

            <CataloguePerkList perks={item.fixedPerks} label={t("app.shared.fixedPerks")} />
            {set && <CataloguePerkList perks={set.setBonus} label={t("app.shared.setBonuses")} />}
        </article>
    )
}
