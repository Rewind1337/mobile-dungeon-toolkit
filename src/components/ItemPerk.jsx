import { memo, useEffect, useState } from 'react'
import Button from './Button.jsx'

import { perkSprites } from '../database/db_sprites.jsx'
import { PERK_DEFINITIONS } from '../database/enums.jsx'

function ItemPerk({
    name,
    value,
    onValueChange,
    onClick,
    buttonText = "Change",
    buttonColor = 5,
    noValue = false,
    editable = false,
    multiplier = 1
}) {
    const [_value, _setValue] = useState(value ?? 0)
    const _perk = PERK_DEFINITIONS[name]
    const isFlatPerk = ((_perk.id >= 4 && _perk.id <= 7) || _perk.id === 32)
    const displayedValue = onValueChange ? (value ?? 0) : _value
    const numericValue = Number(displayedValue) || 0
    const effectiveValue = Math.round(numericValue * multiplier * 100) / 100
    const formatValue = number => Number.isInteger(number) ? String(number) : String(Number(number.toFixed(2)))

    useEffect(() => {
        if (!onValueChange) {
            _setValue(value ?? 0)
        }
    }, [value, onValueChange])

    const handleValueChange = (event) => {
        const nextValue = event.target.value
        if (onValueChange) {
            onValueChange(nextValue)
        } else {
            _setValue(nextValue)
        }
    }

    return (
        <div className={"item-perk card flex-row"}>
            <div className='text flex-row'>
                <img width={32} src={perkSprites[name]} />
                {_perk.name}
            </div>

            {!noValue && <>
                {editable
                    ? <div className='text flex-col'>
                        <div className='flex-row'>
                            <input
                                type='number'
                                className='text'
                                value={displayedValue}
                                onChange={handleValueChange}
                            />
                            {isFlatPerk ? " Flat" : " %"}
                        </div>
                        {multiplier > 1 && <small>Effective: {formatValue(effectiveValue)}{isFlatPerk ? " Flat" : " %"}</small>}
                    </div>
                    : <div className='text flex-col'>
                        <div>{displayedValue}{isFlatPerk ? " Flat" : " %"}</div>
                        {multiplier > 1 && <small>Effective: {formatValue(effectiveValue)}{isFlatPerk ? " Flat" : " %"}</small>}
                    </div>
                }
            </>}

            {onClick
                ? <Button slim text={buttonText} color={buttonColor} onClick={() => onClick()} />
                : <div className='text'>not changeable</div>
            }
        </div>
    )
}

export default memo(ItemPerk)
