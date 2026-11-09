import { elementSprites } from "../database/db_sprites.jsx"
import { ELEMENT_DEFINITIONS, RARITY_DEFINITIONS, RESOURCE_LOCATIONS } from "../database/enums.jsx"
import { humanizeName } from "../js/utils.js"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import "../css/infos.scss"
import "../css/infos_resources.scss"

function findDefinition(definitions, value) {
    const normalized = String(value ?? "").trim().toLowerCase()
    return Object.values(definitions).find(definition =>
        definition.name.toLowerCase() === normalized || String(definition.id) === normalized
    ) ?? null
}

function AdditionalInfoChip({ information, tc, t }) {
    if (information == null) return null
    if (typeof information === "string") {
        return <span className="catalogue-chip text">{information === "Not Implemented" ? t("app.shared.notImplemented") : information}</span>
    }
    if (information.element != null) {
        const element = findDefinition(ELEMENT_DEFINITIONS, information.element)
        if (!element) return <span className="catalogue-chip text">{humanizeName(information.element)}</span>
        const name = element.name.toLowerCase()
        return (
            <span className={"catalogue-chip text catalogue-chip-element-outline catalogue-chip-element-" + name}>
                {elementSprites[element.id] && <img className="catalogue-chip-icon" src={elementSprites[element.id]} alt="" />}
                {tc("element", element.name, "name", humanizeName(element.name))}
            </span>
        )
    }
    if (information.rarity != null) {
        const rarity = findDefinition(RARITY_DEFINITIONS, information.rarity)
        if (!rarity) return <span className="catalogue-chip text">{humanizeName(information.rarity)}</span>
        return <span className="catalogue-chip catalogue-chip-rarity text" data-rarity={rarity.id}>{tc("rarity", rarity.name, "name", humanizeName(rarity.name))}</span>
    }
    if (information.text != null) return <span className="catalogue-chip text">{information.text === "Not Implemented" ? t("app.shared.notImplemented") : String(information.text)}</span>
    return null
}

function ResourceLocationRow({ label, locations = [], tc }) {
    if (!Array.isArray(locations) || locations.length === 0) return null
    return (
        <div className="resource-catalogue-location-row">
            <span className="resource-catalogue-location-label text">{label}</span>
            <div className="resource-catalogue-location-chips">
                {locations.map(location => (
                    <span className="catalogue-chip text" key={location}>
                        {tc("resourceLocation", location, "name", RESOURCE_LOCATIONS[location] ?? location)}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function ResourceCatalogueCard({ resource }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const contentType = resource.isGem ? "gem" : "resource"
    const resourceName = tc(contentType, resource.id, "name", resource.name)
    const resourceDescription = tc(contentType, resource.id, "description", resource.description)
    const additionalInformation = Array.isArray(resource.additionalInformation)
        ? resource.additionalInformation
        : []
    return (
        <article className="resource-catalogue-card card">
            <img className="resource-catalogue-icon" src={resource.spriteSrc} alt="" loading="lazy" decoding="async" draggable={false} />
            <div className="resource-catalogue-details">
                <div className="resource-catalogue-title-row">
                    <h2 className="resource-catalogue-name text-big">{resourceName}</h2>
                    {resource.isGem && (
                        <span className="catalogue-chip catalogue-chip-rarity resource-catalogue-rarity text" data-rarity={resource.rarity.id}>
                            {tc("rarity", resource.rarity.name, "name", humanizeName(resource.rarity.name))}
                        </span>
                    )}
                </div>
                {additionalInformation.length > 0 && (
                    <div className="resource-catalogue-additional-info" >
                        {additionalInformation.map((information, index) => (
                            <AdditionalInfoChip information={information} tc={tc} t={t} key={index} />
                        ))}
                    </div>
                )}
                <p className="resource-catalogue-description text">{resourceDescription || t("app.shared.noDescriptionRecorded")}</p>
                <ResourceLocationRow label={t("app.shared.obtainedFrom")} locations={resource.sourceLocations} tc={tc} />
                <ResourceLocationRow label={t("app.shared.usedFor")} locations={resource.useLocations} tc={tc} />
            </div>
        </article>
    )
}
