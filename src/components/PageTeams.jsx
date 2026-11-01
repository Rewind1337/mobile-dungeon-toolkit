import { useEffect, useState } from "react"
import HeroList from "./HeroList.jsx"
import Hero from "./Hero.jsx"
import EmptyHero from "./EmptyHero.jsx"
import Button from "./Button.jsx"
import Modal from "./Modal.jsx"
import { ATTRIBUTE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, STATUS_EFFECT_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { attributeSprites, heroSprites, itemSprites, statusSprites } from "../database/db_sprites.jsx"
import { useDynamicList } from "../hooks/useDynamicList.jsx"
import { getStatusPolarity } from "../js/statusPolarity.jsx"
import { createTeamShareToken, decodeTeamShareInput, restoreSharedTeam } from "../utils/heroShare.js"
import { createSavedItemRecord } from "../js/ids.jsx"

const createDefaultTeams = () => [
    { id: 0, name: "Default Team", heroes: Array(5).fill(null) },
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

const TEAM_EQUIPMENT_SLOTS = [
    EQUIPMENT_SLOT_DEFINITIONS.WEAPON,
    EQUIPMENT_SLOT_DEFINITIONS.HELMET,
    EQUIPMENT_SLOT_DEFINITIONS.ARMOR,
    EQUIPMENT_SLOT_DEFINITIONS.RING,
    EQUIPMENT_SLOT_DEFINITIONS.NECKLACE,
    EQUIPMENT_SLOT_DEFINITIONS.OTHER,
]

function getHeroStatusEffects(hero) {
    if (!hero) return []
    const skillEffects = (Array.isArray(hero.skills) ? hero.skills : []).map(skill => skill?.effect)
    const talentEffects = Object.values(hero.talents && typeof hero.talents === "object" ? hero.talents : {})
        .map(talent => talent?.effect)
    const skillText = JSON.stringify([skillEffects, talentEffects]).toLowerCase()
    return Object.keys(STATUS_EFFECT_DEFINITIONS).filter(name => skillText.includes(name.toLowerCase()))
}

export function TeamOverview({ team, savedHeroes }) {
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
    const statusEffects = [...new Set(teamHeroes.flatMap(getHeroStatusEffects))]
        .map(name => ({ name, polarity: getStatusPolarity(STATUS_EFFECT_DEFINITIONS[name]) }))
        .sort((a, b) => a.name.localeCompare(b.name))
    const groupedStatusEffects = {
        buffs: statusEffects.filter(effect => effect.polarity === "buff"),
        debuffs: statusEffects.filter(effect => effect.polarity === "debuff"),
        special: statusEffects.filter(effect => effect.polarity === "special"),
    }

    const renderStatusChips = effects => effects.map(({ name, polarity }) => (
        <span className={`catalogue-chip text team-overview-chip team-status-chip team-status-chip--${polarity}`} key={name}>
            {statusSprites[name] && <img className="catalogue-chip-icon team-status-icon" src={statusSprites[name]} alt="" />}
            {humanize(name)}
        </span>
    ))

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
                            Slot {index + 1} · {name}
                        </span>
                    ))}
                    {attributes.length === 0 && <span className="text team-overview-empty">No heroes assigned yet.</span>}
                </div>
            </section>
            <section className="team-info-section">
                <h3 className="team-info-heading header">Status Effects</h3>
                {statusEffects.length === 0
                    ? <span className="text team-overview-empty">No status effects detected.</span>
                    : <>
                        {groupedStatusEffects.buffs.length > 0 && <div className="team-status-group">
                            <h4 className="team-status-group-heading text">Buffs</h4>
                            <div className="team-info-chips">{renderStatusChips(groupedStatusEffects.buffs)}</div>
                        </div>}
                        {groupedStatusEffects.debuffs.length > 0 && <div className="team-status-group">
                            <h4 className="team-status-group-heading text">Debuffs</h4>
                            <div className="team-info-chips">{renderStatusChips(groupedStatusEffects.debuffs)}</div>
                        </div>}
                        {groupedStatusEffects.special.length > 0 && <div className="team-status-group">
                            <h4 className="team-status-group-heading text">Other / unclassified</h4>
                            <div className="team-info-chips">{renderStatusChips(groupedStatusEffects.special)}</div>
                        </div>}
                    </>
                }
            </section>
        </div>
    )
}

const TEAM_BASE_STATS = [
    ["health", "HP", "Health"],
    ["attack", "ATK", "Attack"],
    ["defence", "DEF", "Defence"],
    ["agility", "AGI", "Agility"],
]

export function TeamHeroStats({ hero, slotIndex }) {
    if (!hero) return null
    return (
        <div className="team-base-stat-summary" aria-label={hero.name + " base stats"}>
            {TEAM_BASE_STATS.map(([key, label, fullLabel]) => {
                const value = hero.stats?.[key]
                const displayValue = Number.isFinite(Number(value)) ? Number(value).toLocaleString() : "—"
                return (
                    <span className="team-base-stat" key={key} title={hero.name + " · " + fullLabel}>
                        <strong>{label}</strong><span>{displayValue}</span>
                    </span>
                )
            })}
        </div>
    )
}

function PageTeams({ heroesRef, itemsRef, savedHeroesRef, savedTeamsRef, savedItemsRef, manualSaveFunction }) {
    const { listHeight, listRef, events } = useDynamicList(165, true)
    const savedHeroes = Array.isArray(savedHeroesRef.current) ? savedHeroesRef.current : []
    const [teams, setTeams] = useState(() => normalizeTeams(savedTeamsRef.current))
    const [collapsedTeamIds, setCollapsedTeamIds] = useState(() => new Set())
    const [slotPicker, setSlotPicker] = useState(null)
    const [selectedSaveId, setSelectedSaveId] = useState(null)
    const [exportTeam, setExportTeam] = useState(null)
    const [exportItemsOnHeroes, setExportItemsOnHeroes] = useState(false)
    const [teamShareUrl, setTeamShareUrl] = useState("")
    const [teamShareLinkCopied, setTeamShareLinkCopied] = useState(false)
    const [importTeamModalVisible, setImportTeamModalVisible] = useState(false)
    const [teamImportInput, setTeamImportInput] = useState("")

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
    const renameTeam = (teamId, name) => commitTeams(teams.map(team => team.id === teamId ? { ...team, name } : team))
    const toggleTeamCollapsed = teamId => setCollapsedTeamIds(current => {
        const next = new Set(current)
        if (next.has(teamId)) next.delete(teamId)
        else next.add(teamId)
        return next
    })
    const deleteTeam = teamId => {
        commitTeams(teams.filter(team => team.id !== teamId))
        setCollapsedTeamIds(current => {
            const next = new Set(current)
            next.delete(teamId)
            return next
        })
    }
    const createTeam = () => {
        const id = teams.reduce((max, team) => Math.max(max, team.id), -1) + 1
        commitTeams([...teams, { id, name: `Team ${id + 1}`, heroes: Array(5).fill(null) }])
    }
    const duplicateTeam = teamId => {
        const source = teams.find(team => team.id === teamId)
        if (!source) return

        const id = teams.reduce((max, team) => Math.max(max, team.id), -1) + 1
        const baseName = `${source.name} (Copy)`
        let name = baseName
        let copyNumber = 2
        while (teams.some(team => team.name.toLowerCase() === name.toLowerCase())) {
            name = `${source.name} (Copy ${copyNumber})`
            copyNumber += 1
        }

        const sourceIndex = teams.findIndex(team => team.id === teamId)
        const duplicate = { ...source, id, name, heroes: [...source.heroes] }
        commitTeams([...teams.slice(0, sourceIndex + 1), duplicate, ...teams.slice(sourceIndex + 1)])
    }

    const buildTeamShareUrl = (team, includeItems) => {
        const baseUrl = import.meta.env.BASE_URL
        const basePath = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const url = new URL(`${basePath}teams/`, window.location.origin)
        url.searchParams.set("team", createTeamShareToken(team, savedHeroes, { includeItems }))
        return url.toString()
    }

    const openExportTeam = team => {
        try {
            setExportTeam(team)
            setExportItemsOnHeroes(false)
            setTeamShareLinkCopied(false)
            setTeamShareUrl(buildTeamShareUrl(team, false))
        } catch (error) {
            window.alert(error.message || "Could not export this team.")
        }
    }

    const handleExportItemsToggle = event => {
        const includeItems = event.target.checked
        setExportItemsOnHeroes(includeItems)
        setTeamShareLinkCopied(false)
        if (!exportTeam) return
        try {
            setTeamShareUrl(buildTeamShareUrl(exportTeam, includeItems))
        } catch (error) {
            setExportItemsOnHeroes(false)
            window.alert(error.message || "Could not export this team's heroes.")
        }
    }

    const handleCopyTeamLink = async () => {
        if (!teamShareUrl) return
        try {
            await navigator.clipboard.writeText(teamShareUrl)
            setTeamShareLinkCopied(true)
        } catch {
            window.alert("Copying was blocked by your browser. Select and copy the link manually.")
        }
    }

    const importTeamFromToken = token => {
        const payload = decodeTeamShareInput(token)
        const restoredTeam = restoreSharedTeam(payload, heroesRef.current, itemsRef.current.BASE_ITEMS)
        const nextSavedHeroes = [...(savedHeroesRef.current ?? [])]
        const nextSavedItems = { ...(savedItemsRef?.current ?? {}) }
        const slotIndexToNameMap = { 0: "WEAPONS", 1: "HELMETS", 2: "ARMORS", 3: "NECKLACES", 4: "RINGS", 5: "OTHER" }
        for (const slotName of Object.values(slotIndexToNameMap)) {
            nextSavedItems[slotName] = Array.isArray(nextSavedItems[slotName]) ? [...nextSavedItems[slotName]] : []
        }

        let nextSaveId = Math.max(-1, ...nextSavedHeroes.map(hero => Number(hero.saveId)).filter(Number.isFinite))
        const savedHeroIds = restoredTeam.heroes.map(hero => {
            if (!hero) return null
            nextSaveId += 1
            const importedItems = Array.from({ length: 6 }, (_, slotIndex) => {
                const item = hero.items?.[slotIndex]
                if (!item) return null
                const slotArray = slotIndexToNameMap[Number(item.slot ?? slotIndex)]
                if (!slotArray) return item
                const savedItem = createSavedItemRecord(item)
                nextSavedItems[slotArray] = [...nextSavedItems[slotArray], savedItem]
                return savedItem
            })
            nextSavedHeroes.push({ ...hero, saveId: nextSaveId, items: importedItems })
            return nextSaveId
        })

        savedHeroesRef.current = nextSavedHeroes
        if (savedItemsRef) savedItemsRef.current = nextSavedItems

        const id = teams.reduce((max, team) => Math.max(max, team.id), -1) + 1
        let name = "Imported Team"
        let copyNumber = 2
        while (teams.some(team => team.name.toLowerCase() === name.toLowerCase())) {
            name = "Imported Team (" + copyNumber + ")"
            copyNumber += 1
        }
        commitTeams([...teams, { id, name, heroes: savedHeroIds }])
    }
    const handleImportTeam = (input = teamImportInput) => {
        if (!String(input ?? "").trim()) return
        try {
            importTeamFromToken(input)
            setImportTeamModalVisible(false)
            setTeamImportInput("")
        } catch (error) {
            window.alert(error.message || "Could not import this team.")
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("team")
        if (!token) return
        handleImportTeam(token)
        params.delete("team")
        const query = params.toString()
        const cleanUrl = window.location.pathname + (query ? `?${query}` : "") + window.location.hash
        window.history.replaceState({}, "", cleanUrl)
    // This effect intentionally handles a team share token only once on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const modalHeroes = savedHeroes

    return (
        <>
            <div className="sub-nav-bar flex-row">
                <div className="pagination flex-row card w-100">
                    <Button text="Saved Teams" color={2} />
                    <Button text="Recommended Teams" color={5} disabled />
                    <Button text="Import Team" color={5} onClick={() => setImportTeamModalVisible(true)} />
                </div>
                <div className="options flex-row card">
                    <Button text="Manual Save" color={5} onClick={manualSaveFunction} />
                </div>
            </div>

            <main id="page-teams" className="page flex-col w-100">
                <section ref={listRef} {...events} className="teams-list card flex-col" style={{ maxHeight: listHeight }}>
                    <header className="header-big">Saved Teams</header>
                    {teams.length === 0 && <p className="text">No teams yet. Create one to get started.</p>}
                    {teams.map(team => (
                        <article className={"team card flex-col" + (collapsedTeamIds.has(team.id) ? " is-collapsed" : "")} key={team.id}>
                            <header className={"team-header" + (collapsedTeamIds.has(team.id) ? " is-collapsed" : "")}>
                                <Button
                                    className="team-collapse-button"
                                    text={collapsedTeamIds.has(team.id) ? "Expand" : "Collapse"}
                                    title={collapsedTeamIds.has(team.id) ? "Expand team details" : "Collapse team details"}
                                    color={5}
                                    onClick={() => toggleTeamCollapsed(team.id)}
                                />
                                <h2 className="team-name-heading header-big">
                                    {collapsedTeamIds.has(team.id) ? (
                                        <span className="team-name-display">{team.name}</span>
                                    ) : (
                                        <input
                                            className="team-name-input"
                                            type="text"
                                            aria-label={`Team name for ${team.name}`}
                                            value={team.name}
                                            onChange={event => renameTeam(team.id, event.target.value)}
                                            onBlur={() => {
                                                if (!team.name.trim()) {
                                                    const teamIndex = teams.findIndex(entry => entry.id === team.id)
                                                    renameTeam(team.id, `Team ${teamIndex + 1}`)
                                                }
                                            }}
                                        />
                                    )}
                                </h2>
                                {collapsedTeamIds.has(team.id) && (
                                    <div className="team-collapsed-heroes" aria-label={team.name + " heroes"}>
                                        {team.heroes.map((saveId, slotIndex) => {
                                            const hero = savedHeroes.find(savedHero => savedHero.saveId === saveId)
                                            if (!hero) return null
                                            return (
                                                <span className="catalogue-chip text team-collapsed-hero-chip"
                                                    key={team.id + "-collapsed-hero-" + slotIndex}
                                                    title={hero.name + " · Slot " + (slotIndex + 1)}>
                                                    <img className="catalogue-chip-icon"
                                                        src={hero.heroSrc ?? heroSprites[hero.id] ?? heroSprites["null"]}
                                                        alt="" loading="lazy" decoding="async" draggable={false} />
                                                    <span>{hero.name}</span>
                                                </span>
                                            )
                                        })}
                                    </div>
                                )}
                                {!collapsedTeamIds.has(team.id) && (
                                    <div className="team-actions">
                                        <Button text="Clear Team" color={4} onClick={() => clearTeam(team.id)} />
                                        <Button text="Duplicate" color={5} onClick={() => duplicateTeam(team.id)} />
                                        <Button text="Export Team" color={0} onClick={() => openExportTeam(team)} />
                                        <Button text="Delete Team" color="cancel" onClick={() => deleteTeam(team.id)} />
                                    </div>
                                )}
                            </header>
                            {!collapsedTeamIds.has(team.id) && (
                            <div className="team-content">
                                <div className="team-heroes-column">
                                    <div className="team-hero-slots" aria-label={`${team.name} hero slots`}>
                                        {team.heroes.map((saveId, slotIndex) => {
                                            const hero = savedHeroes.find(savedHero => savedHero.saveId === saveId)
                                            const equippedItems = TEAM_EQUIPMENT_SLOTS.map(slot => ({
                                                slot,
                                                item: Array.isArray(hero?.items) ? hero.items[slot.id] ?? null : null,
                                            }))
                                            return (
                                                <div className="team-hero-slot card card-static" key={`${team.id}-slot-${slotIndex}`}>
                                                    <span className="team-slot-label text">Slot {slotIndex + 1}</span>
                                                    {hero
                                                        ? <>
                                                            <Hero heroObj={hero} selected={false} level={hero.level ?? null} onClick={() => openSlotPicker(team, slotIndex)} />
                                                            <div
                                                                    className="catalogue-chip team-equipped-items"
                                                                    aria-label={hero.name + "'s equipped items"}
                                                                    title={hero.name + "'s equipped items"}
                                                                >
                                                                    <div className="team-equipped-item-grid">
                                                                        {equippedItems.map(({ slot, item }) => (
                                                                            <span
                                                                                className={"team-equipped-item" + (item ? "" : " is-empty")}
                                                                                key={slot.id}
                                                                                title={item?.name ?? humanize(slot.name)}
                                                                            >
                                                                                <img
                                                                                    className="team-equipped-item-icon"
                                                                                    src={item?.itemSrc || item?.iconSrc || itemSprites["null"]}
                                                                                    alt=""
                                                                                    loading="lazy"
                                                                                    decoding="async"
                                                                                    draggable={false}
                                                                                />
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                            </div>
                                                            <TeamHeroStats hero={hero} slotIndex={slotIndex} />
                                                        </>
                                                        : <EmptyHero onClick={() => openSlotPicker(team, slotIndex)} />
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <TeamOverview team={team} savedHeroes={savedHeroes} />
                            </div>
                            )}
                        </article>
                    ))}
                    <div className="team team-new card flex-row">
                        <Button text="Create New Team" color="confirm" onClick={createTeam} />
                    </div>
                </section>
            </main>

            <Modal
                isVisible={Boolean(exportTeam)}
                position="center"
                onClose={() => { setExportTeam(null); setTeamShareUrl(""); setTeamShareLinkCopied(false) }}
            >
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">Export Team</div>
                    <label className="flex-row text margin-auto export-items-checkbox-label">
                        <input type="checkbox" checked={exportItemsOnHeroes} onChange={handleExportItemsToggle} />
                        <span className="header">Include equipped items on heroes</span>
                    </label>
                    <p className="text margin-auto">Share this link to import the team and its saved heroes.</p>
                    <textarea rows={3} value={teamShareUrl} readOnly onFocus={event => event.target.select()} aria-label="Team share link" />
                    <div className="flex-row">
                        <Button className="w-25" text={teamShareLinkCopied ? "Team Link Copied!" : "Copy Team Link"} color="confirm" onClick={handleCopyTeamLink} />
                        <Button className="w-25" text="Close" color="cancel" onClick={() => { setExportTeam(null); setTeamShareUrl(""); setTeamShareLinkCopied(false) }} />
                    </div>
                </div>
            </Modal>
            <Modal
                isVisible={importTeamModalVisible}
                position="center"
                onClose={() => { setImportTeamModalVisible(false); setTeamImportInput("") }}
            >
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">Import Team</div>
                    <p className="text margin-auto">Paste a team share link or its encoded data.</p>
                    <textarea rows={3} value={teamImportInput} onChange={event => setTeamImportInput(event.target.value)}
                        placeholder="https://…/teams/?team=…" aria-label="Team share link" />
                    <div className="flex-row">
                        <Button className="w-25" text="Import Team" color="confirm" onClick={() => handleImportTeam()} />
                        <Button className="w-25" text="Cancel" color="cancel" onClick={() => { setImportTeamModalVisible(false); setTeamImportInput("") }} />
                    </div>
                </div>
            </Modal>
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
                        <Button text="Confirm" color="confirm" disabled={selectedSaveId === null} onClick={confirmSlotSelection} />
                    </footer>
                </section>
            </Modal>
        </>
    )
}

export default PageTeams
