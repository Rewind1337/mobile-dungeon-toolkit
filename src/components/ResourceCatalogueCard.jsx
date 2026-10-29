import "../css/other.scss"

export default function ResourceCatalogueCard({ resource }) {
    return (
        <article className="resource-catalogue-card card">
            <img className="resource-catalogue-icon" src={resource.spriteSrc} alt="" loading="lazy" decoding="async" draggable={false} />
            <div className="resource-catalogue-details">
                <div className="resource-catalogue-title-row">
                    <h2 className="resource-catalogue-name text-big">{resource.name}</h2>
                    {resource.isGem && (
                        <span className="catalogue-chip resource-catalogue-rarity text" data-rarity={resource.rarity.id}>
                            {resource.rarity.name.charAt(0)}{resource.rarity.name.slice(1).toLowerCase()}
                        </span>
                    )}
                </div>
                <p className="resource-catalogue-description text">{resource.description || "No description recorded."}</p>
            </div>
        </article>
    )
}
