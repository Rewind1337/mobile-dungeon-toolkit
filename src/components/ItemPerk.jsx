import { memo, useState } from 'react'
import Button from './Button.jsx'

import { perkSprites } from '../database/db_sprites.jsx';
import { PERKS } from '../database/enums.jsx';

function ItemPerk({ name, value, onClick, buttonText = "Change", buttonColor = 5, noValue = false, editable = false }) {
    const [_value, _setValue] = useState(value);
    const _perk = PERKS[name]
    const isFlatPerk = ((_perk.id >= 4 && _perk.id <= 7) || _perk.id == 32)

    return (
        <div className={"item-perk card flex-row"}>

            <div className='text flex-row'>{perkSprites[name]}{_perk.name}</div>

            {!noValue && <>
                {editable
                    ? <div className='text'><input type='number' className='text' value={_value} onChange={e => _setValue(e.target.value)} />{isFlatPerk ? " Flat" : " %"}</div>
                    : <div className='text'>{value}{isFlatPerk ? " Flat" : " %"}</div>
                }
            </>}

            {onClick ? <Button slim text={buttonText} color={buttonColor} onClick={() => { onClick() }} /> : <div className='text'>not changeable</div>}
        </div>
    )
}

export default memo(ItemPerk)