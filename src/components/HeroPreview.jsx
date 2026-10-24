import { useLayoutEffect, useRef, useState } from 'react'

import { ATTRIBUTE, EQUIPMENT_SLOT, ROLE, STATUS_EFFECTS, getEnumNameById } from '../database/enums.jsx'
import { CONSTANTS } from '../database/constants.jsx'
import { iconSprites, perkSprites, statusSprites, attributeSprites, roleSprites } from '../database/db_sprites.jsx'

import Button from './Button.jsx'
import EmptyItem from './EmptyItem.jsx'
import TextCard from './TextCard.jsx'

import '../css/hero.scss'
import HeroStat from './HeroStat.jsx'

function HeroPreview({ heroesRef, selectedHeroId, saveHero, onItemClick }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)
    const [showSkillsAndTalents, setShowSkillsAndTalents] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(1)

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

    let heroObj = heroesRef[selectedHeroId]

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
                    {sprite: statusSprites[getEnumNameById(STATUS_EFFECTS, batch[j].status.id)], name: batch[j].status.name, duration: batch[j].duration}
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

    // unused atm, using renderSkillStatusEffects instead
    const renderAllHeroStatusEffects = () => {
        let statusEffectSprites = []
        for (let i = 0; i < heroObj.skills.length; i++) { // each skill
            let sEffect = heroObj.skills[i].effect;
            for (let j = 0; j < sEffect.length; j++) { // each effect
                let batch = sEffect[j].applies;
                console.log(batch)
                for (let k = 0; k < batch.length; k++) { // each statuseffect
                    statusEffectSprites.push(statusSprites[getEnumNameById(STATUS_EFFECTS, batch[k].status.id)])
                }
            }
        }
        return <div className='flex-row'>
            {statusEffectSprites.map(src => <img width={48} src={src}/>)}
        </div>
    }

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
                <div className='flex-row top-row'>
                    <div className='header pill flex-row'>
                        <img width={48} src={attributeSprites[heroObj.mainAttribute]}/>
                        {getEnumNameById(ATTRIBUTE, heroObj.mainAttribute)}
                    </div>
                    <div className='header-big pill'>{heroObj.variant ? heroObj.variant + " - " : ""}{heroObj.name}</div>
                    <div className='header pill flex-row'>
                        <img width={48} src={roleSprites[heroObj.role]}/>
                        {getEnumNameById(ROLE, heroObj.role)}
                    </div>
                </div>

                {heroObj.statusEffects !== undefined && <div className='flex-row status-row'>
                    {heroObj.statusEffects.map(status => <img width={32} src={statusSprites[getEnumNameById(STATUS_EFFECTS, status.id)]} />)}
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
                            <div className={"hero card selected"} data-rarity={heroObj.rarity} data-element={heroObj.element} onClick={() => { onClick() }} >
                                <div className="hero-element"><img src={heroObj.elementSrc} draggable={false} /></div>
                                {heroObj.isStarred === true && <div className="hero-starred">
                                    <img src={iconSprites["is_starred"]} draggable={false} />
                                </div>}
                                <div className="flex-col">
                                    <div className="hero-sprite"><img className="hero-sprite-img" src={heroObj.heroSrc} draggable={false} /></div>
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
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.WEAPON) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.HELMET) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.ARMOR) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.RING) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.NECKLACE) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.OTHER) }} />
                    </div>
                    <div className='header'>Main Stats</div>
                    <div className='flex-row base-stats'>
                        <div className='flex-row text card'>
                            <img width={32} src={perkSprites["HEALTH_FLAT"]}/>
                            <input type='number' defaultValue={1234}/>
                        </div>
                        <div className='flex-row text card'>
                            <img width={32} src={perkSprites["ATTACK_FLAT"]}/>
                            <input type='number' defaultValue={1234}/>
                        </div>
                        <div className='flex-row text card'>
                            <img width={32} src={perkSprites["DEFENCE_FLAT"]}/>
                            <input type='number' defaultValue={1234}/>
                        </div>
                        <div className='flex-row text card'>
                            <img width={32} src={perkSprites["AGILITY_FLAT"]}/>
                            <input type='number' defaultValue={1234}/>
                        </div>
                    </div>
                    <div className='header'>Other Stats</div>
                    <div className='flex-row details'>
                        <div className='flex-col'>
                            <HeroStat name={"CRIT_CHANCE"} value={10}/>
                            <HeroStat name={"CRIT_RESISTANCE"} value={0}/>
                            <HeroStat name={"CRIT_DAMAGE"} value={150}/>
                            <HeroStat name={"CRIT_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"ACCURACY"} value={10}/>
                            <HeroStat name={"RESISTANCE"} value={20}/>
                            <HeroStat name={"BOSS_DAMAGE"} value={0}/>
                            <HeroStat name={"BOSS_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"AOE_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"AP_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"LIFE_STEAL"} value={0}/>
                            <HeroStat name={"HEALING_EFFICIENCY"} value={0}/>
                            <HeroStat name={"HEALING_RECEIVED"} value={0}/>
                        </div>
                        <div className='flex-col'>
                            <HeroStat name={"FIRE_DAMAGE"} value={0}/>
                            <HeroStat name={"NATURE_DAMAGE"} value={0}/>
                            <HeroStat name={"WATER_DAMAGE"} value={0}/>
                            <HeroStat name={"LIGHT_DAMAGE"} value={0}/>
                            <HeroStat name={"SHADOW_DAMAGE"} value={0}/>
                            <HeroStat name={"FIRE_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"NATURE_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"WATER_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"LIGHT_DAMAGE_REDUCTION"} value={0}/>
                            <HeroStat name={"SHADOW_DAMAGE_REDUCTION"} value={0}/>
                        </div>
                    </div>
                    <div className='flex-row'>
                        <Button text={"Save Hero"} onClick={() => { saveHero(heroObj) }} />
                    </div>
                </div>
            </div >
        )
    }
}

export default HeroPreview