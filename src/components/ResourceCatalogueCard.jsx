import { elementSprites } from "../database/db_sprites.jsx"
import { ELEMENT_DEFINITIONS, RARITY_DEFINITIONS, RESOURCE_LOCATIONS } from "../database/enums.jsx"
import { humanize } from "../js/utils.js"
import { useTranslate } from "../hooks/useTranslate.jsx"
import "../css/infos.scss"
import "../css/infos_resources.scss"

function findDefinition(definitions, value) {
    const normalized = String(value ?? "").trim().toLowerCase()
    return Object.values(definitions).find(definition =>
        definition.name.toLowerCase() === normalized || String(definition.id) === normalized
    ) ?? null
}

function AdditionalInfoChip({ information }) {
    if (information == null) return null
    if (typeof information === "string") {
        return <span className="catalogue-chip text">{information}</span>
    }
    if (information.element != null) {
        const element = findDefinition(ELEMENT_DEFINITIONS, information.element)
        if (!element) return <span className="catalogue-chip text">{humanize(information.element)}</span>
        const name = element.name.toLowerCase()
        return (
            <span className={"catalogue-chip text catalogue-chip-element-outline catalogue-chip-element-" + name}>
                {elementSprites[element.id] && <img className="catalogue-chip-icon" src={elementSprites[element.id]} alt="" />}
                {humanize(element.name)}
            </span>
        )
    }
    if (information.rarity != null) {
        const rarity = findDefinition(RARITY_DEFINITIONS, information.rarity)
        if (!rarity) return <span className="catalogue-chip text">{humanize(information.rarity)}</span>
        return <span className="catalogue-chip catalogue-chip-rarity text" data-rarity={rarity.id}>{humanize(rarity.name)}</span>
    }
    if (information.text != null) return <span className="catalogue-chip text">{String(information.text)}</span>
    return null
}

function ResourceLocationRow({ label, locations = [] }) {
    if (!Array.isArray(locations) || locations.length === 0) return null
    return (
        <div className="resource-catalogue-location-row">
            <span className="resource-catalogue-location-label text">{label}</span>
            <div className="resource-catalogue-location-chips">
                {locations.map(location => (
                    <span className="catalogue-chip text" key={location}>
                        {RESOURCE_LOCATIONS[location] ?? location}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function ResourceCatalogueCard({ resource }) {
    const t = useTranslate()
    const additionalInformation = Array.isArray(resource.additionalInformation)
        ? resource.additionalInformation
        : []
    return (
        <article className="resource-catalogue-card card">
            <img className="resource-catalogue-icon" src={resource.spriteSrc} alt="" loading="lazy" decoding="async" draggable={false} />
            <div className="resource-catalogue-details">
                <div className="resource-catalogue-title-row">
                    <h2 className="resource-catalogue-name text-big">{resource.name}</h2>
                    {resource.isGem && (
                        <span className="catalogue-chip catalogue-chip-rarity resource-catalogue-rarity text" data-rarity={resource.rarity.id}>
                            {humanize(resource.rarity.name)}
                        </span>
                    )}
                </div>
                {additionalInformation.length > 0 && (
                    <div className="resource-catalogue-additional-info" aria-label={t("app.shared.additionalInformation")}>
                        {additionalInformation.map((information, index) => (
                            <AdditionalInfoChip information={information} key={index} />
                        ))}
                    </div>
                )}
                <p className="resource-catalogue-description text">{resource.description || t("app.shared.noDescriptionRecorded")}</p>
                <ResourceLocationRow label="Obtained from" locations={resource.sourceLocations} />
                <ResourceLocationRow label="Used for" locations={resource.useLocations} />
            </div>
        </article>
    )
}
