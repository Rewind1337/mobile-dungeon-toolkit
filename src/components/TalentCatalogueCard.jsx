import CatalogueEntryCard from "./CatalogueEntryCard.jsx"
import { getTalentPosition } from "../js/skillsTalentsUtils.jsx"
import TalentEffect from "./TalentEffect.jsx"
import "../css/infos.scss"
import "../css/infos_heroes.scss"

export default function TalentCatalogueCard({ talent, sources }) {
    return <CatalogueEntryCard className="talent-catalogue-entry">
        <header className="catalogue-entry-heading talent-catalogue-heading">
            <h3 className="catalogue-entry-name text-big talent-catalogue-name">{talent.name || "Unnamed talent"}</h3>
        </header>
        <div className="talent-source-list" aria-label="Heroes with this talent">
            {sources.map(({ hero, id }) => <div className="talent-source-entry" key={hero.id + "-" + id}>
                <span className="catalogue-chip text talent-source-hero">{hero.name}</span>
                <span className="catalogue-chip text talent-source-position">{getTalentPosition(id)}</span>
            </div>)}
        </div>
        {talent.effect != null && <TalentEffect effect={talent.effect} />}
    </CatalogueEntryCard>
}
