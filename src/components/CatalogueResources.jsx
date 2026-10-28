import { useMemo, useState } from "react"
import Button from "./Button.jsx"
import { init_resource_db } from "../database/db_resources.jsx"

const RESOURCE_DATA = init_resource_db()
const GEM_RESOURCE_IDS = new Set(["ruby", "sapphire", "emerald", "diamond"])

function ResourceCard({ resource }) {
    return (
        <article className="resource-catalogue-card card">
            <img className="resource-catalogue-icon" src={resource.spriteSrc} alt="" loading="lazy" decoding="async" draggable={false} />
            <div className="resource-catalogue-details">
                <h2 className="resource-catalogue-name header">{resource.name}</h2>
                <p className="resource-catalogue-description text">{resource.description || "No description recorded."}</p>
            </div>
        </article>
    )
}

function CatalogueResources({ initialView = "resources", onViewChange }) {
    const [search, setSearch] = useState("")
    const sourceResources = useMemo(() => initialView === "gems"
        ? RESOURCE_DATA.filter(resource => GEM_RESOURCE_IDS.has(resource.id))
        : RESOURCE_DATA,
    [initialView])

    const filteredResources = useMemo(() => {
        const query = search.trim().toLowerCase()
        return sourceResources
            .filter(resource => !query || [resource.name, resource.description].join(" ").toLowerCase().includes(query))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    }, [sourceResources, search])

    const isGemsView = initialView === "gems"

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
                            ? "Browse the gems currently defined in the resource database."
                            : "Browse all defined resources. Search matches both resource names and descriptions."}
                    </p>
                </div>
                <p className="catalogue-result-count text">
                    Showing {filteredResources.length} of {sourceResources.length} {isGemsView ? "gems" : "resources"}
                </p>
            </header>

            <div className="resource-catalogue-filters card">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">Search by name or description</span>
                    <input
                        className="selectable catalogue-input"
                        type="search"
                        aria-label="Search resources by name or description"
                        placeholder={isGemsView ? "Search gems..." : "Search resources..."}
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </label>
                <div className="catalogue-filter-actions">
                    <Button text="Clear search" color={"cancel"} onClick={() => setSearch("")} />
                </div>
            </div>

            {filteredResources.length === 0
                ? <p className="catalogue-empty card">No {isGemsView ? "gems" : "resources"} match that search.</p>
                : <div className="resource-catalogue-grid">
                    {filteredResources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                </div>
            }
        </section>
    )
}

export default CatalogueResources
