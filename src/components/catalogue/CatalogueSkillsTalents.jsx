import { useMemo, useState } from "react"
import { useTranslate } from "../../hooks/useTranslate.jsx"
import { useContentTranslation } from "../../hooks/useContentTranslation.jsx"
import { matchesSearchQuery, useUrlSearch } from "../../js/search.jsx"
import CatalogueViewSwitch from "../CatalogueViewSwitch.jsx"
import CatalogueFilterActions from "../CatalogueFilterActions.jsx"
import SkillCatalogueCard from "../SkillCatalogueCard.jsx"
import TalentCatalogueCard from "../TalentCatalogueCard.jsx"
import { stringify, getTalentPosition } from "../../js/skillsTalentsUtils.jsx"

function CatalogueSkillsTalents({ heroes = [], initialView = "skills", onViewChange }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const [view, setView] = useState(initialView)
    const [search, setSearch, commitSearch] = useUrlSearch()
    const [filtersVisible, setFiltersVisible] = useState(true)
    const changeView = nextView => {
        setView(nextView)
        onViewChange?.(nextView)
    }
    const entries = useMemo(() => {
        if (view === "skills") {
            return heroes.flatMap(hero => (Array.isArray(hero.skills) ? hero.skills : []).map((skill, index) => ({
                hero, skill, skillIndex: index, key: hero.id + "-skill-" + index
            })))
        }
        const groupedTalents = new Map()
        heroes.forEach(hero => {
            Object.entries(hero.talents && typeof hero.talents === "object" ? hero.talents : {}).forEach(([id, talent]) => {
                // Group by name and effect, not position: talent positions can differ between heroes.
                const groupKey = JSON.stringify([talent?.name ?? "", talent?.effect ?? null])
                if (!groupedTalents.has(groupKey)) groupedTalents.set(groupKey, { talent, key: "talent-" + groupKey, sources: [] })
                groupedTalents.get(groupKey).sources.push({ hero, id })
            })
        })
        return [...groupedTalents.values()]
    }, [heroes, view])
    const filtered = entries.filter(entry => {
        const value = view === "skills" ? entry.skill : entry.talent
        const sourceText = view === "skills" ? tc("hero", entry.hero.id, "name", entry.hero.name) : entry.sources.map(({ hero, id }) => tc("hero", hero.id, "name", hero.name) + " " + getTalentPosition(id)).join(" ")
        const translatedContent = view === "skills"
            ? [tc("skill", `${entry.hero.id}:${entry.skillIndex}`, "name", entry.skill.name), tc("skill", `${entry.hero.id}:${entry.skillIndex}`, "description", entry.skill.description)]
            : entry.sources.flatMap(({ hero, id }) => [
                tc("talent", `${hero.id}:${id}`, "name", entry.talent.name),
                tc("talent", `${hero.id}:${id}`, "description", entry.talent.description),
            ])
        return matchesSearchQuery([sourceText, stringify(value), translatedContent, entry.id ?? ""], search)
    })
    return <section className="hero-catalogue">
        <CatalogueViewSwitch ariaLabel={t("app.pages.catalogues.skillsTabAriaLabel")} view={view} onViewChange={changeView} options={[
            { label: t("app.pages.catalogues.skillTab"), value: "skills" },
            { label: t("app.pages.catalogues.talentTab"), value: "talents" },
        ]} />
        <header className="catalogue-header"><div className="catalogue-heading-copy"><div className="catalogue-title header-big">{view === "skills" ? t("app.pages.catalogues.skillsTitle") : t("app.pages.catalogues.talentsTitle")}</div><p className="catalogue-description text">{view === "skills" ? t("app.pages.catalogues.skillsDescription") : t("app.pages.catalogues.talentsDescription")}</p><p className="catalogue-progress-note text">{t("app.pages.catalogues.skillsTalentsProgress")}</p></div></header>
        {filtersVisible ? (
            <div className="skills-talents-catalogue-filters card">
                <label className="catalogue-search"><span className="catalogue-control-label text">{t("app.pages.catalogues.searchCount", { resultCount: filtered.length, totalCount: entries.length })}</span><input className="selectable catalogue-input" value={search} onChange={event => setSearch(event.target.value)} onBlur={() => commitSearch(search)} placeholder={t("app.pages.catalogues.skillsTalentsPlaceholder")} /></label>
                <CatalogueFilterActions filtersVisible onHide={() => setFiltersVisible(false)} onClear={() => { setSearch(""); commitSearch(""); }} />
            </div>
        ) : <CatalogueFilterActions filtersVisible={false} onShow={() => setFiltersVisible(true)} />}
        {filtered.length === 0 ? <p className="catalogue-empty card">{view === "skills" ? t("app.pages.catalogues.noSkillsMatch") : t("app.pages.catalogues.noTalentsMatch")}</p> : <div className="hero-catalogue-grid">{filtered.map(entry => view === "skills" ? <SkillCatalogueCard key={entry.key} hero={entry.hero} skill={entry.skill} skillIndex={entry.skillIndex} /> : <TalentCatalogueCard key={entry.key} talent={entry.talent} sources={entry.sources} />)}</div>}
    </section>
}
export default CatalogueSkillsTalents
