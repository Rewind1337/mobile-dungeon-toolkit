import { useEffect, useState } from "react"
import { useTranslate } from "../../hooks/useTranslate.jsx"
import { useContentTranslation } from "../../hooks/useContentTranslation.jsx"
import HeroList from "../HeroList.jsx"
import Hero from "../Hero.jsx"
import EmptyHero from "../EmptyHero.jsx"
import Button from "../Button.jsx"
import Modal from "../Modal.jsx"
import HelpButton from "../HelpButton.jsx"
import { TeamManagementGuide } from "../Guides.jsx"
import { ATTRIBUTE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, STATUS_EFFECT_DEFINITIONS, getEnumNameById } from "../../database/enums.jsx"
import { attributeSprites, heroSprites, itemSprites, statusSprites } from "../../database/db_sprites.jsx"
import { useDynamicList } from "../../hooks/useDynamicList.jsx"
import { getStatusPolarity } from "../../js/statusPolarity.jsx"
import { createTeamShareToken, decodeTeamShareInput, restoreSharedTeam } from "../../utils/heroShare.js"
import { calculateTeamStats } from "../../utils/calculatedStats.js"
import { createSavedItemRecord } from "../../js/ids.jsx"
import { formatNumber } from "../../js/utils.js"
import LockedSrc from "../../sprites/locked.webp"

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
    const t = useTranslate()
    const tc = useContentTranslation()
    const teamHeroes = team.heroes.map(saveId => savedHeroes.find(hero => hero.saveId === saveId) ?? null)
    const attributes = teamHeroes.flatMap((hero, index) => {
        if (!hero) return []
        const name = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(hero.mainAttribute)) ?? "Unknown"
        return [{
            hero,
            index,
            key: String(name).toLowerCase(),
            name: tc("attribute", String(name).toUpperCase(), "name", humanize(name)),
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
            {tc("status", name, "name", humanize(name))}
        </span>
    ))

    return (
        <div className="team-info-column">
            <section className="team-info-section">
                <h3 className="team-info-heading header">{t("app.shared.attributes")}</h3>
                <div className="team-info-chips">
                    {attributes.map(({ hero, index, name, key, icon }) => (
                        <span
                            className={`catalogue-chip text team-overview-chip team-attribute-chip catalogue-chip-attribute-${key}`}
                            key={`attribute-${hero.saveId ?? hero.id}-${index}`}
                            title={`${tc("hero", hero.id, "name", hero.name)} · ${t("app.shared.slot", { number: index + 1 })}`}
                        >
                            {typeof icon === "string"
                                ? <img className="catalogue-chip-icon" src={icon} alt="" />
                                : icon && <span className="catalogue-chip-icon team-attribute-icon" aria-hidden="true">{icon}</span>}
                            {t("app.shared.slot", { number: index + 1 })} · {name}
                        </span>
                    ))}
                    {attributes.length === 0 && <span className="text team-overview-empty">{t("app.shared.noHeroesAssigned")}</span>}
                </div>
            </section>
            <section className="team-info-section">
                <h3 className="team-info-heading header">{t("app.shared.statusEffects")}</h3>
                {statusEffects.length === 0
                    ? <span className="text team-overview-empty">{t("app.shared.noStatusEffectsDetected")}</span>
                    : <>
                        {groupedStatusEffects.buffs.length > 0 && <div className="team-status-group">
                            <h4 className="team-status-group-heading text">{t("app.shared.buffs")}</h4>
                            <div className="team-info-chips">{renderStatusChips(groupedStatusEffects.buffs)}</div>
                        </div>}
                        {groupedStatusEffects.debuffs.length > 0 && <div className="team-status-group">
                            <h4 className="team-status-group-heading text">{t("app.shared.debuffs")}</h4>
                            <div className="team-info-chips">{renderStatusChips(groupedStatusEffects.debuffs)}</div>
                        </div>}
                        {groupedStatusEffects.special.length > 0 && <div className="team-status-group">
                            <h4 className="team-status-group-heading text">{t("app.shared.otherUnclassified")}</h4>
                            <div className="team-info-chips">{renderStatusChips(groupedStatusEffects.special)}</div>
                        </div>}
                    </>
                }
            </section>
        </div>
    )
}

const TEAM_BASE_STATS = [
    ["health", "HP", "health"],
    ["attack", "ATK", "attack"],
    ["defence", "DEF", "defence"],
    ["agility", "AGI", "agility"],
]

function TeamHeroStatusIcons({ hero }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    if (!hero) return null
    const statuses = getHeroStatusEffects(hero).filter(name => {
        const polarity = getStatusPolarity(STATUS_EFFECT_DEFINITIONS[name])
        return (polarity === "buff" || polarity === "debuff") && Boolean(statusSprites[name])
    })
    if (statuses.length === 0) return null

    const label = statuses.map(name => tc("status", name, "name", humanize(name))).join(", ")
    return (
        <div className="catalogue-chip team-hero-status-icons" aria-label={tc("hero", hero.id, "name", hero.name) + " " + t("app.shared.buffs") + " / " + t("app.shared.debuffs") + ": " + label} title={label}>
            {statuses.map(name => (
                <img className="team-status-icon" key={name} src={statusSprites[name]} alt={tc("status", name, "name", humanize(name))} title={tc("status", name, "name", humanize(name))} />
            ))}
        </div>
    )
}

export function TeamHeroStats({ hero, slotIndex, calculatedStats }) {
    const t = useTranslate()
    const tc = useContentTranslation()
    if (!hero) return null
    return (
        <div className="team-base-stat-summary" aria-label={t("app.pages.teams.calculatedStats", { name: tc("hero", hero.id, "name", hero.name), slot: slotIndex + 1 })}>
            {TEAM_BASE_STATS.map(([key, label, fullLabel]) => {
                const value = calculatedStats?.main?.[key] ?? hero.stats?.[key]
                const maxValue = calculatedStats?.mainMax?.[key]
                const hasMax = Number.isFinite(Number(maxValue)) && Math.abs(Number(maxValue) - Number(value)) > 0.001
                const format = stat => Number.isFinite(Number(stat)) ? formatNumber(Number(stat), 2) : "—"
                return (
                    <span className="team-base-stat" key={key} title={tc("hero", hero.id, "name", hero.name) + " · " + t("app.shared." + fullLabel)}>
                        <strong>{label}</strong>
                        <span className="team-base-stat-value">{format(value)}</span>
                        {hasMax && <small className="team-base-stat-max">{t("app.pages.teams.max")} {format(maxValue)}</small>}
                    </span>
                )
            })}
        </div>
    )
}

function PageTeams({ heroesRef, itemsRef, savedHeroesRef, savedTeamsRef, savedItemsRef, manualSaveFunction }) {
    const t = useTranslate()
    const tc = useContentTranslation()
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

    const assignHeroToSlot = saveId => {
        if (!slotPicker || saveId === null || saveId === undefined || !savedHeroes.some(hero => hero.saveId === saveId)) return
        commitTeams(teams.map(team => team.id !== slotPicker.teamId ? team : {
            ...team,
            heroes: team.heroes.map((currentSaveId, index) => index === slotPicker.slotIndex ? saveId : currentSaveId),
        }))
        setSlotPicker(null)
        setSelectedSaveId(null)
    }

    const confirmSlotSelection = () => assignHeroToSlot(selectedSaveId)

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
            window.alert(error.message || t("app.pages.teams.couldNotExport"))
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
            window.alert(error.message || t("app.pages.teams.couldNotExportHeroes"))
        }
    }

    const handleCopyTeamLink = async () => {
        if (!teamShareUrl) return
        try {
            await navigator.clipboard.writeText(teamShareUrl)
            setTeamShareLinkCopied(true)
        } catch {
            window.alert(t("app.shared.copyingBlocked"))
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
            window.alert(error.message || t("app.pages.teams.couldNotImport"))
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
                    <Button text={t("app.pages.teams.savedTeams")} color={2} />
                    <Button text={t("app.pages.teams.recommendedTeams")} color={2} disabled />
                    <Button text={t("app.pages.teams.importTeam")} color={2} onClick={() => setImportTeamModalVisible(true)} />
                </div>
                <div className="options flex-row card">
                    <HelpButton title={t("app.shared.teamManagement")}>
                        <TeamManagementGuide />
                    </HelpButton>
                </div>
            </div>

            <main id="page-teams" className="page flex-col w-100">
                <section ref={listRef} {...events} className="teams-list card flex-col" style={{ maxHeight: listHeight }}>
                    <header className="header-big">{t("app.pages.teams.savedTeams")}</header>
                    {teams.length === 0 && <p className="text">{t("app.pages.teams.noTeams")}</p>}
                    {teams.map(team => {
                        const calculatedTeamStats = calculateTeamStats(team, savedHeroes, itemsRef.current?.ITEM_SETS ?? [])
                        return (
                        <article className={"team card flex-col" + (collapsedTeamIds.has(team.id) ? " is-collapsed" : "")} key={team.id}>
                            <header className={"team-header" + (collapsedTeamIds.has(team.id) ? " is-collapsed" : "")}>
                                <Button
                                    className="team-collapse-button"
                                    text={collapsedTeamIds.has(team.id) ? t("app.shared.expand") : t("app.pages.teams.collapse")}
                                    title={collapsedTeamIds.has(team.id) ? t("app.shared.expandTeamDetails") : t("app.pages.teams.collapseTeamDetails")}
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
                                            aria-label={t("app.pages.teams.teamName", { name: team.name })}
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
                                    <div className="team-collapsed-heroes" aria-label={t("app.pages.teams.teamHeroes", { name: team.name })}>
                                        {team.heroes.map((saveId, slotIndex) => {
                                            const hero = savedHeroes.find(savedHero => savedHero.saveId === saveId)
                                            if (!hero) return null
                                            return (
                                                <span className="catalogue-chip text team-collapsed-hero-chip"
                                                    key={team.id + "-collapsed-hero-" + slotIndex}
                                                    title={tc("hero", hero.id, "name", hero.name) + " · " + t("app.shared.slot", { number: slotIndex + 1 })}>
                                                    <img className="catalogue-chip-icon"
                                                        src={hero.heroSrc ?? heroSprites[hero.id] ?? heroSprites["null"]}
                                                        alt="" loading="lazy" decoding="async" draggable={false} />
                                                    <span>{tc("hero", hero.id, "name", hero.name)}</span>
                                                </span>
                                            )
                                        })}
                                    </div>
                                )}
                                {!collapsedTeamIds.has(team.id) && (
                                    <div className="team-actions">
                                        <Button text={t("app.pages.teams.clearTeam")} color={4} onClick={() => clearTeam(team.id)} />
                                        <Button text={t("app.pages.teams.duplicate")} color={5} onClick={() => duplicateTeam(team.id)} />
                                        <Button text={t("app.pages.teams.exportTeam")} color={0} onClick={() => openExportTeam(team)} />
                                        <Button text={t("app.pages.teams.deleteTeam")} color="cancel" onClick={() => deleteTeam(team.id)} />
                                    </div>
                                )}
                            </header>
                            {!collapsedTeamIds.has(team.id) && (
                            <div className="team-content">
                                <div className="team-heroes-column">
                                    <div className="team-hero-slots" aria-label={t("app.pages.teams.heroSlots", { name: team.name })}>
                                        {team.heroes.map((saveId, slotIndex) => {
                                            const hero = savedHeroes.find(savedHero => savedHero.saveId === saveId)
                                            const equippedItems = TEAM_EQUIPMENT_SLOTS.map(slot => ({
                                                slot,
                                                item: Array.isArray(hero?.items) ? hero.items[slot.id] ?? null : null,
                                            }))
                                            return (
                                                <div className="team-hero-slot card card-static" key={`${team.id}-slot-${slotIndex}`}>
                                                    <span className="team-slot-label text">{t("app.shared.slot", { number: slotIndex + 1 })}</span>
                                                    {hero
                                                        ? <>
                                                            <Hero heroObj={hero} selected={false} level={hero.level ?? null} onClick={() => openSlotPicker(team, slotIndex)} />
                                                            <div
                                                                    className="catalogue-chip team-equipped-items"
                                                                    aria-label={t("app.pages.teams.equippedItems", { name: tc("hero", hero.id, "name", hero.name) })}
                                                                    title={t("app.pages.teams.equippedItems", { name: tc("hero", hero.id, "name", hero.name) })}
                                                                >
                                                                    <div className="team-equipped-item-grid">
                                                                        {equippedItems.map(({ slot, item }) => (
                                                                            <span
                                                                                className={"team-equipped-item" + (slot.id === EQUIPMENT_SLOT_DEFINITIONS.OTHER.id ? " is-locked" : item ? "" : " is-empty")}
                                                                                key={slot.id}
                                                                                title={slot.id === EQUIPMENT_SLOT_DEFINITIONS.OTHER.id ? t("app.pages.teams.noOtherSlot") : item?.name ?? humanize(slot.name)}
                                                                            >
                                                                                <img
                                                                                    className="team-equipped-item-icon"
                                                                                    src={slot.id === EQUIPMENT_SLOT_DEFINITIONS.OTHER.id ? LockedSrc : item?.itemSrc || item?.iconSrc || itemSprites["null"]}
                                                                                    alt=""
                                                                                    loading="lazy"
                                                                                    decoding="async"
                                                                                    draggable={false}
                                                                                />
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                            </div>
                                                            <TeamHeroStats hero={hero} slotIndex={slotIndex} calculatedStats={calculatedTeamStats[slotIndex]?.stats} />
                                                            <TeamHeroStatusIcons hero={hero} />
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
                        )
                    })}
                    <div className="team team-new card flex-row sticky-bottom">
                        <Button text={t("app.pages.teams.createNewTeam")} color="confirm" onClick={createTeam} />
                    </div>
                </section>
            </main>

            <Modal
                isVisible={Boolean(exportTeam)}
                position="center"
                onClose={() => { setExportTeam(null); setTeamShareUrl(""); setTeamShareLinkCopied(false) }}
            >
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">{t("app.pages.teams.exportTeam")}</div>
                    <label className="flex-row text margin-auto export-items-checkbox-label">
                        <input type="checkbox" checked={exportItemsOnHeroes} onChange={handleExportItemsToggle} />
                        <span className="header">{t("app.pages.teams.includeEquippedItems")}</span>
                    </label>
                    <p className="text margin-auto">{t("app.pages.teams.shareTeamDescription")}</p>
                    <textarea rows={3} value={teamShareUrl} readOnly onFocus={event => event.target.select()} aria-label={t("app.pages.teams.teamShareLink")} />
                    <div className="flex-row">
                        <Button className="w-25" text={teamShareLinkCopied ? t("app.pages.teams.teamLinkCopied") : t("app.pages.teams.copyTeamLink")} color="confirm" onClick={handleCopyTeamLink} />
                        <Button className="w-25" text={t("app.shared.close")} color="cancel" onClick={() => { setExportTeam(null); setTeamShareUrl(""); setTeamShareLinkCopied(false) }} />
                    </div>
                </div>
            </Modal>
            <Modal
                isVisible={importTeamModalVisible}
                position="center"
                onClose={() => { setImportTeamModalVisible(false); setTeamImportInput("") }}
            >
                <div className="flex-col card w-100">
                    <div className="header-big margin-auto">{t("app.pages.teams.importTeam")}</div>
                    <p className="text margin-auto">{t("app.pages.teams.pasteShareLink")}</p>
                    <textarea rows={3} value={teamImportInput} onChange={event => setTeamImportInput(event.target.value)}
                        placeholder="https://…/teams/?team=…" aria-label={t("app.pages.teams.teamShareLink")} />
                    <div className="flex-row">
                        <Button className="w-25" text={t("app.pages.teams.importTeam")} color="confirm" onClick={() => handleImportTeam()} />
                        <Button className="w-25" text={t("app.shared.cancel")} color="cancel" onClick={() => { setImportTeamModalVisible(false); setTeamImportInput("") }} />
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
                        <h2 className="header-big">{t("app.pages.teams.chooseHero")}</h2>
                        <p className="text">
                            {selectedTeam
                                ? `${selectedTeam.name} · Slot ${(slotPicker?.slotIndex ?? 0) + 1}`
                                : t("app.pages.teams.chooseSavedHeroPrompt")}
                        </p>
                    </header>
                    {modalHeroes.length > 0 ? (
                        <HeroList
                            savedHeroes
                            headerText={t("app.shared.savedHeroes")}
                            heroesRef={modalHeroes}
                            selectedHeroId={selectedSaveId}
                            setSelectedHeroId={setSelectedSaveId}
                            onDoubleClick={hero => assignHeroToSlot(hero.saveId)}
                        />
                    ) : (
                        <p className="text">{t("app.pages.teams.noSavedHeroes")}</p>
                    )}
                    <footer className="team-hero-picker-footer">
                        <Button text={t("app.shared.cancel")} color="cancel" onClick={() => { setSlotPicker(null); setSelectedSaveId(null) }} />
                        <Button text={t("app.shared.confirm")} color="confirm" disabled={selectedSaveId === null} onClick={confirmSlotSelection} />
                    </footer>
                </section>
            </Modal>
        </>
    )
}

export default PageTeams
