import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { getTalentPosition } from "../js/skillsTalentsUtils.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
import TalentEffect from "./TalentEffect.jsx"
import "../css/infos.scss"
import "../css/infos_heroes.scss"

export default function TalentCatalogueCard({
    talent,
    sources = [],
    showSourceHero = true,
    showSourcePosition = true,
    className = "",
    interactive = false,
    isActive = false,
    isLocked = false,
    isConflicted = false,
    onClick
}) {
    const sourceListVisible = sources.length > 0 && (showSourceHero || showSourcePosition)
    return <CatalogueEntryCard
        className={`talent-catalogue-entry ${className} ${interactive ? "is-interactive" : ""} ${isActive ? "is-active" : ""} ${isLocked ? "is-locked" : ""} ${isConflicted ? "is-conflicted" : ""}`.trim()}
        onClick={interactive && !isLocked ? onClick : undefined}
        disabled={interactive && isLocked}
    >
        <header className="catalogue-entry-heading talent-catalogue-heading">
            <h3 className="catalogue-entry-name text-big talent-catalogue-name">{talent.name || t("app.shared.unnamedTalent")}</h3>
        </header>
        {sourceListVisible && (
            <div className="talent-source-list" aria-label={t("app.shared.talentPositions")}>
                {sources.map(({ hero, id }) => <div className="talent-source-entry" key={(hero?.id ?? "hero") + "-" + id}>
                    {showSourceHero && <span className="catalogue-chip text talent-source-hero">{hero?.name}</span>}
                    {showSourcePosition && <span className="catalogue-chip text talent-source-position">{getTalentPosition(id)}</span>}
                </div>)}
            </div>
        )}
        {talent.effect != null && <TalentEffect effect={talent.effect} />}
    </CatalogueEntryCard>
}
