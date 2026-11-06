import { statusSprites } from "../database/db_sprites.jsx"
import CheckmarkSprite from "../sprites/checkmark.webp"
import CrossSprite from "../sprites/cross.png"
import CollapseSrc from "../sprites/collapse.webp"
import ExpandSrc from "../sprites/expand.webp"
import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { STATUS_DESCRIPTIONS, getCategory, getDetails } from "../js/statusCatalogueUtils.jsx"
import { humanize } from "../js/utils.js"
import { useTranslate } from "../hooks/useTranslate.jsx"
import "../css/infos.scss"
import "../css/infos_status.scss"

export default function StatusCatalogueCard({ status }) {
    const t = useTranslate()
    const category = getCategory(status)
    const sprite = statusSprites[status.name] ?? statusSprites[status.name.replace("critical_resistance", "critical_resist")]
    const description = STATUS_DESCRIPTIONS[status.name]
        ?? `Special status effect (${humanize(status.effectType ?? "effect")}). Check its stored effect data for the exact behaviour.`
    const details = getDetails(status)
    const categoryClass = `status-category-${category.toLowerCase().replaceAll(" ", "-")}`
    const categoryIcon = category.toLowerCase().endsWith("debuff")
        ? ExpandSrc
        : category.toLowerCase().endsWith("buff")
            ? CollapseSrc
            : null

    return (
        <CatalogueEntryCard className="status-catalogue-card" dataCategory={category.toLowerCase()} icon={sprite}>
            <header className="catalogue-entry-heading status-catalogue-heading">
                <h3 className="catalogue-entry-name text-big status-catalogue-name">{humanize(status.name)}</h3>
            </header>
            <div className="status-polarity-row" aria-label={t("app.shared.statusProperties")}>
                <span className={`catalogue-chip text status-catalogue-category ${categoryClass}`}>
                    {categoryIcon && <img className="status-polarity-icon" src={categoryIcon} alt="" />}
                    {category}
                </span>
                <span className={`catalogue-chip text status-polarity ${status.mitigatable === false ? "status-polarity-negative" : "status-polarity-positive"}`} title={status.mitigatable === false ? t("app.shared.notMitigatable") : t("app.shared.mitigatable")}>
                    <img className={`status-polarity-icon${status.mitigatable === false ? " is-negative" : ""}`} src={status.mitigatable === false ? CrossSprite : CheckmarkSprite} alt={status.mitigatable === false ? t("app.shared.no") : t("app.shared.yes")} />
                    <span>{t("app.shared.mitigatable")}</span>
                </span>
                <span className={`catalogue-chip text status-polarity ${status.removable === false ? "status-polarity-negative" : "status-polarity-positive"}`} title={status.removable === false ? t("app.shared.notRemovable") : t("app.shared.removable")}>
                    <img className={`status-polarity-icon${status.removable === false ? " is-negative" : ""}`} src={status.removable === false ? CrossSprite : CheckmarkSprite} alt={status.removable === false ? t("app.shared.no") : t("app.shared.yes")} />
                    <span>{t("app.shared.removable")}</span>
                </span>
            </div>
            <p className="status-catalogue-description text">{description}</p>
            {details.length > 0 && (
                <ul className="status-catalogue-details">
                    {details.map(detail => <li className="text" key={detail}>{detail}</li>)}
                </ul>
            )}
        </CatalogueEntryCard>
    )
}
