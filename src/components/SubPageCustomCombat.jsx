import { useEffect, useMemo, useState } from "react"
import { EQUIPMENT_SLOT_DEFINITIONS } from "../database/enums.jsx"
import { itemSprites } from "../database/db_sprites.jsx"
import { heroSprites } from "../database/db_sprites.jsx"
import Hero from "./Hero.jsx"
import { TeamOverview } from "./PageTeams.jsx"

const EQUIPMENT_SLOTS = [
    EQUIPMENT_SLOT_DEFINITIONS.WEAPON,
    EQUIPMENT_SLOT_DEFINITIONS.HELMET,
    EQUIPMENT_SLOT_DEFINITIONS.ARMOR,
    EQUIPMENT_SLOT_DEFINITIONS.RING,
    EQUIPMENT_SLOT_DEFINITIONS.NECKLACE,
    EQUIPMENT_SLOT_DEFINITIONS.OTHER,
]

function CombatTeamCard({ team, savedHeroes, title }) {
    const teamHeroes = team.heroes.map(saveId => savedHeroes.find(hero => hero.saveId === saveId) ?? null)

    return (
        <section className="team card flex-col custom-combat-team">
            <header className="team-header custom-combat-team-header">
                <h2 className="header-big">{title}</h2>
                <span className="text custom-combat-team-name">{team.name}</span>
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

function TeamPicker({ label, teams, selectedId, onChange }) {
    return (
        <label className="custom-combat-team-picker card">
            <span className="header">{label}</span>
            <select value={selectedId} onChange={event => onChange(event.target.value)} disabled={teams.length === 0}>
                {teams.length === 0
                    ? <option value="">No saved teams available</option>
                    : teams.map(team => <option key={team.id} value={String(team.id)}>{team.name}</option>)}
            </select>
        </label>
    )
}

function SubPageCustomCombat({ savedHeroesRef, savedTeamsRef }) {
    const savedHeroes = Array.isArray(savedHeroesRef.current) ? savedHeroesRef.current : []
    const teams = useMemo(() => Array.isArray(savedTeamsRef.current) ? savedTeamsRef.current : [], [savedTeamsRef])
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
        <main className="page flex-col w-100 custom-combat-page">
            <header className="card custom-combat-heading">
                <h1 className="header-big">Custom Combat</h1>
                <p className="text">Choose the two saved teams that should face each other. The same team can be selected for both sides.</p>
            </header>
            <div className="custom-combat-pickers">
                <TeamPicker label="Combat Team 1" teams={teams} selectedId={teamOneId} onChange={setTeamOneId} />
                <div className="custom-combat-versus" aria-hidden="true">VS</div>
                <TeamPicker label="Combat Team 2" teams={teams} selectedId={teamTwoId} onChange={setTeamTwoId} />
            </div>
            {teamOne && teamTwo ? (
                <div className="custom-combat-matchup">
                    <CombatTeamCard team={teamOne} savedHeroes={savedHeroes} title="Combat Team 1" />
                    <div className="custom-combat-vs" aria-hidden="true">VS</div>
                    <CombatTeamCard team={teamTwo} savedHeroes={savedHeroes} title="Combat Team 2" />
                </div>
            ) : (
                <div className="card text">Create a saved team on the Teams page to use it in Custom Combat.</div>
            )}
        </main>
    )
}

export default SubPageCustomCombat
