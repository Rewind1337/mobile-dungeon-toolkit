import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { stringify } from "../js/skillsTalentsUtils.jsx"
import { useTranslate } from "../hooks/useTranslate.jsx"
import "../css/infos.scss"
import "../css/infos_heroes.scss"

export default function SkillCatalogueCard({ hero, skill, skillIndex, showHeroName = true, className = "" }) {
    const skillType = ["Primary", "Secondary", "Ultimate"][skillIndex] ?? `Skill ${skillIndex + 1}`
    return <CatalogueEntryCard className={`skill-catalogue-entry ${className}`.trim()}>
        <header className="skill-catalogue-heading">
            <h3 className="catalogue-entry-name text-big skill-catalogue-name">{skill.name || t("app.shared.unnamedSkill")}</h3>
            <div className="skill-catalogue-meta">
                {showHeroName && <span className="catalogue-chip catalogue-chip-rarity text skill-catalogue-hero" data-rarity={hero.rarity}>{hero.name}</span>}
                <span className="catalogue-chip text skill-catalogue-type">{skillType}</span>
                {skill.cooldown != null && <span className="catalogue-chip text skill-catalogue-cooldown">{t("app.shared.cooldownTurns", { count: skill.cooldown })}</span>}
            </div>
        </header>
        {skill.description && <p className="text skill-catalogue-description">{skill.description}</p>}
        {skill.effect != null && <details className="hero-catalogue-details"><summary className="text">{t("app.shared.effectData")}</summary><pre className="hero-catalogue-code text">{stringify(skill.effect)}</pre></details>}
    </CatalogueEntryCard>
}
