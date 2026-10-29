import { useMemo, useState } from "react"
import { matchesSearchQuery, useUrlSearch } from "../js/search.jsx"
import { STATUS_EFFECT_DEFINITIONS } from "../database/enums.jsx"
import Button from "./Button.jsx"
import StatusCatalogueCard from "./StatusCatalogueCard.jsx"
import { STATUS_DESCRIPTIONS, humanize, getCategory } from "../js/statusCatalogueUtils.jsx"

function matchesStatusSearch(status, rawQuery) {
    // Polarity flags are handled as query predicates instead of searching their property names.
    const searchableStatus = { ...status }
    delete searchableStatus.mitigatable
    delete searchableStatus.removable
    const category = getCategory(status)
    const description = STATUS_DESCRIPTIONS[status.name] ?? humanize(status.effectType ?? "effect")
    const searchable = [status.name, humanize(status.name), category, description, status.effectType ?? "", JSON.stringify(searchableStatus)].join(" ")

    const matchesPolarityTerm = term => {
        // Missing flags are shown as positive in the catalogue UI.
        if (term === "mitigatable") return status.mitigatable !== false
        if (term === "removable") return status.removable !== false
        if (/^(?:not|non)[-\s]+mitigatable$/.test(term)) return status.mitigatable === false
        if (/^(?:not|non)[-\s]+removable$/.test(term)) return status.removable === false
        return undefined
    }

    // Keep ampersand-separated clauses independent while preserving the old
    // "mitigatable poison" / "not removable shield" style of combined queries.
    return String(rawQuery ?? "").toLowerCase().split("&").map(term => term.trim()).filter(Boolean).every(rawTerm => {
        // A leading ! applies to the whole clause, including polarity shortcuts.
        if (rawTerm.startsWith("!")) {
            return matchesSearchQuery(searchable, rawTerm, matchesPolarityTerm)
        }

        const wantsNotMitigatable = /\b(?:not|non)[-\s]+mitigatable\b/.test(rawTerm)
        const wantsNotRemovable = /\b(?:not|non)[-\s]+removable\b/.test(rawTerm)
        const wantsMitigatable = !wantsNotMitigatable && /\bmitigatable\b/.test(rawTerm)
        const wantsRemovable = !wantsNotRemovable && /\bremovable\b/.test(rawTerm)

        if (wantsNotMitigatable && status.mitigatable !== false) return false
        if (wantsMitigatable && status.mitigatable === false) return false
        if (wantsNotRemovable && status.removable !== false) return false
        if (wantsRemovable && status.removable === false) return false

        const remainingTerm = rawTerm
            .replace(/\b(?:not|non)[-\s]+mitigatable\b/g, " ")
            .replace(/\b(?:not|non)[-\s]+removable\b/g, " ")
            .replace(/\bmitigatable\b/g, " ")
            .replace(/\bremovable\b/g, " ")
            .replace(/\s+/g, " ")
            .trim()

        return matchesSearchQuery(searchable, remainingTerm, matchesPolarityTerm)
    })
}


function CatalogueStatus() {
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [categoryFilter, setCategoryFilter] = useState("all")

    const statuses = useMemo(() => Object.values(STATUS_EFFECT_DEFINITIONS)
        .slice()
        .sort((a, b) => a.id - b.id), [])

    const filteredStatuses = useMemo(() => {
        return statuses.filter(status => {
            const category = getCategory(status)
            return matchesStatusSearch(status, search)
                && (categoryFilter === "all"
                    || (categoryFilter === "special"
                        ? category.startsWith("Special")
                        : category.toLowerCase().endsWith(categoryFilter)))
        })
    }, [statuses, search, categoryFilter])

    return (
        <section className="status-catalogue">
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <div className="catalogue-title header-big">Status Effect Catalogue</div>
                    <p className="catalogue-description text">
                        A searchable reference for the status effects currently defined in the project, including their recorded mechanics.
                    </p>
                    <p className="catalogue-progress-note catalogue-progress-note text">
                        Some status-effect values and mechanics are not yet interpreted or verified correctly. Treat these details as provisional; the underlying values have not been changed.
                    </p>
                </div>
            </header>

            <div className="status-catalogue-filters card">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">Search status effects ({filteredStatuses.length} of {statuses.length} status effects)</span>
                    <input
                        className="selectable catalogue-input"
                        aria-label="Search status effects"
                        placeholder="Name, effect, stat, mechanic…"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        onBlur={() => commitSearch(search)}
                    />
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Category</span>
                    <select aria-label="Filter by status category" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
                        <option value="all">All categories</option>
                        <option value="buff">Buffs</option>
                        <option value="debuff">Debuffs</option>
                        <option value="special">Special effects (including inferred buffs/debuffs)</option>
                    </select>
                </label>
                <div className="catalogue-filter-actions">
                    <Button className="status-catalogue-clear" text="Clear filters" color={"cancel"} onClick={() => { setSearch(""); commitSearch(""); setCategoryFilter("all") }} />
                </div>
            </div>

            {filteredStatuses.length === 0
                ? <p className="catalogue-empty card">No status effects match these filters.</p>
                : <div className="status-catalogue-grid">
                    {filteredStatuses.map(status => <StatusCatalogueCard key={status.id} status={status} />)}
                </div>
            }
        </section>
    )
}

export default CatalogueStatus
