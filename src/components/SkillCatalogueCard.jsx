import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { stringify } from "../js/skillsTalentsUtils.jsx"
import "../css/infos.scss"
import "../css/infos_heroes.scss"

export default function SkillCatalogueCard({ hero, skill, skillIndex }) {
    const skillType = ["Primary", "Secondary", "Ultimate"][skillIndex] ?? `Skill ${skillIndex + 1}`
    return <CatalogueEntryCard className="skill-catalogue-entry">
        <header className="skill-catalogue-heading">
            <h3 className="catalogue-entry-name text-big skill-catalogue-name">{skill.name || "Unnamed skill"}</h3>
            <div className="skill-catalogue-meta">
                <span className="catalogue-chip catalogue-chip-rarity text skill-catalogue-hero" data-rarity={hero.rarity}>{hero.name}</span>
                <span className="catalogue-chip text skill-catalogue-type">{skillType}</span>
                {skill.cooldown != null && <span className="catalogue-chip text skill-catalogue-cooldown">Cooldown: {skill.cooldown} Turns</span>}
            </div>
        </header>
        {skill.description && <p className="text skill-catalogue-description">{skill.description}</p>}
        {skill.effect != null && <details className="hero-catalogue-details"><summary className="text">Effect data</summary><pre className="hero-catalogue-code text">{stringify(skill.effect)}</pre></details>}
    </CatalogueEntryCard>
}
