import { statusSprites } from "../database/db_sprites.jsx"
import CheckmarkSprite from "../sprites/checkmark.webp"
import CrossSprite from "../sprites/cross.png"
import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { STATUS_DESCRIPTIONS, humanize, getCategory, getDetails } from "./statusCatalogueUtils.jsx"
import "../css/other.scss"

export default function StatusCatalogueCard({ status }) {
    const category = getCategory(status)
    const sprite = statusSprites[status.name] ?? statusSprites[status.name.replace("critical_resistance", "critical_resist")]
    const description = STATUS_DESCRIPTIONS[status.name]
        ?? `Special status effect (${humanize(status.effectType ?? "effect")}). Check its stored effect data for the exact behaviour.`
    const details = getDetails(status)
    const categoryClass = `status-category-${category.toLowerCase().replaceAll(" ", "-")}`

    return (
        <CatalogueEntryCard className="status-catalogue-card" dataCategory={category.toLowerCase()} icon={sprite}>
            <header className="catalogue-entry-heading status-catalogue-heading">
                <h3 className="catalogue-entry-name text-big status-catalogue-name">{humanize(status.name)}</h3>
            </header>
            <p className="status-catalogue-description text">{description}</p>
            <div className="status-polarity-row" aria-label="Status effect properties">
                <span className={`catalogue-chip text status-catalogue-category ${categoryClass}`}>{category}</span>
                <span className={`catalogue-chip text status-polarity ${status.mitigatable === false ? "status-polarity-negative" : "status-polarity-positive"}`} title={status.mitigatable === false ? "Not mitigatable" : "Mitigatable"}>
                    <img className={`status-polarity-icon${status.mitigatable === false ? " is-negative" : ""}`} src={status.mitigatable === false ? CrossSprite : CheckmarkSprite} alt={status.mitigatable === false ? "No" : "Yes"} />
                    <span>Mitigatable</span>
                </span>
                <span className={`catalogue-chip text status-polarity ${status.removable === false ? "status-polarity-negative" : "status-polarity-positive"}`} title={status.removable === false ? "Not removable" : "Removable"}>
                    <img className={`status-polarity-icon${status.removable === false ? " is-negative" : ""}`} src={status.removable === false ? CrossSprite : CheckmarkSprite} alt={status.removable === false ? "No" : "Yes"} />
                    <span>Removable</span>
                </span>
            </div>
            {details.length > 0 && (
                <ul className="status-catalogue-details">
                    {details.map(detail => <li className="text" key={detail}>{detail}</li>)}
                </ul>
            )}
        </CatalogueEntryCard>
    )
}
