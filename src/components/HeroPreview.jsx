import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ATTRIBUTE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, ROLE_DEFINITIONS, STATUS_EFFECT_DEFINITIONS, getEnumNameById } from '../database/enums.jsx'
import { CONSTANTS } from '../database/constants.jsx'
import { heroSprites, itemSprites, iconSprites, perkSprites, statusSprites, attributeSprites, roleSprites, elementSprites } from '../database/db_sprites.jsx'
import ExpandSrc from '../sprites/expand.webp'
import CrossSrc from '../sprites/cross.png'
import LockedSrc from '../sprites/locked.webp'

import Button from './Button.jsx'
import Modal from './Modal.jsx'
import { createHeroShareToken, createItemsShareToken } from '../utils/heroShare.js'
import EmptyItem from './EmptyItem.jsx'
import Item from './Item.jsx'
import SkillCatalogueCard from './SkillCatalogueCard.jsx'
import TalentCatalogueCard from './TalentCatalogueCard.jsx'

import '../css/hero.scss'
import HeroStat from './HeroStat.jsx'
import { calculateHeroStats, MAIN_STAT_PERKS } from '../utils/calculatedStats.js'
import { formatNumber } from '../js/util.jsx'


function cloneTalentSelections(talents) {
    return Object.fromEntries(Object.entries(talents ?? {}).map(([id, talent]) => [id, { ...talent, active: Boolean(talent?.active) }]))
}

function HeroPreview({ isFullWidth = false, onToggleFullWidth, onClosePreview, heroesRef, selectedHeroId, saveHero, deleteSavedHero, onItemClick, equippedItems = [], setsRef = [] }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const previousPreviewHeight = useRef(null)
    const [skillsTalentsModalVisible, setSkillsTalentsModalVisible] = useState(false)
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
    const [talentSelections, setTalentSelections] = useState({})

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

    useLayoutEffect(() => {
        const preview = listRef.current
        if (!preview) return

        const previousHeight = previousPreviewHeight.current
        if (previousHeight === null) {
            previousPreviewHeight.current = preview.getBoundingClientRect().height
            return
        }

        const pane = preview.closest('.hero-preview-pane')
        let timeoutId
        let animationStarted = false
        let finishAnimation
        let onPaneTransitionEnd

        preview.style.height = `${previousHeight}px`
        preview.style.transition = 'height 200ms ease'

        const animateHeight = () => {
            if (animationStarted) return
            animationStarted = true
            window.clearTimeout(timeoutId)
            if (pane && onPaneTransitionEnd) pane.removeEventListener('transitionend', onPaneTransitionEnd)

            const startHeight = preview.getBoundingClientRect().height
            preview.style.transition = 'none'
            preview.style.height = 'auto'
            const targetHeight = preview.getBoundingClientRect().height
            preview.style.height = `${startHeight}px`
            preview.getBoundingClientRect()

            if (Math.abs(startHeight - targetHeight) <= 1) {
                preview.style.height = ''
                preview.style.transition = ''
                previousPreviewHeight.current = targetHeight
                return
            }

            preview.style.transition = 'height 200ms ease'
            finishAnimation = event => {
                if (event.target !== preview || event.propertyName !== 'height') return
                preview.style.height = ''
                preview.style.transition = ''
                preview.removeEventListener('transitionend', finishAnimation)
            }
            preview.addEventListener('transitionend', finishAnimation)
            preview.style.height = `${targetHeight}px`
            previousPreviewHeight.current = targetHeight
        }

        onPaneTransitionEnd = event => {
            if (event.target === pane && (event.propertyName === 'width' || event.propertyName === 'flex-basis')) {
                animateHeight()
            }
        }

        if (pane) pane.addEventListener('transitionend', onPaneTransitionEnd)
        timeoutId = window.setTimeout(animateHeight, 250)

        return () => {
            window.clearTimeout(timeoutId)
            if (pane) pane.removeEventListener('transitionend', onPaneTransitionEnd)
            if (finishAnimation) preview.removeEventListener('transitionend', finishAnimation)
            previousPreviewHeight.current = preview.getBoundingClientRect().height
            preview.style.height = ''
            preview.style.transition = ''
        }
    }, [isFullWidth])

    let heroObj = heroesRef.find(hero => hero.id === selectedHeroId || hero.saveId === selectedHeroId)

    const calculatedStats = calculateHeroStats({ ...heroObj, stats: mainStats, items: equippedItems }, setsRef)
    const hasSkills = (heroObj?.skills ?? []).length > 0
    const hasTalents = Object.keys(heroObj?.talents ?? {}).some(id => /^\d+$/.test(id))

    useEffect(() => {
        setSkillsTalentsModalVisible(false)
        setSelectedLevel(heroObj?.level ?? 1)
        setMainStats({
            health: heroObj?.stats?.health ?? 1234,
            attack: heroObj?.stats?.attack ?? 1234,
            defence: heroObj?.stats?.defence ?? 1234,
            agility: heroObj?.stats?.agility ?? 1234
        })
        setTalentSelections(cloneTalentSelections(heroObj?.talents))
    }, [selectedHeroId,
        heroObj?.id,
        heroObj?.saveId,
        heroObj?.level,
        heroObj?.stats?.health,
        heroObj?.stats?.attack,
        heroObj?.stats?.defence,
        heroObj?.stats?.agility,
        heroObj?.talents]
    )

    const renderHeroSkills = () => (heroObj.skills ?? []).map((skill, index) => (
        <SkillCatalogueCard
            key={`${heroObj.id}-preview-skill-${index}`}
            hero={heroObj}
            skill={skill}
            skillIndex={index}
            showHeroName={false}
            className="hero-preview-skill-entry"
        />
    ))

    const toggleTalent = id => {
        const row = Math.floor(Number(id) / 10)
        setTalentSelections(previous => {
            const selectedTalent = previous[id]
            if (!selectedTalent) return previous
            const next = cloneTalentSelections(previous)

            if (selectedTalent.active) {
                for (const [otherId, talent] of Object.entries(next)) {
                    if (Math.floor(Number(otherId) / 10) >= row) talent.active = false
                }
                return next
            }

            const previousRowIsSelected = row === 1 || Object.entries(previous).some(([otherId, talent]) =>
                Math.floor(Number(otherId) / 10) === row - 1 && talent.active
            )
            if (!previousRowIsSelected) return previous

            for (const [otherId, talent] of Object.entries(next)) {
                if (Math.floor(Number(otherId) / 10) === row) talent.active = false
            }
            next[id].active = true
            return next
        })
    }

    const renderHeroTalents = () => {
        const entries = Object.entries(talentSelections).filter(([id]) => /^\d+$/.test(id))
        const rows = new Map()
        for (const entry of entries) {
            const row = Math.floor(Number(entry[0]) / 10)
            if (!rows.has(row)) rows.set(row, [])
            rows.get(row).push(entry)
        }

        return [...rows.entries()].sort(([rowA], [rowB]) => rowB - rowA).map(([row, rowEntries]) => {
            const previousRowIsSelected = row === 1 || entries.some(([id, talent]) =>
                Math.floor(Number(id) / 10) === row - 1 && talent.active
            )
            const selectedInRow = rowEntries.some(([, talent]) => talent.active)
            rowEntries.sort(([idA], [idB]) => {
                const sideOrder = id => String(id).endsWith("1") ? 0 : String(id).endsWith("0") ? 1 : 2
                return sideOrder(idA) - sideOrder(idB)
            })

            return (
                <div className={"hero-preview-talent-row" + (
                    rowEntries.length === 2 &&
                    rowEntries.some(([id]) => String(id).endsWith("1")) &&
                    rowEntries.some(([id]) => !String(id).endsWith("0") && !String(id).endsWith("1"))
                        ? " has-two-side-talents"
                        : ""
                )} key={"talent-row-" + row}>
                    {rowEntries.map(([id, talent]) => {
                        const isCenter = String(id).endsWith("0")
                        const side = String(id).endsWith("1") ? "left" : isCenter ? "center" : "right"
                        return (
                            <TalentCatalogueCard
                                key={heroObj.id + "-preview-talent-" + id}
                                talent={talent}
                                sources={[{ hero: heroObj, id }]}
                                showSourceHero={false}
                                showSourcePosition={false}
                                interactive={true}
                                isActive={Boolean(talent.active)}
                                isLocked={!previousRowIsSelected && !talent.active}
                                isConflicted={selectedInRow && !talent.active}
                                onClick={() => toggleTalent(id)}
                                className={"hero-preview-talent-entry hero-preview-talent-" + side}
                            />
                        )
                    })}
                </div>
            )
        })
    }
    const handleSaveHero = () => {
        saveHero({
            ...heroObj,
            talents: cloneTalentSelections(talentSelections),
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
            talents: cloneTalentSelections(talentSelections),
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
                talents: cloneTalentSelections(talentSelections),
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
            const heroWithCurrentItems = { ...heroObj, talents: cloneTalentSelections(talentSelections), items: [...equippedItems] }
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
                talents: cloneTalentSelections(talentSelections),
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
                <div className='preview-top-row flex-row'>
                    <Button className='preview-back-button preview-action-chip' prefix={<img className="preview-direction-icon" src={ExpandSrc} alt="" style={{ transform: isFullWidth ? 'rotate(-90deg)' : 'rotate(90deg)' }} />} title={isFullWidth ? 'Show hero list' : 'Expand preview to full width'} text={isFullWidth ? 'Show List' : 'Expand'} onClick={onToggleFullWidth} color={1} />
                    <Button className='preview-close-button preview-action-chip' prefix={<img className="preview-close-icon" src={CrossSrc} alt="" />} title='Deselect this hero and close the preview' text='Deselect Hero' onClick={onClosePreview} color='cancel' />
                </div>
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
                <div className='flex-row top-row hero-metadata'>
                    <div className={'catalogue-chip text hero-metadata-attribute catalogue-chip-attribute-' + String(getEnumNameById(ATTRIBUTE_DEFINITIONS, heroObj.mainAttribute) ?? '').toLowerCase()}>
                        {typeof attributeSprites[heroObj.mainAttribute] === 'string' && <img className='catalogue-chip-icon' src={attributeSprites[heroObj.mainAttribute]} alt='' />}
                        {getEnumNameById(ATTRIBUTE_DEFINITIONS, heroObj.mainAttribute)}
                    </div>
                    <div className='catalogue-chip text header hero-metadata-name' data-rarity={heroObj.rarity}>{heroObj.variant ? heroObj.variant + " - " : ""}{heroObj.name}</div>
                    <div className={'catalogue-chip text hero-metadata-role catalogue-chip-role-' + String(getEnumNameById(ROLE_DEFINITIONS, heroObj.role) ?? '').toLowerCase()}>
                        <img className='catalogue-chip-icon' src={roleSprites[heroObj.role]} alt='' />
                        {getEnumNameById(ROLE_DEFINITIONS, heroObj.role)}
                    </div>
                </div>

                {heroObj.statusEffects !== undefined && <div className='flex-row status-row'>
                    {heroObj.statusEffects.map(status => <img width={32} src={statusSprites[getEnumNameById(STATUS_EFFECT_DEFINITIONS, status.id)]} />)}
                </div>}

                <div className='flex-col'>
                    {(hasSkills || hasTalents) && (
                        <Button
                            className="hero-preview-skills-toggle"
                            color={0}
                            text={"Skills & Talents"}
                            onClick={() => setSkillsTalentsModalVisible(true)}
                        />
                    )}
                    <Modal
                        position="center"
                        isVisible={skillsTalentsModalVisible}
                        onClose={() => setSkillsTalentsModalVisible(false)}
                    >
                        <div className={"hero-preview-skills-talents-modal" + (hasSkills && hasTalents ? "" : " is-single-column")}>
                            {hasSkills && (
                                <section className="hero-preview-skills-talents-column skills">
                                    <div className="header">Skills</div>
                                    {renderHeroSkills()}
                                </section>
                            )}
                            {hasTalents && (
                                <section className="hero-preview-skills-talents-column talents">
                                    <div className="header">Talents</div>
                                    <div className="hero-preview-talent-grid talents">
                                        {renderHeroTalents()}
                                    </div>
                                </section>
                            )}
                        </div>
                    </Modal>
                    <div className="hero-preview-identity">
                        <div className='flex-col hero'>
                            <div className={"hero card selected"} data-rarity={heroObj.rarity} data-element={heroObj.element}>
                                <div className="hero-element">
                                    <img src={heroObj.elementSrc ?? elementSprites[heroObj.element]} loading="eager" decoding="async" draggable={false} alt="" />
                                </div>
                                {heroObj.isStarred === true && <div className="hero-starred">
                                    <img src={iconSprites["is_starred"]} loading="eager" decoding="async" draggable={false} />
                                </div>}
                                <div className="flex-col hero-sprite-container">
                                    <div className="hero-sprite">
                                        <img className="hero-sprite-img" src={heroObj.heroSrc ?? heroSprites[heroObj.id] ?? heroSprites["null"]} loading="eager" decoding="async" draggable={false} />
                                    </div>
                                    <div className="input-wrapper">
                                        <input type='number' className='' value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            if (slot.id === EQUIPMENT_SLOT_DEFINITIONS.OTHER.id) {
                                return (
                                    <div key={slot.id} className="item card item-slot-locked" aria-disabled="true" title="The Other equipment slot is not implemented yet">
                                        <div className="item-icon item-icon-locked">
                                            <img src={LockedSrc} loading="eager" decoding="async" draggable={false} alt="" />
                                        </div>
                                        <div className="flex-col">
                                            <div className="item-sprite">
                                                <img className="item-sprite-img" src={itemSprites["null"]} loading="eager" decoding="async" draggable={false} alt="" />
                                            </div>
                                            <div className="text">Other</div>
                                        </div>
                                    </div>
                                )
                            }
                            return item
                                ? <Item key={slot.id} itemObj={item} level={item.level ?? 1} loading="eager" onClick={() => onItemClick(slot.id)} />
                                : <EmptyItem key={slot.id} label={slot.name.charAt(0) + slot.name.slice(1).toLowerCase()} onClick={() => onItemClick(slot.id)} />
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
                    <div className='header calculated-stats-heading' title='These calculations are experimental and may be incorrect or incomplete.'>Calculated Stats <small>(?)</small></div>
                    <div className='flex-row base-stats calculated-stats' aria-label='Calculated main stats'>
                        {Object.entries(MAIN_STAT_PERKS).map(([name, mapping]) => {
                            const hasMax = Math.abs(calculatedStats.mainMax[name] - calculatedStats.main[name]) > 0.001
                            return <div className='flex-row text card calculated-stat' key={name} title={`Final ${name} after equipped gear`}>
                                <img width={32} src={perkSprites[mapping.flat]}/>
                                <div>{formatNumber(calculatedStats.main[name], 2)}{hasMax ? ` (${formatNumber(calculatedStats.mainMax[name], 2)} MAX)` : ""}</div>
                            </div>
                        })}
                    </div>
                    <div className='header'>Other Stats</div>
                    <div className='flex-row details'>
                        <div className='flex-col'>
                            {["CRIT_CHANCE","CRIT_RESISTANCE","CRIT_DAMAGE","CRIT_DAMAGE_REDUCTION","ACCURACY","RESISTANCE","BOSS_DAMAGE","BOSS_DAMAGE_REDUCTION","AOE_DAMAGE_REDUCTION","AP_DAMAGE_REDUCTION","LIFE_STEAL","HEALING_EFFICIENCY","HEALING_RECEIVED"].map(name => (
                                <HeroStat key={name} name={name} value={formatNumber(calculatedStats.other[name], 2)} maxValue={Math.abs(calculatedStats.otherMax[name] - calculatedStats.other[name]) > 0.001 ? formatNumber(calculatedStats.otherMax[name], 2) : null}/>
                            ))}
                        </div>
                        <div className='flex-col'>
                            {["FIRE_DAMAGE","NATURE_DAMAGE","WATER_DAMAGE","LIGHT_DAMAGE","SHADOW_DAMAGE","FIRE_DAMAGE_REDUCTION","NATURE_DAMAGE_REDUCTION","WATER_DAMAGE_REDUCTION","LIGHT_DAMAGE_REDUCTION","SHADOW_DAMAGE_REDUCTION"].map(name => (
                                <HeroStat key={name} name={name} value={formatNumber(calculatedStats.other[name], 2)} maxValue={Math.abs(calculatedStats.otherMax[name] - calculatedStats.other[name]) > 0.001 ? formatNumber(calculatedStats.otherMax[name], 2) : null}/>
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