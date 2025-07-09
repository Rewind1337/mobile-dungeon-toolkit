import { memo, useState } from 'react'
import Button from './Button.jsx'

import { perkSprites } from '../database/db_sprites.jsx';
import { PERKS } from '../database/enums.jsx';

function ItemPerk({ name, value, onClick, buttonText = "Change", buttonColor = 5 }) {
    const _perk = PERKS[name]

    return (
        <div className={"item-perk card flex-row"}>

            <div className='text flex-row'>{perkSprites[name]}{_perk.name}</div>
            <div className='text'>{value}</div>
            <Button slim text={buttonText} color={buttonColor} onClick={() => { onClick() }} />
        </div>
    )
}

export default memo(ItemPerk)