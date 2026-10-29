import { perkSprites } from "../database/db_sprites.jsx"
import { getPerkKey, getPerkLabel } from "../js/catalogueItemUtils.jsx"
import "../css/infos.scss"
import "../css/infos_items.scss"

export default function CataloguePerkList({ perks, label = "Perks" }) {
    const visiblePerks = (perks ?? []).filter(perk => {
        const key = getPerkKey(perk)
        return key && key !== "NOTHING"
    })

    return (
        <section className="catalogue-perks card">
            <div className="catalogue-section-label text">{label}</div>
            {visiblePerks.length === 0
                ? <p className="catalogue-muted">None recorded</p>
                : <ul className="catalogue-perk-list flex-row">
                    {visiblePerks.map((perk, index) => {
                        const key = getPerkKey(perk)
                        return (
                            <li className="catalogue-perk text" key={key + "-" + index} title={getPerkLabel(perk)}>
                                {perkSprites[key] && <img className="catalogue-perk-icon" src={perkSprites[key]} alt="" draggable={false} />}
                                <span className="catalogue-perk-name">{getPerkLabel(perk)}</span>
                            </li>
                        )
                    })}
                </ul>
            }
        </section>
    )
}
