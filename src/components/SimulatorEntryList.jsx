import { ELEMENT_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { elementSprites } from "../database/db_sprites.jsx"

const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

function formatMetadataValue(value) {
    if (value === null || value === undefined || value === "") return "—"
    if (Array.isArray(value)) return value.map(formatMetadataValue).join(", ")
    if (typeof value === "object") {
        return Object.entries(value).map(([key, entry]) => humanize(key) + ": " + formatMetadataValue(entry)).join(" · ")
    }
    return String(value)
}

export function SimulatorElementChips({ elementIds = [], size = "default" }) {
    if (!Array.isArray(elementIds) || elementIds.length === 0) return null
    return (
        <div className={"simulator-element-chips" + (size === "large" ? " is-large" : "")} aria-label={t("app.shared.elements")}>
            {elementIds.map(id => {
                const name = getEnumNameById(ELEMENT_DEFINITIONS, Number(id)) ?? "Unknown"
                const key = String(name).toLowerCase()
                return (
                    <span className={"catalogue-chip text catalogue-chip-element-" + key} key={id}>
                        {elementSprites[id] && <img className="catalogue-chip-icon" src={elementSprites[id]} alt="" />}
                        {humanize(name)}
                    </span>
                )
            })}
        </div>
    )
}

function SimulatorEntryList({ entries = [], entryLabel = "Entry", emptyMessage }) {
    if (!Array.isArray(entries) || entries.length === 0) {
        return <p className="text simulator-empty-data">{emptyMessage ?? ("No " + entryLabel.toLowerCase() + " entries have been defined yet.")}</p>
    }

    return (
        <div className="simulator-entry-list flex-col">
            {entries.map((entry, index) => (
                <article className="card simulator-data-entry" key={entry?.id ?? index}>
                    <div className="header">{entry?.name ?? (entryLabel + " " + (index + 1))}</div>
                    <pre className="text simulator-data-json">{JSON.stringify(entry, null, 2)}</pre>
                </article>
            ))}
        </div>
    )
}

export function SimulatorEntryDetails({
    entry,
    entryLabel = "Entry",
    title,
    elementIds = [],
    emptyMessage
}) {
    if (!entry) return null
    const metadata = Object.entries(entry).filter(([key]) => !["id", "stages", "element", "elementSrcArray", "elementIds", "name"].includes(key))
    return (
        <div className="simulator-entry-details flex-col">
            <div className="header-big">{title ?? entry.name ?? entryLabel}</div>
            <SimulatorElementChips elementIds={elementIds} />
            {metadata.length > 0 && (
                <dl className="simulator-entry-metadata">
                    {metadata.map(([key, value]) => (
                        <div className="simulator-entry-metadata-row" key={key}>
                            <dt className="text">{humanize(key)}</dt>
                            <dd className="text">{formatMetadataValue(value)}</dd>
                        </div>
                    ))}
                </dl>
            )}
            <div className="header">{t("app.pages.simulatorEntries.stages")}</div>
            <SimulatorEntryList entries={entry.stages} entryLabel="Stage" emptyMessage={emptyMessage} />
        </div>
    )
}

export default SimulatorEntryList
