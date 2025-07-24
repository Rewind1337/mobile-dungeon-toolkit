import { useLayoutEffect, useRef, useState } from 'react'

import { ATTRIBUTE_NAME_MAP, EQUIPMENT_SLOT, ROLE_NAME_MAP } from '../database/enums.jsx'
import { CONSTANTS } from '../database/constants.jsx'
import { perkSprites } from '../database/db_sprites.jsx'
import { getStatsAtLevel } from "../database/func_heroes.jsx"

import Button from './Button.jsx'
import EmptyItem from './EmptyItem.jsx'
import Skill from './Skill.jsx'

import '../css/hero.scss'

function HeroPreview({ heroesRef, selectedHeroId, saveHero, onItemClick }) {
    const [listHeight, setListHeight] = useState(500)
    const listRef = useRef(null)

    function onResize() {
        let newHeight = window.innerHeight - CONSTANTS.listHeightDefault - 5;
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
        return heroObj.skills.map(skill => <Skill />)
    }

    const renderHeroTalents = () => {
        let talents = []
        for (let key in heroObj.talents) {
            if (!heroObj.talents.active) {
                let sum = ""
                let temp = null
                for (let eff in heroObj.talents[key].effect) {
                    temp = heroObj.talents[key].effect[eff]
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
                talents.push(<>{heroObj.talents[key].name} - [{sum}]<br /></>)
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
            <div className='hero-preview'>
                <div className='header-big'>Select a Hero</div>
            </div>
        )
    } else {
        return (
            <div ref={listRef} className='hero-preview' style={{ maxHeight: listHeight }}>
                <div className='flex-row'>
                    <div className='header-big'>{ROLE_NAME_MAP[heroObj.role]}</div>
                    <div className='header-big'>{heroObj.name}</div>
                    <div className='header-big'>{ATTRIBUTE_NAME_MAP[heroObj.mainAttribute]}</div>
                </div>
                <div className='flex-col'>
                    <div className='flex-row'>
                        <div className='flex-row skills'>
                            {heroObj.skills && <>
                                {renderHeroSkills()}
                            </>}
                        </div>
                        <div className={"hero card selected"} data-rarity={heroObj.rarity} data-element={heroObj.element} onClick={() => { onClick() }} >
                            <div className="hero-element"><img src={heroObj.elementSrc} draggable={false} /></div>
                            <div className="flex-col">
                                <div className="hero-sprite"><img className="hero-sprite" src={heroObj.heroSrc} draggable={false} /></div>
                                <div className="text">1</div>
                            </div>
                        </div>
                        <div className='flex-row talents'>
                            {heroObj.talents && <>
                                {renderHeroTalents()}
                            </>}
                        </div>
                    </div>

                    <div className='header'>Equipped Items</div>
                    <div className="flex-row">
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.WEAPON) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.HELMET) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.ARMOR) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.RING) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.NECKLACE) }} />
                        <EmptyItem onClick={() => { onItemClick(EQUIPMENT_SLOT.OTHER) }} />
                    </div>
                    {heroObj.baseStats !== null && <div className='header'>Base Stats</div>}
                    {heroObj.baseStats !== null && <div className='flex-row base-stats'>
                        {getStatsAtLevel(50, heroObj.baseStats).health}<br />
                        {getStatsAtLevel(50, heroObj.baseStats).attack}<br />
                        {getStatsAtLevel(50, heroObj.baseStats).defense}<br />
                        {getStatsAtLevel(50, heroObj.baseStats).agility}<br />
                        <div className='flex-row text card'>{perkSprites["HEALTH_FLAT"]}{heroObj.baseStats.health} Health</div>
                        <div className='flex-row text card'>{perkSprites["ATTACK_FLAT"]}{heroObj.baseStats.attack} Attack</div>
                        <div className='flex-row text card'>{perkSprites["DEFENCE_FLAT"]}{heroObj.baseStats.defense} Defense</div>
                        <div className='flex-row text card'>{perkSprites["AGILITY_FLAT"]}{heroObj.baseStats.agility} Agility</div>
                    </div>}
                    <div className='header'>Other Stats</div>
                    <div className='flex-row details'>
                        <div className='flex-col'>
                            <div className='flex-row text card'>{perkSprites["CRIT_CHANCE"]}10.0% Crit Chance</div>
                            <div className='flex-row text card'>{perkSprites["CRIT_RESISTANCE"]}0.0% Crit Resistance</div>
                            <div className='flex-row text card'>{perkSprites["CRIT_DAMAGE"]}150.0% Crit Damage</div>
                            <div className='flex-row text card'>{perkSprites["CRIT_DAMAGE_REDUCTION"]}0.0% Crit Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["ACCURACY"]}0.0% Accuracy</div>
                            <div className='flex-row text card'>{perkSprites["RESISTANCE"]}0.0% Resistance</div>
                            <div className='flex-row text card'>{perkSprites["BOSS_DAMAGE"]}0.0% Boss Damage</div>
                            <div className='flex-row text card'>{perkSprites["BOSS_DAMAGE_REDUCTION"]}0.0% Boss Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["AOE_DAMAGE_REDUCTION"]}0.0% AoE Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["AP_DAMAGE_REDUCTION"]}0.0% Ap Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["LIFE_STEAL"]}0.0% Life Steal</div>
                            <div className='flex-row text card'>{perkSprites["HEALING_EFFICIENCY"]}0.0% Healing Efficiency</div>
                            <div className='flex-row text card'>{perkSprites["HEALING_RECEIVED"]}0.0% Healing Received</div>
                        </div>
                        <div className='flex-col'>
                            <div className='flex-row text card'>{perkSprites["FIRE_DAMAGE"]}0.0% Fire Damage</div>
                            <div className='flex-row text card'>{perkSprites["NATURE_DAMAGE"]}0.0% Nature Damage</div>
                            <div className='flex-row text card'>{perkSprites["WATER_DAMAGE"]}0.0% Water Damage</div>
                            <div className='flex-row text card'>{perkSprites["LIGHT_DAMAGE"]}0.0% Light Damage</div>
                            <div className='flex-row text card'>{perkSprites["SHADOW_DAMAGE"]}0.0% Shadow Damage</div>
                            <div className='flex-row text card'>{perkSprites["FIRE_DAMAGE_REDUCTION"]}0.0% Fire Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["NATURE_DAMAGE_REDUCTION"]}0.0% Nature Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["WATER_DAMAGE_REDUCTION"]}0.0% Water Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["LIGHT_DAMAGE_REDUCTION"]}0.0% Light Damage Reduction</div>
                            <div className='flex-row text card'>{perkSprites["SHADOW_DAMAGE_REDUCTION"]}0.0% Shadow Damage Reduction</div>
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