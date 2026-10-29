import { useState } from "react"
import HeroList from "./HeroList.jsx"
import Hero from "./Hero.jsx"
import EmptyHero from "./EmptyHero.jsx"
import Button from "./Button.jsx"
import Modal from "./Modal.jsx"
import { ATTRIBUTE_DEFINITIONS, STATUS_EFFECT_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { attributeSprites, statusSprites } from "../database/db_sprites.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"

const createDefaultTeams = () => [
    { id: 0, name: "Default Team", heroes: Array(5).fill(null) },
    { id: 1, name: "Team A", heroes: Array(5).fill(null) },
    { id: 2, name: "Team B", heroes: Array(5).fill(null) },
]

const normalizeTeams = teams => Array.isArray(teams)
    ? teams.filter(team => team && typeof team === "object").map((team, index) => ({
        id: Number.isInteger(team.id) ? team.id : index,
        name: typeof team.name === "string" && team.name.trim() ? team.name : `Team ${index + 1}`,
        heroes: Array.from({ length: 5 }, (_, slot) => {
            const value = Array.isArray(team.heroes) ? team.heroes[slot] : null
            if (typeof value === "string" || typeof value === "number") return value
            return value?.saveId ?? null
        }),
    }))
    : createDefaultTeams()

const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

function getHeroStatusEffects(hero) {
    if (!hero) return []
    const skillEffects = (Array.isArray(hero.skills) ? hero.skills : []).map(skill => skill?.effect)
    const talentEffects = Object.values(hero.talents && typeof hero.talents === "object" ? hero.talents : {})
        .map(talent => talent?.effect)
    const skillText = JSON.stringify([skillEffects, talentEffects]).toLowerCase()
    return Object.keys(STATUS_EFFECT_DEFINITIONS).filter(name => skillText.includes(name.toLowerCase()))
}

function TeamOverview({ team, savedHeroes }) {
    const teamHeroes = team.heroes.map(saveId => savedHeroes.find(hero => hero.saveId === saveId) ?? null)
    const attributes = teamHeroes.flatMap((hero, index) => {
        if (!hero) return []
        const name = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? "Unknown"
        return [{
            hero,
            index,
            name: humanize(name),
            icon: attributeSprites[Number(hero.mainAttribute)],
        }]
    })
    const statusEffects = [...new Set(teamHeroes.flatMap(getHeroStatusEffects))].sort((a, b) => a.localeCompare(b))

    return (
        <div className="team-info-column">
            <section className="team-info-section">
                <h3 className="team-info-heading header">Attributes</h3>
                <div className="team-info-chips">
                    {attributes.map(({ hero, index, name, icon }) => (
                        <span
                            className={`catalogue-chip text team-overview-chip team-attribute-chip catalogue-chip-attribute-${name.toLowerCase()}`}
                            key={`attribute-${hero.saveId ?? hero.id}-${index}`}
                            title={`${hero.name} · Slot ${index + 1}`}
                        >
                            {typeof icon === "string"
                                ? <img className="catalogue-chip-icon" src={icon} alt="" />
                                : icon && <span className="catalogue-chip-icon team-attribute-icon" aria-hidden="true">{icon}</span>}
                            {name}
                        </span>
                    ))}
                    {attributes.length === 0 && <span className="text team-overview-empty">No heroes assigned yet.</span>}
                </div>
            </section>
            <section className="team-info-section">
                <h3 className="team-info-heading header">Status Effects</h3>
                <div className="team-info-chips">
                    {statusEffects.map(effect => (
                        <span className="catalogue-chip text team-overview-chip team-status-chip" key={effect}>
                            {statusSprites[effect] && <img className="catalogue-chip-icon team-status-icon" src={statusSprites[effect]} alt="" />}
                            {humanize(effect)}
                        </span>
                    ))}
                    {statusEffects.length === 0 && <span className="text team-overview-empty">No status effects detected.</span>}
                </div>
            </section>
        </div>
    )
}

function PageTeams({ savedHeroesRef, savedTeamsRef, manualSaveFunction }) {
    const { listHeight, listRef } = useDynamicList(165, true)
    const savedHeroes = Array.isArray(savedHeroesRef.current) ? savedHeroesRef.current : []
    const [teams, setTeams] = useState(() => normalizeTeams(savedTeamsRef.current))
    const [slotPicker, setSlotPicker] = useState(null)
    const [selectedSaveId, setSelectedSaveId] = useState(null)

    const selectedTeam = slotPicker ? teams.find(team => team.id === slotPicker.teamId) : null

    const commitTeams = nextTeams => {
        setTeams(nextTeams)
        savedTeamsRef.current = nextTeams
        manualSaveFunction()
    }

    const openSlotPicker = (team, slotIndex) => {
        setSlotPicker({ teamId: team.id, slotIndex })
        setSelectedSaveId(team.heroes[slotIndex] ?? null)
    }

    const confirmSlotSelection = () => {
        if (!slotPicker || selectedSaveId === null || !savedHeroes.some(hero => hero.saveId === selectedSaveId)) return
        commitTeams(teams.map(team => team.id !== slotPicker.teamId ? team : {
            ...team,
            heroes: team.heroes.map((saveId, index) => index === slotPicker.slotIndex ? selectedSaveId : saveId),
        }))
        setSlotPicker(null)
        setSelectedSaveId(null)
    }

    const clearTeam = teamId => commitTeams(teams.map(team => team.id === teamId ? { ...team, heroes: Array(5).fill(null) } : team))
    const deleteTeam = teamId => commitTeams(teams.filter(team => team.id !== teamId))
    const createTeam = () => {
        const id = teams.reduce((max, team) => Math.max(max, team.id), -1) + 1
        commitTeams([...teams, { id, name: `Team ${id + 1}`, heroes: Array(5).fill(null) }])
    }

    const modalHeroes = savedHeroes

    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <Button text="Your Teams" color={2} />
                </div>
                <div className="options flex-row card">
                    <Button text="Manual Save" color={5} onClick={manualSaveFunction} />
                </div>
            </div>

            <main id="page-teams" className="page flex-col w-100">
                <section ref={listRef} className="teams-list card flex-col" style={{ maxHeight: listHeight }}>
                    <header className="header-big">Your Teams</header>
                    {teams.length === 0 && <p className="text">No teams yet. Create one to get started.</p>}
                    {teams.map(team => (
                        <article className="team card flex-col" key={team.id}>
                            <header className="team-header">
                                <h2 className="header-big">{team.name}</h2>
                                <div className="team-actions">
                                    <Button text="Clear Team" autoHeight color={4} onClick={() => clearTeam(team.id)} />
                                    <Button text="Delete Team" autoHeight color={5} onClick={() => deleteTeam(team.id)} />
                                </div>
                            </header>
                            <div className="team-content">
                                <div className="team-heroes-column">
                                    <div className="team-hero-slots" aria-label={`${team.name} hero slots`}>
                                        {team.heroes.map((saveId, slotIndex) => {
                                            const hero = savedHeroes.find(savedHero => savedHero.saveId === saveId)
                                            return (
                                                <div className="team-hero-slot" key={`${team.id}-slot-${slotIndex}`}>
                                                    <span className="team-slot-label text">Slot {slotIndex + 1}</span>
                                                    {hero
                                                        ? <Hero heroObj={hero} selected={false} level={hero.level ?? null} onClick={() => openSlotPicker(team, slotIndex)} />
                                                        : <EmptyHero onClick={() => openSlotPicker(team, slotIndex)} />
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <TeamOverview team={team} savedHeroes={savedHeroes} />
                            </div>
                        </article>
                    ))}
                    <div className="team team-new card flex-row">
                        <Button text="Create New Team" autoHeight color={2} onClick={createTeam} />
                    </div>
                </section>
            </main>

            <Modal
                isVisible={Boolean(slotPicker)}
                position="center"
                onClose={() => { setSlotPicker(null); setSelectedSaveId(null) }}
            >
                <section className="team-hero-picker">
                    <header className="team-hero-picker-header">
                        <h2 className="header-big">Choose a Hero</h2>
                        <p className="text">
                            {selectedTeam
                                ? `${selectedTeam.name} · Slot ${(slotPicker?.slotIndex ?? 0) + 1}`
                                : "Choose a saved hero for this slot."}
                        </p>
                    </header>
                    {modalHeroes.length > 0 ? (
                        <HeroList
                            savedHeroes
                            headerText="Saved Heroes"
                            heroesRef={modalHeroes}
                            selectedHeroId={selectedSaveId}
                            setSelectedHeroId={setSelectedSaveId}
                        />
                    ) : (
                        <p className="text">You have no saved heroes yet. Save a hero first, then return here.</p>
                    )}
                    <footer className="team-hero-picker-footer">
                        <Button text="Cancel" color="cancel" onClick={() => { setSlotPicker(null); setSelectedSaveId(null) }} />
                        <Button text="Confirm" color={2} disabled={selectedSaveId === null} onClick={confirmSlotSelection} />
                    </footer>
                </section>
            </Modal>
        </>
    )
}

export default PageTeams
