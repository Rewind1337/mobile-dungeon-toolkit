import { useEffect, useState } from "react"
import { useTranslate } from "../hooks/useTranslate.jsx"
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"
import { EQUIPMENT_SLOT_DEFINITIONS } from "../database/enums.jsx"
import { itemSprites } from "../database/db_sprites.jsx"
import Hero from "./Hero.jsx"
import { TeamOverview, TeamHeroStats } from "./pages/PageTeams.jsx"

const EMPTY_TEAMS = []

const EQUIPMENT_SLOTS = [
    EQUIPMENT_SLOT_DEFINITIONS.WEAPON,
    EQUIPMENT_SLOT_DEFINITIONS.HELMET,
    EQUIPMENT_SLOT_DEFINITIONS.ARMOR,
    EQUIPMENT_SLOT_DEFINITIONS.RING,
    EQUIPMENT_SLOT_DEFINITIONS.NECKLACE,
    EQUIPMENT_SLOT_DEFINITIONS.OTHER,
]

function CombatTeamCard({ team, teams, selectedId, onTeamChange, savedHeroes, title }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    const teamHeroes = team.heroes.map(saveId => savedHeroes.find(hero => hero.saveId === saveId) ?? null)

    return (
        <section className="team card flex-col custom-combat-team">
            <header className="team-header custom-combat-team-header">
                <h2 className="header-big">{title}</h2>
                <label className="custom-combat-team-picker">
                    <span className="text">{t("app.shared.savedTeam")}</span>
                    <select  value={selectedId} onChange={event => onTeamChange(event.target.value)}>
                        {teams.map(entry => <option key={entry.id} value={String(entry.id)}>{entry.name}</option>)}
                    </select>
                </label>
            </header>
            <div className="team-content">
                <div className="team-heroes-column">
                    <div className="team-hero-slots" >
                        {teamHeroes.map((hero, slotIndex) => (
                            <div className="team-hero-slot card card-static" key={`${team.id}-combat-slot-${slotIndex}`}>
                                <span className="team-slot-label text">Slot {slotIndex + 1}</span>
                                {hero ? (
                                    <>
                                        <Hero heroObj={hero} selected={false} level={hero.level ?? null} onClick={() => {}} />
                                        <div className="catalogue-chip team-equipped-items" >
                                            <div className="team-equipped-item-grid">
                                                {EQUIPMENT_SLOTS.map(slot => {
                                                    const item = Array.isArray(hero.items) ? hero.items[slot.id] ?? null : null
                                                    return (
                                                        <span className={"team-equipped-item" + (item ? "" : " is-empty")}
                                                            key={slot.id} title={item ? tc("item", item.id, "name", item.name) : tc("equipmentSlot", slot.name, "name", slot.name)}>
                                                            <img className="team-equipped-item-icon"
                                                                src={item?.itemSrc || item?.iconSrc || itemSprites["null"]}
                                                                alt="" loading="lazy" decoding="async" draggable={false} />
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <TeamHeroStats hero={hero} />
                                    </>
                                ) : (
                                    <div className="custom-combat-empty-slot text">{t("app.shared.emptySlot")}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <TeamOverview team={team} savedHeroes={savedHeroes} />
            </div>
        </section>
    )
}

function SubPageCustomCombat({ savedHeroesRef, savedTeamsRef }) {
    const t = useTranslate()
    const savedHeroes = Array.isArray(savedHeroesRef.current) ? savedHeroesRef.current : []
    const teams = Array.isArray(savedTeamsRef.current) ? savedTeamsRef.current : EMPTY_TEAMS
    const firstTeamId = teams.length > 0 ? String(teams[0].id) : ""
    const [teamOneId, setTeamOneId] = useState(firstTeamId)
    const [teamTwoId, setTeamTwoId] = useState(firstTeamId)

    useEffect(() => {
        if (!teams.some(team => String(team.id) === teamOneId)) setTeamOneId(firstTeamId)
        if (!teams.some(team => String(team.id) === teamTwoId)) setTeamTwoId(firstTeamId)
    }, [teams, firstTeamId, teamOneId, teamTwoId])

    const teamOne = teams.find(team => String(team.id) === teamOneId) ?? null
    const teamTwo = teams.find(team => String(team.id) === teamTwoId) ?? null

    return (
        <main className="page flex-col w-100 card custom-combat-page">
            <header className="card custom-combat-heading">
                <h1 className="header-big">{t("app.pages.customCombat.title")}</h1>
                <p className="text">{t("app.pages.customCombat.description")}</p>
            </header>
            {teamOne && teamTwo ? (
                <div className="custom-combat-matchup">
                    <CombatTeamCard team={teamOne} teams={teams} selectedId={teamOneId} onTeamChange={setTeamOneId}
                        savedHeroes={savedHeroes} title={t("app.pages.customCombat.teamOne")} />
                    <div className="custom-combat-vs" aria-hidden="true">VS</div>
                    <CombatTeamCard team={teamTwo} teams={teams} selectedId={teamTwoId} onTeamChange={setTeamTwoId}
                        savedHeroes={savedHeroes} title={t("app.pages.customCombat.teamTwo")} />
                </div>
            ) : (
                <div className="card text">{t("app.pages.customCombat.createTeamPrompt")}</div>
            )}
        </main>
    )
}

export default SubPageCustomCombat
