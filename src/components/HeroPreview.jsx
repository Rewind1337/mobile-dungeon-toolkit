import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ATTRIBUTE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, ROLE_DEFINITIONS, STATUS_EFFECT_DEFINITIONS, PERK_DEFINITIONS, MASTERWORK_MUTATION_DEFINITIONS, getEnumNameById } from '../database/enums.jsx'
import { CONSTANTS } from '../database/constants.jsx'
import { heroSprites, iconSprites, perkSprites, statusSprites, attributeSprites, roleSprites, elementSprites } from '../database/db_sprites.jsx'

import Button from './Button.jsx'
import Modal from './Modal.jsx'
import { createHeroShareToken, createItemsShareToken } from '../utils/heroShare.js'
import EmptyItem from './EmptyItem.jsx'
import Item from './Item.jsx'
import TextCard from './TextCard.jsx'

import '../css/hero.scss'
import HeroStat from './HeroStat.jsx'


const MAIN_STAT_PERKS = {
    health: { flat: "HEALTH_FLAT", percent: "HEALTH_PERCENT" },
    attack: { flat: "ATTACK_FLAT", percent: "ATTACK_PERCENT" },
    defence: { flat: "DEFENCE_FLAT", percent: "DEFENCE_PERCENT" },
    agility: { flat: "AGILITY_FLAT", percent: "AGILITY_PERCENT" }
}
const OTHER_STAT_DEFAULTS = {
    CRIT_CHANCE: 10, CRIT_RESISTANCE: 0, CRIT_DAMAGE: 150, CRIT_DAMAGE_REDUCTION: 0,
    ACCURACY: 10, RESISTANCE: 20, BOSS_DAMAGE: 0, BOSS_DAMAGE_REDUCTION: 0,
    AOE_DAMAGE_REDUCTION: 0, AP_DAMAGE_REDUCTION: 0, LIFE_STEAL: 0, HEALING_EFFICIENCY: 0,
    HEALING_RECEIVED: 0, FIRE_DAMAGE: 0, NATURE_DAMAGE: 0, WATER_DAMAGE: 0, LIGHT_DAMAGE: 0,
    SHADOW_DAMAGE: 0, FIRE_DAMAGE_REDUCTION: 0, NATURE_DAMAGE_REDUCTION: 0,
    WATER_DAMAGE_REDUCTION: 0, LIGHT_DAMAGE_REDUCTION: 0, SHADOW_DAMAGE_REDUCTION: 0
}
const MUTATION_PERK_ALIASES = { HEAL_RECOVERY: "HEALING_RECEIVED" }
function getItemPerkEntries(item) {
    const entries = []
    for (const perk of item?.fixedPerks ?? []) {
        const key = Object.keys(PERK_DEFINITIONS).find(name => PERK_DEFINITIONS[name].id === perk.id)
        if (key && key !== "NOTHING") entries.push({ key, value: Number(perk.value ?? 0) })
    }
    for (let index = 0; index < (item?.perks ?? []).length; index++) {
        const key = String(item.perks[index] ?? "NOTHING").toUpperCase().replace(/\s/g, "_")
        if (PERK_DEFINITIONS[key] && key !== "NOTHING") entries.push({ key, value: Number(item.perkValues?.[index] ?? 0) })
    }
    return entries
}
function calculateEquippedStats(baseStats, items, sets) {
    const perks = {}, maxPerks = {}
    const add = (target, key, value) => {
        target[key] = (target[key] ?? 0) + (Number(value) || 0)
    }
    const equipped = (items ?? []).filter(Boolean)
    const setCounts = new Map()

    for (const item of equipped) {
        if (item.set !== undefined && item.set !== null && item.set !== -1) {
            setCounts.set(item.set, (setCounts.get(item.set) ?? 0) + 1)
        }

        const masterworkMultiplier = 1 + Math.max(0, Number(item.masterworkLevel) || 0) / 10
        const selectedMutations = []
        const level = Math.max(0, Number(item.masterworkLevel) || 0)

        for (const milestone of [5, 10]) {
            if (level < milestone) continue
            const selection = item.mutations?.[milestone]
            if (!selection || typeof selection !== "object" || !selection.perkKey || selection.id == null) continue

            const mutation = MASTERWORK_MUTATION_DEFINITIONS[selection.perkKey]?.find(
                entry => entry.id === Number(selection.id)
            )
            if (mutation) selectedMutations.push({ perkKey: selection.perkKey, mutation })
        }

        const itemMainStat = ({ 0: "attack", 1: "defence", 2: "agility" })[Number(item.mainAttribute)]
        for (const perk of getItemPerkEntries(item)) {
            const getTargetKey = key => {
                if (key === "MAIN_STAT_FLAT" || key === "MAIN_STAT_PERCENT") {
                    if (!itemMainStat) return null
                    return key === "MAIN_STAT_FLAT"
                        ? MAIN_STAT_PERKS[itemMainStat].flat
                        : MAIN_STAT_PERKS[itemMainStat].percent
                }
                return key
            }

            const targetKey = getTargetKey(perk.key)
            if (!targetKey) continue
            const mutationKey = Object.keys(MUTATION_PERK_ALIASES).find(
                key => MUTATION_PERK_ALIASES[key] === targetKey
            ) ?? targetKey
            const matchingMutations = selectedMutations.filter(
                selection => selection.perkKey === targetKey || selection.perkKey === mutationKey
            )

            // A mutation modifies the matching item perk by its stated percentage.
            // Permanent mutations affect the normal value; conditional mutations only affect MAX.
            let normalMutationMultiplier = 1
            let maxMutationMultiplier = 1
            for (const { mutation } of matchingMutations) {
                const multiplier = 1 + (Number(mutation.bonusPercent) || 0) / 100
                maxMutationMultiplier *= multiplier
                if (mutation.condition === "permanent") normalMutationMultiplier *= multiplier
            }

            const normalValue = perk.value * masterworkMultiplier * normalMutationMultiplier
            const maxValue = perk.value * masterworkMultiplier * maxMutationMultiplier
            add(perks, targetKey, normalValue)
            add(maxPerks, targetKey, maxValue)
        }
    }

    const appliedSets = new Set()
    for (const item of equipped) {
        if (item.set == null || item.set === -1 || appliedSets.has(item.set)) continue
        const set = (sets ?? []).find(entry => entry.id === item.set)
        if (!set || (setCounts.get(item.set) ?? 0) < Number(set.pieces ?? 0)) continue
        appliedSets.add(item.set)

        for (let index = 0; index < (set.setBonus ?? []).length; index++) {
            const perk = set.setBonus[index]
            const key = Object.keys(PERK_DEFINITIONS).find(name => PERK_DEFINITIONS[name].id === perk.id)
            if (!key) continue
            const value = item.setBonusValues?.[index] ?? 0
            add(perks, key, value)
            add(maxPerks, key, value)
        }
    }

    const main = {}, mainMax = {}
    for (const [name, mapping] of Object.entries(MAIN_STAT_PERKS)) {
        const base = Number(baseStats?.[name]) || 0
        const flat = perks[mapping.flat] ?? 0
        const percent = perks[mapping.percent] ?? 0
        const maxFlat = maxPerks[mapping.flat] ?? 0
        const maxPercent = maxPerks[mapping.percent] ?? 0
        main[name] = (base + flat) * (1 + percent / 100)
        mainMax[name] = (base + maxFlat) * (1 + maxPercent / 100)
    }

    const other = { ...OTHER_STAT_DEFAULTS }, otherMax = {}
    for (const [key, base] of Object.entries(OTHER_STAT_DEFAULTS)) {
        other[key] = base + (perks[key] ?? 0)
        otherMax[key] = base + (maxPerks[key] ?? 0)
    }

    return { main, mainMax, other, otherMax }
}
function formatStatValue(value) {
    const rounded = Math.round((Number(value) || 0) * 100) / 100
    return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

function HeroPreview({ heroesRef, selectedHeroId, saveHero, deleteSavedHero, onItemClick, equippedItems = [], setsRef = [] }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const [showSkillsAndTalents, setShowSkillsAndTalents] = useState(false)
    const [exportModalVisible, setExportModalVisible] = useState(false)
    const [heroShareUrl, setHeroShareUrl] = useState("")
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const [exportItemsOnHero, setExportItemsOnHero] = useState(false)
    const [equippedItemsShareUrl, setEquippedItemsShareUrl] = useState("")
    const [itemsShareLinkCopied, setItemsShareLinkCopied] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [mainStats, setMainStats] = useState({
        health: 1234,
        attack: 1234,
        defence: 1234,
        agility: 1234
    })

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
        if (window.matchMedia("(max-width: 900px)").matches === true) {
            newHeight = window.innerHeight - CONSTANTS.listHeightDefault + 77;
        }
        if (listRef.current !== null) {
            if (window.matchMedia("(max-width: 900px)").matches === true) {
                newHeight = window.innerHeight - (CONSTANTS.listHeightMobile + listRef.current.offsetTop)
            } else {
                newHeight = window.innerHeight - (CONSTANTS.listHeightDefault + listRef.current.offsetTop)
            }
        }
        setListHeight(newHeight)
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    let heroObj = heroesRef.find(hero => hero.id === selectedHeroId || hero.saveId === selectedHeroId)

    const calculatedStats = calculateEquippedStats(mainStats, equippedItems, setsRef)

    useEffect(() => {
        setSelectedLevel(heroObj?.level ?? 1)
        setMainStats({
            health: heroObj?.stats?.health ?? 1234,
            attack: heroObj?.stats?.attack ?? 1234,
            defence: heroObj?.stats?.defence ?? 1234,
            agility: heroObj?.stats?.agility ?? 1234
        })
    }, [selectedHeroId,
        heroObj?.id,
        heroObj?.saveId,
        heroObj?.level,
        heroObj?.stats?.health,
        heroObj?.stats?.attack,
        heroObj?.stats?.defence,
        heroObj?.stats?.agility]
    )

    const renderHeroSkills = () => {
        return heroObj.skills.map((skill, index) => (
            <TextCard text={skill.name} prefix={index + 1 + "."} suffix={"Level 1"}>
                <div className='flex-row' title={skill.description}>
                    {skill.effect.map(eff => <div className='text'>{eff.type}</div>)}
                </div>
                {renderSkillStatusEffects(skill)}
            </TextCard>
        ))
    }

    const renderSkillStatusEffects = (skill) => {
        let skillStatusEffects = []
        for (let i = 0; i < skill.effect.length; i++) { // each effect
            let batch = skill.effect[i].applies;
            for (let j = 0; j < batch.length; j++) { // each statuseffect
                skillStatusEffects.push(
                    {sprite: statusSprites[getEnumNameById(STATUS_EFFECT_DEFINITIONS, batch[j].status.id)], name: batch[j].status.name, duration: batch[j].duration}
                )
            }
        }
        return <div className='flex-row'>
            {skillStatusEffects.map(eff => <div className='flex-row card status-effect' title={eff.name}>
                <img className='status-effect-img' width={32} src={eff.sprite}/>
                <div className='status-effect-turns text'>{(eff.duration < 1 ? "Special" : (eff.duration > 1 ? eff.duration + " Turns" : eff.duration + " Turn"))}</div>
            </div>)}
        </div>
    }

    // unused atm, using renderSkillStatusEffects instead on each skill
    /*
    const renderAllHeroStatusEffects = () => {
        let statusEffectSprites = []
        for (let i = 0; i < heroObj.skills.length; i++) { // each skill
            let sEffect = heroObj.skills[i].effect;
            for (let j = 0; j < sEffect.length; j++) { // each effect
                let batch = sEffect[j].applies;
                console.log(batch)
                for (let k = 0; k < batch.length; k++) { // each statuseffect
                    statusEffectSprites.push(statusSprites[getEnumNameById(STATUS_EFFECT_DEFINITIONS, batch[k].status.id)])
                }
            }
        }
        return <div className='flex-row'>
            {statusEffectSprites.map(src => <img width={48} src={src}/>)}
        </div>
    }
    */

    const renderHeroTalents = () => {
        let talents = []
        for (let key in heroObj.talents) {
            let talent = heroObj.talents[key]
            if (!heroObj.talents.active) {
                let sum = ""
                let temp = null
                for (let eff in talent.effect) {
                    temp = talent.effect[eff]
                    let effname = Object.keys(temp)
                    let effvalue = Object.values(temp)
                    for (let i = 0; i < effname.length; i++) {
                        sum += effvalue[i] + "x "
                        sum += effname[i] + "";
                        if (i !== effname.length - 1) {
                            sum += " and "
                        }
                    }
                }
                let row = ~~(key / 10)
                let prefix = (key % 10 == 0 ? "M-" : (key % 2 == 0 ? "R-" : "L-"))
                prefix += row
                talents.unshift(<TextCard text={talent.name} prefix={prefix} suffix={(talent.active ? "Y" : "N")} className={(!prefix.includes("M") ? "w-33" : "w-100")}><div className='text'>{sum}</div></TextCard>)
            }
        }
        return talents
    }

    const handleSaveHero = () => {
        saveHero({
            ...heroObj,
            level: Math.max(1, Number(selectedLevel) || 1),
            stats: {
                health: Number(mainStats.health) || 0,
                attack: Number(mainStats.attack) || 0,
                defence: Number(mainStats.defence) || 0,
                agility: Number(mainStats.agility) || 0
            },
            items: [...equippedItems]
        })
    }


    const buildShareUrl = (queryKey, token, route) => {
        const baseUrl = import.meta.env.BASE_URL
        const basePath = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const shareUrl = new URL(`${basePath}${route}/`, window.location.origin)
        shareUrl.searchParams.set(queryKey, token)
        return shareUrl.toString()
    }

    const handleExportSavedHero = () => {
        if (!heroObj) return
        setExportItemsOnHero(false)
        setEquippedItemsShareUrl("")
        setItemsShareLinkCopied(false)
        setShareLinkCopied(false)
        setHeroShareUrl(buildShareUrl("hero", createHeroShareToken({
            ...heroObj,
            level: Math.max(1, Number(selectedLevel) || 1),
            stats: {
                health: Number(mainStats.health) || 0,
                attack: Number(mainStats.attack) || 0,
                defence: Number(mainStats.defence) || 0,
                agility: Number(mainStats.agility) || 0
            },
            items: [...equippedItems]
        }, { includeItems: false }), "heroes"))
        setExportModalVisible(true)
    }

    const handleExportItemsToggle = (event) => {
        const includeItems = event.target.checked
        setExportItemsOnHero(includeItems)
        setShareLinkCopied(false)
        setItemsShareLinkCopied(false)

        if (!includeItems) {
            setEquippedItemsShareUrl("")
            setHeroShareUrl(buildShareUrl("hero", createHeroShareToken({
                ...heroObj,
                level: Math.max(1, Number(selectedLevel) || 1),
                stats: {
                    health: Number(mainStats.health) || 0,
                    attack: Number(mainStats.attack) || 0,
                    defence: Number(mainStats.defence) || 0,
                    agility: Number(mainStats.agility) || 0
                },
                items: [...equippedItems]
            }, { includeItems: false }), "heroes"))
            return
        }

        try {
            const heroWithCurrentItems = { ...heroObj, items: [...equippedItems] }
            setHeroShareUrl(buildShareUrl("hero", createHeroShareToken({
                ...heroWithCurrentItems,
                level: Math.max(1, Number(selectedLevel) || 1),
                stats: {
                    health: Number(mainStats.health) || 0,
                    attack: Number(mainStats.attack) || 0,
                    defence: Number(mainStats.defence) || 0,
                    agility: Number(mainStats.agility) || 0
                }
            }, { includeItems: true }), "heroes"))
            setEquippedItemsShareUrl(buildShareUrl("items", createItemsShareToken(equippedItems), "items"))
        } catch (error) {
            setExportItemsOnHero(false)
            setEquippedItemsShareUrl("")
            setHeroShareUrl(buildShareUrl("hero", createHeroShareToken({
                ...heroObj,
                level: Math.max(1, Number(selectedLevel) || 1),
                stats: {
                    health: Number(mainStats.health) || 0,
                    attack: Number(mainStats.attack) || 0,
                    defence: Number(mainStats.defence) || 0,
                    agility: Number(mainStats.agility) || 0
                },
                items: [...equippedItems]
            }, { includeItems: false }), "heroes"))
            window.alert(error.message || "Could not export equipped items.")
        }
    }

    const handleCopyShareLink = async () => {
        if (!heroShareUrl) return
        try {
            await navigator.clipboard.writeText(heroShareUrl)
            setShareLinkCopied(true)
        } catch {
            window.alert("Copying was blocked by your browser. Select and copy the link manually.")
        }
    }

    const handleCopyItemsShareLink = async () => {
        if (!equippedItemsShareUrl) return
        try {
            await navigator.clipboard.writeText(equippedItemsShareUrl)
            setItemsShareLinkCopied(true)
        } catch {
            window.alert("Copying was blocked by your browser. Select and copy the link manually.")
        }
    }

    const handleDeleteSavedHero = () => {
        if (!deleteSavedHero || !heroObj) return
        deleteSavedHero(heroObj)
    }

    let noSelection = false
    if (selectedHeroId === null || heroesRef.length === 0) {
        noSelection = true
    }

    if (noSelection) {
        return (
            <div className='hero-preview no-selection'>
                <div className='header-big'>Select a Hero</div>
            </div>
        )
    } else {
        return (
            <div ref={listRef} className='hero-preview flex-col' style={{ maxHeight: listHeight }}>
                <Modal position="center" isVisible={exportModalVisible} onClose={() => setExportModalVisible(false)}>
                    <div className="flex-col card w-100">
                        <div className="header-big margin-auto">Export Hero</div>
                        <label className="flex-row text margin-auto export-items-checkbox-label">
                            <input type="checkbox" checked={exportItemsOnHero} onChange={handleExportItemsToggle} />
                            <div className='header'>Export items on hero</div>
                        </label>
                        <div className="text margin-auto">Share this link to import the hero, level, stats, and talents.</div>
                        {exportItemsOnHero && <>
                            <div className="text margin-auto">This hero link also includes the equipped items. The separate link below only imports the Items.</div>
                        </>}
                        <textarea
                            rows={3}
                            value={heroShareUrl}
                            readOnly
                            onFocus={event => event.target.select()}
                            aria-label="Hero share link"
                        />
                        <div className="flex-row">
                            <Button className="w-25" text={shareLinkCopied ? "Hero Link Copied!" : "Copy Hero Link"} color={"confirm"} onClick={handleCopyShareLink} />
                            <Button className="w-25" text={"Close"} color={"cancel"} onClick={() => setExportModalVisible(false)} />
                        </div>
                        {exportItemsOnHero && <>
                            <hr className='w-100'/>
                            <div className="header-big margin-auto">Export Items only</div>
                            <textarea
                                rows={3}
                                value={equippedItemsShareUrl}
                                readOnly
                                onFocus={event => event.target.select()}
                                aria-label="Equipped items share link"
                            />
                            <div className="text margin-auto">This item link only includes the equipped items, not the hero. The first link above can import the hero as well.</div>
                            <div className="flex-row">
                                <Button className='w-25' text={itemsShareLinkCopied ? "Items Link Copied!" : "Copy Items Link"} color={"confirm"} onClick={handleCopyItemsShareLink} />
                                <Button className="w-25" text={"Close"} color={"cancel"} onClick={() => setExportModalVisible(false)} />
                            </div>
                        </>}
                    </div>
                </Modal>
                <div className='flex-row top-row'>
                    <div className='header pill flex-row'>
                        <img width={48} src={attributeSprites[heroObj.mainAttribute]}/>
                        {getEnumNameById(ATTRIBUTE_DEFINITIONS, heroObj.mainAttribute)}
                    </div>
                    <div className='header-big pill'>{heroObj.variant ? heroObj.variant + " - " : ""}{heroObj.name}</div>
                    <div className='header pill flex-row'>
                        <img width={48} src={roleSprites[heroObj.role]}/>
                        {getEnumNameById(ROLE_DEFINITIONS, heroObj.role)}
                    </div>
                </div>

                {heroObj.statusEffects !== undefined && <div className='flex-row status-row'>
                    {heroObj.statusEffects.map(status => <img width={32} src={statusSprites[getEnumNameById(STATUS_EFFECT_DEFINITIONS, status.id)]} />)}
                </div>}

                <div className='flex-col'>
                    {(heroObj.skills && heroObj.talents) && <Button color={0} text={"Skills & Talents"} onClick={() => { setShowSkillsAndTalents(!showSkillsAndTalents) }} />}
                    <div className='flex-row'>
                        {(showSkillsAndTalents && heroObj.skills) &&
                            <div className='flex-col skills'>
                                {renderHeroSkills()}
                            </div>
                        }
                        <div className='flex-col hero'>
                            <div className={"hero card selected"} data-rarity={heroObj.rarity} data-element={heroObj.element}>
                                <div className="hero-element">
                                    <img
                                        src={heroObj.elementSrc ?? elementSprites[heroObj.element]}
                                        loading="eager"
                                        decoding="async"
                                        draggable={false}
                                        alt=""
                                    />
                                </div>
                                {heroObj.isStarred === true && <div className="hero-starred">
                                    <img src={iconSprites["is_starred"]} loading="eager" decoding="async" draggable={false} />
                                </div>}
                                <div className="flex-col">
                                    <div className="hero-sprite">
                                        <img className="hero-sprite-img"
                                            src={heroObj.heroSrc ?? heroSprites[heroObj.id] ?? heroSprites["null"]}
                                            loading="eager"
                                            decoding="async"
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <input type='number' className='' value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(showSkillsAndTalents && heroObj.talents) &&
                            <div className='flex-row flex-wrap talents'>
                                {renderHeroTalents()}
                            </div>
                        }
                    </div>

                    <div className='header'>Equipped Items</div>
                    <div className="flex-row equipment">
                        {[
                            EQUIPMENT_SLOT_DEFINITIONS.WEAPON,
                            EQUIPMENT_SLOT_DEFINITIONS.HELMET,
                            EQUIPMENT_SLOT_DEFINITIONS.ARMOR,
                            EQUIPMENT_SLOT_DEFINITIONS.RING,
                            EQUIPMENT_SLOT_DEFINITIONS.NECKLACE,
                            EQUIPMENT_SLOT_DEFINITIONS.OTHER
                        ].map(slot => {
                            const item = equippedItems[slot.id]
                            return item
                                ? <Item key={slot.id} itemObj={item} level={item.level ?? 1} loading="eager" onClick={() => onItemClick(slot.id)} />
                                : <EmptyItem key={slot.id} onClick={() => onItemClick(slot.id)} />
                        })}
                    </div>
                    <div className='header'>Main Stats</div>
                    <div className='flex-row base-stats'>
                        {Object.entries(MAIN_STAT_PERKS).map(([name, mapping]) => (
                            <div className='flex-row text card' key={name}>
                                <img width={32} src={perkSprites[mapping.flat]}/>
                                <input aria-label={`Base ${name}`} type='number' value={mainStats[name]} onChange={event => setMainStats(previous => ({ ...previous, [name]: event.target.value }))}/>
                            </div>
                        ))}
                    </div>
                    <div className='flex-row base-stats calculated-stats' aria-label='Calculated main stats'>
                        {Object.entries(MAIN_STAT_PERKS).map(([name, mapping]) => {
                            const hasMax = Math.abs(calculatedStats.mainMax[name] - calculatedStats.main[name]) > 0.001
                            return <div className='flex-row text card calculated-stat' key={name} title={`Final ${name} after equipped gear`}>
                                <img width={32} src={perkSprites[mapping.flat]}/>
                                <div>{formatStatValue(calculatedStats.main[name])}{hasMax ? ` (${formatStatValue(calculatedStats.mainMax[name])} MAX)` : ""}</div>
                            </div>
                        })}
                    </div>
                    <div className='header'>Other Stats</div>
                    <div className='flex-row details'>
                        <div className='flex-col'>
                            {["CRIT_CHANCE","CRIT_RESISTANCE","CRIT_DAMAGE","CRIT_DAMAGE_REDUCTION","ACCURACY","RESISTANCE","BOSS_DAMAGE","BOSS_DAMAGE_REDUCTION","AOE_DAMAGE_REDUCTION","AP_DAMAGE_REDUCTION","LIFE_STEAL","HEALING_EFFICIENCY","HEALING_RECEIVED"].map(name => (
                                <HeroStat key={name} name={name} value={formatStatValue(calculatedStats.other[name])} maxValue={Math.abs(calculatedStats.otherMax[name] - calculatedStats.other[name]) > 0.001 ? formatStatValue(calculatedStats.otherMax[name]) : null}/>
                            ))}
                        </div>
                        <div className='flex-col'>
                            {["FIRE_DAMAGE","NATURE_DAMAGE","WATER_DAMAGE","LIGHT_DAMAGE","SHADOW_DAMAGE","FIRE_DAMAGE_REDUCTION","NATURE_DAMAGE_REDUCTION","WATER_DAMAGE_REDUCTION","LIGHT_DAMAGE_REDUCTION","SHADOW_DAMAGE_REDUCTION"].map(name => (
                                <HeroStat key={name} name={name} value={formatStatValue(calculatedStats.other[name])} maxValue={Math.abs(calculatedStats.otherMax[name] - calculatedStats.other[name]) > 0.001 ? formatStatValue(calculatedStats.otherMax[name]) : null}/>
                            ))}
                        </div>
                    </div>
                    {(saveHero || deleteSavedHero) && <div className='flex-row'>
                        {saveHero && <Button text={"Save Hero"} onClick={handleSaveHero} color={"confirm"}/>}
                        {deleteSavedHero && <Button text={"Export Hero"} onClick={handleExportSavedHero} color={0}/>}
                        {deleteSavedHero && <Button text={"Delete Saved Hero"} onClick={handleDeleteSavedHero} color={"cancel"}/>}
                    </div>}
                </div>
            </div >
        )
    }
}

export default HeroPreview