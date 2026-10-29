import { attributeSprites } from "../database/db_sprites.jsx"
import CataloguePerkList from "./CataloguePerkList.jsx"
import { ATTRIBUTE_ICON_KEYS, getAttributeRequirementLabel, getDropSourceLabel, getSetLocations } from "./catalogueItemUtils.jsx"
import "../css/item.scss"
import "../css/other.scss"

export default function SetCatalogueCard({ set, pieces }) {
    const locations = getSetLocations(set, pieces)
    const attributeLabel = getAttributeRequirementLabel(set.attributeRequirement)
    const attributeKey = ATTRIBUTE_ICON_KEYS[attributeLabel.toLowerCase()]
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
                <div className="catalogue-set-name catalogue-chip catalogue-chip-name header text">{set.name}</div>
                <p className={`catalogue-set-requirement catalogue-chip text catalogue-chip-attribute ${attributeClass}`}>
                    {attributeSprites[attributeKey] && <img className="catalogue-chip-icon" src={attributeSprites[attributeKey]} alt="" />}
                    Attribute: {attributeLabel}
                </p>
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
