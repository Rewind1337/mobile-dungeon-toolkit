import { useEffect, useState } from "react"
import { EQUIPMENT_SLOT_DEFINITIONS } from "../database/enums.jsx"
import { itemSprites } from "../database/db_sprites.jsx"
import Hero from "./Hero.jsx"
import { TeamOverview, TeamHeroStats } from "./PageTeams.jsx"

const EQUIPMENT_SLOTS = [
    EQUIPMENT_SLOT_DEFINITIONS.WEAPON,
    EQUIPMENT_SLOT_DEFINITIONS.HELMET,
    EQUIPMENT_SLOT_DEFINITIONS.ARMOR,
    EQUIPMENT_SLOT_DEFINITIONS.RING,
    EQUIPMENT_SLOT_DEFINITIONS.NECKLACE,
    EQUIPMENT_SLOT_DEFINITIONS.OTHER,
]

function CombatTeamCard({ team, teams, selectedId, onTeamChange, savedHeroes, title }) {
    const teamHeroes = team.heroes.map(saveId => savedHeroes.find(hero => hero.saveId === saveId) ?? null)

    return (
        <section className="team card flex-col custom-combat-team">
            <header className="team-header custom-combat-team-header">
                <h2 className="header-big">{title}</h2>
                <label className="custom-combat-team-picker">
                    <span className="text">Saved Team</span>
                    <select aria-label={title + " selection"} value={selectedId} onChange={event => onTeamChange(event.target.value)}>
                        {teams.map(entry => <option key={entry.id} value={String(entry.id)}>{entry.name}</option>)}
                    </select>
                </label>
            </header>
            <div className="team-content">
                <div className="team-heroes-column">
                    <div className="team-hero-slots" aria-label={`${team.name} hero slots`}>
                        {teamHeroes.map((hero, slotIndex) => (
                            <div className="team-hero-slot card card-static" key={`${team.id}-combat-slot-${slotIndex}`}>
                                <span className="team-slot-label text">Slot {slotIndex + 1}</span>
                                {hero ? (
                                    <>
                                        <Hero heroObj={hero} selected={false} level={hero.level ?? null} onClick={() => {}} />
                                        <div className="catalogue-chip team-equipped-items" aria-label={`${hero.name}'s equipped items`}>
                                            <div className="team-equipped-item-grid">
                                                {EQUIPMENT_SLOTS.map(slot => {
                                                    const item = Array.isArray(hero.items) ? hero.items[slot.id] ?? null : null
                                                    return (
                                                        <span className={"team-equipped-item" + (item ? "" : " is-empty")}
                                                            key={slot.id} title={item?.name ?? slot.name}>
                                                            <img className="team-equipped-item-icon"
                                                                src={item?.itemSrc || item?.iconSrc || itemSprites["null"]}
                                                                alt="" loading="lazy" decoding="async" draggable={false} />
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <TeamHeroStats hero={hero} slotIndex={slotIndex} />
                                    </>
                                ) : (
                                    <div className="custom-combat-empty-slot text">Empty Slot</div>
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
    const savedHeroes = Array.isArray(savedHeroesRef.current) ? savedHeroesRef.current : []
    const teams = Array.isArray(savedTeamsRef.current) ? savedTeamsRef.current : []
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
                <h1 className="header-big">Custom Combat</h1>
                <p className="text">Choose the two saved teams that should face each other. The same team can be selected for both sides.</p>
            </header>
            {teamOne && teamTwo ? (
                <div className="custom-combat-matchup">
                    <CombatTeamCard team={teamOne} teams={teams} selectedId={teamOneId} onTeamChange={setTeamOneId}
                        savedHeroes={savedHeroes} title="Combat Team 1" />
                    <div className="custom-combat-vs" aria-hidden="true">VS</div>
                    <CombatTeamCard team={teamTwo} teams={teams} selectedId={teamTwoId} onTeamChange={setTeamTwoId}
                        savedHeroes={savedHeroes} title="Combat Team 2" />
                </div>
            ) : (
                <div className="card text">Create a saved team on the Teams page to use it in Custom Combat.</div>
            )}
        </main>
    )
}

export default SubPageCustomCombat
