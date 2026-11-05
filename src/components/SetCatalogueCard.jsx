import { attributeSprites, perkSprites } from "../database/db_sprites.jsx"
import CataloguePerkList from "./CataloguePerkList.jsx"
import { PRIMARY_STAT_DEFINITIONS } from "../database/enums.jsx"
import { humanize } from "../js/util.jsx"
import { ATTRIBUTE_ICON_KEYS, getAttributeRequirementLabel, getDropSourceLabel, getSetLocations } from "../js/catalogueItemUtils.jsx"
import "../css/item.scss"
import "../css/infos.scss"
import "../css/infos_items.scss"

export default function SetCatalogueCard({ set, pieces }) {
    const locations = getSetLocations(set, pieces)
    const attributeLabel = getAttributeRequirementLabel(set.attributeRequirement)
    const attributeKey = ATTRIBUTE_ICON_KEYS[attributeLabel.toLowerCase()]
    const mainAttribute = Object.values(PRIMARY_STAT_DEFINITIONS).find(attribute => attribute.id === Number(set.mainAttribute))
    const mainAttributeSprite = mainAttribute ? perkSprites[`${mainAttribute.name}_FLAT`] : null
    const attributeClass = attributeLabel.toLowerCase().includes("strength")
        ? "catalogue-chip-attribute-strength"
        : attributeLabel.toLowerCase().includes("dexterity")
            ? "catalogue-chip-attribute-dexterity"
            : attributeLabel.toLowerCase().includes("intelligence")
                ? "catalogue-chip-attribute-intelligence"
                : ""

    return (
        <article className="catalogue-set-card card">
            <header className="catalogue-set-header">
                <div className="catalogue-set-name text">{set.name}</div>
                <div className="catalogue-set-attribute-row flex-row justify-center">
                    <span className={`catalogue-set-requirement catalogue-chip text catalogue-chip-attribute ${attributeClass}`}>
                        {attributeSprites[attributeKey] && <img className="catalogue-chip-icon" src={attributeSprites[attributeKey]} alt="" />}
                        {attributeLabel}
                    </span>
                    {mainAttribute && <span className="catalogue-chip text catalogue-chip-main-attribute">
                        {mainAttributeSprite && <img className="catalogue-chip-icon" src={mainAttributeSprite} alt="" />}
                        {humanize(mainAttribute.name)}
                    </span>}
                </div>
                <div className="catalogue-set-meta flex-row justify-center text">
                    <span className="catalogue-chip text">{getDropSourceLabel(set.dropSource, locations)}</span>
                </div>
                <section className="catalogue-set-pieces">
                    <div className="catalogue-section-label text">Pieces ({pieces.length})</div>
                    {pieces.length > 0
                        ? <ul className="catalogue-piece-list">
                            {pieces.map(item => (
                                <li className="catalogue-piece card" key={item.id}>
                                    <img className="catalogue-piece-image" src={item.itemSrc} alt="" draggable={false} />
                                    <span className="catalogue-piece-name text">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                        : <p className="catalogue-muted">No item pieces are currently linked to this set in the item database.</p>
                    }
                </section>
            </header>
            <CataloguePerkList perks={set.setBonus} label="Set bonuses" />
        </article>
    )
}
