import { useMemo, useState } from "react"
import Button from "./Button.jsx"
import { init_resource_db } from "../database/db_resources.jsx"
import { RARITY_DEFINITIONS } from "../database/enums.jsx"

const RESOURCE_DATA = init_resource_db()
const GEM_RESOURCE_IDS = new Set(["ruby", "sapphire", "emerald", "diamond"])
const GEM_BASES = RESOURCE_DATA.filter(resource => GEM_RESOURCE_IDS.has(resource.id))
const GEM_RARITIES = Object.values(RARITY_DEFINITIONS).sort((a, b) => a.id - b.id)
const GEM_VARIANTS = GEM_BASES.flatMap(gem => GEM_RARITIES.map(rarity => ({
    ...gem,
    id: `${gem.id}_${rarity.name.toLowerCase()}`,
    name: `${rarity.name.charAt(0)}${rarity.name.slice(1).toLowerCase()} ${gem.name}`,
    rarity,
    isGem: true,
    gemType: gem.name,
})))

function ResourceCard({ resource }) {
    return (
        <article className="resource-catalogue-card card">
            <img className="resource-catalogue-icon" src={resource.spriteSrc} alt="" loading="lazy" decoding="async" draggable={false} />
            <div className="resource-catalogue-details">
                <div className="resource-catalogue-title-row">
                    <h2 className="resource-catalogue-name header">{resource.name}</h2>
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

function CatalogueResources({ initialView = "resources", onViewChange }) {
    const [search, setSearch] = useState("")
    const isGemsView = initialView === "gems"

    const sourceResources = useMemo(() => isGemsView
        ? GEM_VARIANTS
        : RESOURCE_DATA.filter(resource => !GEM_RESOURCE_IDS.has(resource.id)),
    [isGemsView])

    const filteredResources = useMemo(() => {
        const query = search.trim().toLowerCase()
        return sourceResources
            .filter(resource => !query || [resource.name, resource.description, resource.gemType, resource.rarity?.name]
                .filter(Boolean).join(" ").toLowerCase().includes(query))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    }, [sourceResources, search])

    const gemGroups = useMemo(() => GEM_BASES.map(gem => ({
        ...gem,
        variants: filteredResources.filter(resource => resource.gemType === gem.name).sort((a, b) => a.rarity.id - b.rarity.id),
    })).filter(group => group.variants.length > 0), [filteredResources])

    const clearSearch = () => setSearch("")

    return (
        <section className="resource-catalogue">
            <div className="catalogue-view-switch" aria-label="Resources catalogue sections">
                <Button
                    text="Resources"
                    color={5}
                    active={!isGemsView}
                    onClick={() => onViewChange?.("resources")}
                />
                <Button
                    text="Gems"
                    color={5}
                    active={isGemsView}
                    onClick={() => onViewChange?.("gems")}
                />
            </div>

            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <h1 className="catalogue-title header-big">{isGemsView ? "Gem Catalogue" : "Resource Catalogue"}</h1>
                    <p className="catalogue-description text">
                        {isGemsView
                            ? "Browse every defined rarity of each gem, grouped by gem type."
                            : "Browse defined resources. Search matches resource names and descriptions."}
                    </p>
                </div>
            </header>

            <div className="resource-catalogue-filters card">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">Search by name or description</span>
                    <input
                        className="selectable catalogue-input"
                        type="search"
                        aria-label={isGemsView ? "Search gems by name or rarity" : "Search resources by name or description"}
                        placeholder={isGemsView ? "Search gems..." : "Search resources..."}
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                    <span className="catalogue-result-count text">
                        Showing {filteredResources.length} of {sourceResources.length} {isGemsView ? "gems" : "resources"}
                    </span>
                </label>
                <div className="catalogue-filter-actions">
                    <Button text="Clear search" color={"cancel"} onClick={clearSearch} />
                </div>
            </div>

            {filteredResources.length === 0
                ? <p className="catalogue-empty card">No {isGemsView ? "gems" : "resources"} match that search.</p>
                : isGemsView
                    ? <div className="gem-catalogue-groups">
                        {gemGroups.map(group => (
                            <section className="gem-catalogue-group card" key={group.id}>
                                <header className="gem-catalogue-group-header">
                                    <img className="gem-catalogue-group-icon" src={group.spriteSrc} alt="" loading="lazy" decoding="async" draggable={false} />
                                    <h2 className="header">{group.name}</h2>
                                    <span className="catalogue-chip text">{group.variants.length} rarities</span>
                                </header>
                                <div className="resource-catalogue-grid gem-catalogue-grid">
                                    {group.variants.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                                </div>
                            </section>
                        ))}
                    </div>
                    : <div className="resource-catalogue-grid">
                        {filteredResources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                    </div>
            }
        </section>
    )
}

export default CatalogueResources
