import { attributeSprites, iconSprites, perkSprites } from "../database/db_sprites.jsx"
import { ATTRIBUTE_DEFINITIONS, PRIMARY_STAT_DEFINITIONS, RARITY_DEFINITIONS } from "../database/enums.jsx"
import { humanize } from "../js/util.jsx"
import Item from "./Item.jsx"
import CataloguePerkList from "./CataloguePerkList.jsx"
import { ATTRIBUTE_ICON_KEYS, SLOT_ICON_KEYS, getAttributeRequirementLabel, getDropSourceLabel, getEffectStatuses, getLocations } from "../js/catalogueItemUtils.jsx"
import "../css/item.scss"
import "../css/infos.scss"
import "../css/infos_items.scss"

function renderUniqueEffectDescription(item) {
    const description = item.unique?.description
    if (!description) return null
    const parts = description.split("$e")
    if (parts.length === 1) return description
    const values = Array.isArray(item.unique?.rarityEffect) ? item.unique.rarityEffect : []
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
    return parts.map((part, index) => (
        <span key={index}>{part}{index < parts.length - 1 && <>{effectArray}<span className="rarity-effect-unit"> %</span></>}</span>
    ))
}

export default function ItemCatalogueCard({ item, set }) {
    const statuses = getEffectStatuses(item)
    const effectDescription = item.unique?.description
    const mainAttribute = Object.values(PRIMARY_STAT_DEFINITIONS).find(attribute => attribute.id === Number(item.mainAttribute))
    const mainAttributeSprite = mainAttribute ? perkSprites[`${mainAttribute.name}_FLAT`] : null
    const mainAttributeShortName = { ATTACK: "ATK", DEFENCE: "DEF", AGILITY: "AGI" }[mainAttribute?.name] ?? ""
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
                    <div className="catalogue-item-name text">{item.name}</div>
                    <div className="catalogue-item-meta-row">
                        <div className="catalogue-item-meta text">
                            <span className="catalogue-chip text catalogue-item-slot-chip">
                                {iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]] && <img className="catalogue-chip-icon" src={iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]]} alt="" />}
                                {humanize(item.slotLabel ?? "Unknown slot")}
                            </span>
                            {mainAttribute && <span className="catalogue-chip text catalogue-chip-main-attribute" title={humanize(mainAttribute.name)}>
                                {mainAttributeSprite && <img className="catalogue-chip-icon" src={mainAttributeSprite} alt="" />}
                                {mainAttributeShortName}
                            </span>}
                            {hasAllAttributeRequirement
                                ? <span className="catalogue-chip text catalogue-chip-attribute catalogue-item-attribute-all">
                                    {[ATTRIBUTE_DEFINITIONS.STRENGTH.id, ATTRIBUTE_DEFINITIONS.DEXTERITY.id, ATTRIBUTE_DEFINITIONS.INTELLIGENCE.id].map(attributeId => (
                                        <img className="catalogue-chip-icon" key={attributeId} src={attributeSprites[attributeId]} alt="" />
                                    ))}
                                    All
                                </span>
                                : <span className={`catalogue-chip text catalogue-chip-attribute ${getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("strength") ? "catalogue-chip-attribute-strength" : getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("dexterity") ? "catalogue-chip-attribute-dexterity" : getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("intelligence") ? "catalogue-chip-attribute-intelligence" : ""}`}>
                                    {attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]] && <img className="catalogue-chip-icon" src={attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]]} alt="" />}
                                    {getAttributeRequirementLabel(item.attributeRequirement)}
                                </span>}
                            {set && <p className="catalogue-item-set catalogue-chip text">Set: {set.name}</p>}
                        </div>
                    </div>
                    <div className="catalogue-item-source-row text">
                        <p className="catalogue-item-source"><span className="catalogue-chip text">{getDropSourceLabel(item.dropSource, getLocations(item))}</span></p>
                    </div>
                </div>
            </div>

            {effectDescription && (
                <section className="catalogue-effect card">
                    <div className="catalogue-section-label text flex-row">
                        {statuses.length > 0 && (
                            <div className="catalogue-statuses" aria-label="Statuses applied by weapon effect">
                                {statuses.map(status => (
                                    <img className="catalogue-status-icon" key={status.key} src={status.sprite} alt={status.name} title={status.name} draggable={false} />
                                ))}
                            </div>
                        )}
                        <div className="text">Unique Effect</div>
                    </div>
                    <p className="catalogue-effect-description text">{renderUniqueEffectDescription(item)}</p>
                </section>
            )}

            <CataloguePerkList perks={item.fixedPerks} label="Fixed perks" />
            {set && <CataloguePerkList perks={set.setBonus} label="Set bonuses" />}
        </article>
    )
}
