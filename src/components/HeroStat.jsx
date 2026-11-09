import { memo, useState } from 'react'

import { perkSprites } from '../database/db_sprites.jsx';
import { PERK_DEFINITIONS } from '../database/enums.jsx'
import { isFlatPerk } from '../js/catalogueItemUtils.jsx'
import { useContentTranslation } from '../hooks/useContentTranslation.jsx';

function HeroStat({ name, value, maxValue = null }) {
    const tc = useContentTranslation()
    const [_value, _setValue] = useState(value);
    const _perk = PERK_DEFINITIONS[name]
    const flatPerk = isFlatPerk(_perk)

    return (
        <div className={"hero-stat card flex-row justify-between"}>
            <div className='text flex-row'><img height={24} src={perkSprites[name]}/>{tc("perk", name, "name", _perk.name)}</div>
            <div className='text'>{value}{flatPerk ? " Flat" : " %"}{maxValue !== null && maxValue !== undefined ? ` (${maxValue} MAX)` : ""}</div>
        </div>
    )
}

export default memo(HeroStat)