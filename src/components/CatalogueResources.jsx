import { useMemo, useState } from "react"
import { matchesSearchQuery, useUrlSearch } from "../js/search.jsx"
import CatalogueFilterActions from "./CatalogueFilterActions.jsx"
import CatalogueViewSwitch from "./CatalogueViewSwitch.jsx"
import ResourceCatalogueCard from "./ResourceCatalogueCard.jsx"
import { init_resource_db } from "../database/db_resources.jsx"
import { RESOURCE_LOCATIONS } from "../database/enums.jsx"

const RESOURCE_DATA = init_resource_db()
const GEM_VARIANTS = RESOURCE_DATA.filter(resource => resource.isGem)
const GEM_BASES = [...new Map(GEM_VARIANTS.map(gem => [
    gem.gemType,
    { id: gem.gemType.toLowerCase(), name: gem.gemType, spriteSrc: gem.spriteSrc, gemType: gem.gemType }
])).values()]

function CatalogueResources({ initialView = "resources", onViewChange }) {
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [obtainedFromFilter, setObtainedFromFilter] = useState("all")
    const [usedForFilter, setUsedForFilter] = useState("all")
    const [filtersVisible, setFiltersVisible] = useState(true)
    const isGemsView = initialView === "gems"

    const sourceResources = useMemo(() => isGemsView
        ? GEM_VARIANTS
        : RESOURCE_DATA.filter(resource => !resource.isGem),
    [isGemsView])

    const filteredResources = useMemo(() => {
        return sourceResources
            .filter(resource => matchesSearchQuery([
                resource.name,
                resource.description,
                resource.gemType,
                resource.rarity?.name,
                ...(resource.sourceLocations ?? []),
                ...(resource.useLocations ?? []),
                ...(resource.additionalInformation ?? []).flatMap(information =>
                    Object.entries(information ?? {}).flatMap(([key, value]) => [key, value])
                )
            ], search))
            .filter(resource => {
                if (isGemsView) return true
                const matchesLocation = (locations, selected) => selected === "all" || (locations ?? []).some(location =>
                    location === selected || RESOURCE_LOCATIONS[location] === selected
                )
                return matchesLocation(resource.useLocations, usedForFilter)
                    && matchesLocation(resource.sourceLocations, obtainedFromFilter)
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    }, [sourceResources, search, isGemsView, obtainedFromFilter, usedForFilter])

    const gemGroups = useMemo(() => GEM_BASES.map(gem => ({
        ...gem,
        variants: filteredResources.filter(resource => resource.gemType === gem.gemType).sort((a, b) => a.rarity.id - b.rarity.id),
    })).filter(group => group.variants.length > 0), [filteredResources])

    const clearSearch = () => {
        setSearch("")
        commitSearch("")
        setObtainedFromFilter("all")
        setUsedForFilter("all")
    }

    return (
        <section className="resource-catalogue">
            <CatalogueViewSwitch ariaLabel="Resources catalogue sections" view={initialView} onViewChange={onViewChange} options={[
                { label: "Resource Catalogue", value: "resources" },
                { label: "Gem Catalogue", value: "gems" },
            ]} />

            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <h1 className="catalogue-title header-big">{isGemsView ? "Gem Catalogue" : "Resource Catalogue"}</h1>
                    <p className="catalogue-description text">
                        {isGemsView
                            ? "Browse every defined rarity of each gem, grouped by gem type."
                            : "Browse defined resources. Search matches resource names and descriptions."}
                    </p>
                    <p className="catalogue-progress-note text">This section is still in progress; entries and descriptions may be incomplete.</p>
                </div>
            </header>

            {filtersVisible ? (
                <div className={`resource-catalogue-filters card${!isGemsView ? " is-resource-view" : ""}`}>
                    <div className="resource-catalogue-search-group">
                        <label className="catalogue-search">
                            <span className="catalogue-control-label text">
                                Search by name or description (showing {filteredResources.length} of {sourceResources.length} {isGemsView ? "gems" : "resources"})
                            </span>
                            <input className="selectable catalogue-input" type="search" aria-label={isGemsView ? "Search gems by name or rarity" : "Search resources by name or description"} placeholder={isGemsView ? "Search gems..." : "Search resources..."} value={search} onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)} />
                        </label>
                    </div>
                    {!isGemsView && (
                        <>
                            <label className="catalogue-filter resource-location-filter">
                                <span className="catalogue-control-label text">Used for</span>
                                <select aria-label="Filter resources by use" value={usedForFilter} onChange={event => setUsedForFilter(event.target.value)}>
                                    <option value="all">All uses</option>
                                    {Object.entries(RESOURCE_LOCATIONS).map(([key, label]) => <option key={key} value={label}>{label}</option>)}
                                </select>
                            </label>
                            <label className="catalogue-filter resource-location-filter">
                                <span className="catalogue-control-label text">Obtained from</span>
                                <select aria-label="Filter resources by source" value={obtainedFromFilter} onChange={event => setObtainedFromFilter(event.target.value)}>
                                    <option value="all">All sources</option>
                                    {Object.entries(RESOURCE_LOCATIONS).map(([key, label]) => <option key={key} value={label}>{label}</option>)}
                                </select>
                            </label>
                        </>
                    )}
                    <CatalogueFilterActions filtersVisible onHide={() => setFiltersVisible(false)} onClear={clearSearch} />
                </div>
            ) : <CatalogueFilterActions filtersVisible={false} onShow={() => setFiltersVisible(true)} />}

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
                                    {group.variants.map(resource => <ResourceCatalogueCard key={resource.id} resource={resource} />)}
                                </div>
                            </section>
                        ))}
                    </div>
                    : <div className="resource-catalogue-grid">
                        {filteredResources.map(resource => <ResourceCatalogueCard key={resource.id} resource={resource} />)}
                    </div>
            }
        </section>
    )
}

export default CatalogueResources
