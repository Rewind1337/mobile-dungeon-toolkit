import { statusSprites } from "../database/db_sprites.jsx"
import CheckmarkSprite from "../sprites/checkmark.webp"
import CrossSprite from "../sprites/cross.png"
import CollapseSrc from "../sprites/collapse.webp"
import ExpandSrc from "../sprites/expand.webp"
import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { STATUS_DESCRIPTIONS, getCategory } from "../js/statusCatalogueUtils.jsx"
import { humanize } from "../js/utils.js"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import "../css/infos.scss"
import "../css/infos_status.scss"

export default function StatusCatalogueCard({ status }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const category = getCategory(status)
    const sprite = statusSprites[status.name] ?? statusSprites[status.name.replace("critical_resistance", "critical_resist")]
    const statusName = tc("status", status.name, "name", humanize(status.name))
    const description = tc("status", status.name, "description", STATUS_DESCRIPTIONS[status.name]
        ?? `Special status effect (${humanize(status.effectType ?? "effect")}). Check its stored effect data for the exact behaviour.`)
    const details = [
        status.value !== undefined && `${t("app.shared.value")}: ${status.value}`,
        status.per_stack !== undefined && `${t("app.shared.perStack")}: ${status.per_stack}`,
        status.max_stacks !== undefined && `${t("app.shared.maxStacks")}: ${status.max_stacks}`,
        status.duration !== undefined && `${t("app.shared.duration")}: ${status.duration} turn(s)`,
        status.interval !== undefined && `${t("app.shared.tick")}: ${humanize(status.interval)}`,
        status.stat !== undefined && `${t("app.shared.stat")}: ${tc("primaryStat", String(status.stat).toUpperCase(), "name", humanize(status.stat))}`,
    ].filter(Boolean)
    const categoryLabel = category === "Buff" ? t("app.shared.buff")
        : category === "Debuff" ? t("app.shared.debuff")
            : category === "Special" ? t("app.shared.special")
                : category.startsWith("Special ") ? `${t("app.shared.special")} ${category.endsWith("Buff") ? t("app.shared.buff") : t("app.shared.debuff")}` : category
    const categoryClass = `status-category-${category.toLowerCase().replaceAll(" ", "-")}`
    const categoryIcon = category.toLowerCase().endsWith("debuff")
        ? ExpandSrc
        : category.toLowerCase().endsWith("buff")
            ? CollapseSrc
            : null

    return (
        <CatalogueEntryCard className="status-catalogue-card" dataCategory={category.toLowerCase()} icon={sprite}>
            <header className="catalogue-entry-heading status-catalogue-heading">
                <h3 className="catalogue-entry-name text-big status-catalogue-name">{statusName}</h3>
            </header>
            <div className="status-polarity-row" >
                <span className={`catalogue-chip text status-catalogue-category ${categoryClass}`}>
                    {categoryIcon && <img className="status-polarity-icon" src={categoryIcon} alt="" />}
                    {categoryLabel}
                </span>
                <span className={`catalogue-chip text status-polarity ${status.mitigatable === false ? "status-polarity-negative" : "status-polarity-positive"}`} title={status.mitigatable === false ? t("app.shared.notMitigatable_tooltip") : t("app.shared.mitigatable_tooltip")}>
                    <img className={`status-polarity-icon${status.mitigatable === false ? " is-negative" : ""}`} src={status.mitigatable === false ? CrossSprite : CheckmarkSprite} alt={status.mitigatable === false ? t("app.shared.no") : t("app.shared.yes")} />
                    <span>{t("app.shared.mitigatable_tooltip")}</span>
                </span>
                <span className={`catalogue-chip text status-polarity ${status.removable === false ? "status-polarity-negative" : "status-polarity-positive"}`} title={status.removable === false ? t("app.shared.notRemovable_tooltip") : t("app.shared.removable_tooltip")}>
                    <img className={`status-polarity-icon${status.removable === false ? " is-negative" : ""}`} src={status.removable === false ? CrossSprite : CheckmarkSprite} alt={status.removable === false ? t("app.shared.no") : t("app.shared.yes")} />
                    <span>{t("app.shared.removable_tooltip")}</span>
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
