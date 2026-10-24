import { memo, useState } from 'react'

import { perkSprites } from '../database/db_sprites.jsx';
import { PERK_DEFINITIONS } from '../database/enums.jsx';

function HeroStat({ name, value }) {
    const [_value, _setValue] = useState(value);
    const _perk = PERK_DEFINITIONS[name]
    const isFlatPerk = ((_perk.id >= 4 && _perk.id <= 7) || _perk.id == 32)

    return (
        <div className={"hero-stat card flex-row justify-between"}>
            <div className='text flex-row'><img height={24} src={perkSprites[name]}/>{_perk.name}</div>
            <div className='text'>{value}{isFlatPerk ? " Flat" : " %"}</div>
        </div>
    )
}

export default memo(HeroStat)