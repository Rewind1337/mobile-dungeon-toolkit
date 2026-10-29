import { attributeSprites, iconSprites } from "../database/db_sprites.jsx"
import { humanize } from "../js/util.jsx"
import Item from "./Item.jsx"
import CataloguePerkList from "./CataloguePerkList.jsx"
import { ATTRIBUTE_ICON_KEYS, SLOT_ICON_KEYS, getAttributeRequirementLabel, getDropSourceLabel, getEffectStatuses, getLocations } from "../js/catalogueItemUtils.jsx"
import "../css/item.scss"
import "../css/infos.scss"
import "../css/infos_items.scss"

export default function ItemCatalogueCard({ item, set }) {
    const statuses = getEffectStatuses(item)
    const effectDescription = item.unique?.description

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
                            <span className="catalogue-chip text">
                                {iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]] && <img className="catalogue-chip-icon" src={iconSprites[SLOT_ICON_KEYS[String(item.slotLabel ?? "").toUpperCase()]]} alt="" />}
                                {humanize(item.slotLabel ?? "Unknown slot")}
                            </span>
                            <span className={`catalogue-chip text catalogue-chip-attribute ${getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("strength") ? "catalogue-chip-attribute-strength" : getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("dexterity") ? "catalogue-chip-attribute-dexterity" : getAttributeRequirementLabel(item.attributeRequirement).toLowerCase().includes("intelligence") ? "catalogue-chip-attribute-intelligence" : ""}`}>
                                {attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]] && <img className="catalogue-chip-icon" src={attributeSprites[ATTRIBUTE_ICON_KEYS[getAttributeRequirementLabel(item.attributeRequirement).toLowerCase()]]} alt="" />}
                                Attribute: {getAttributeRequirementLabel(item.attributeRequirement)}
                            </span>
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
                    <p className="catalogue-effect-description text">{effectDescription}</p>
                </section>
            )}

            <CataloguePerkList perks={item.fixedPerks} label="Fixed perks" />
            {set && <CataloguePerkList perks={set.setBonus} label="Set bonuses" />}
        </article>
    )
}
