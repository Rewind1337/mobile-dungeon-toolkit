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
    multiplier = 1,
    changeDisabled = false,
    spriteName = name,
    hideChangeButton = false
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
            <div className='flex-row'>
                <img width={32} src={perkSprites[spriteName] ?? perkSprites[name]} />
                <div className='text perk-name'>{_perk.name}</div>
            </div>

            {!noValue && <>
                {editable
                    ? <div className='flex-col no-gaps'>
                        <div className='flex-row perk-input-row'>
                            <input
                                type='number'
                                className='text'
                                value={displayedValue}
                                onChange={handleValueChange}
                            />
                            <div className='text perk-flat-percent'>{isFlatPerk ? " Flat" : " %"}</div>
                        </div>
                        <div className='text perk-effective'>{multiplier > 1 && <small>Effective: {formatValue(effectiveValue)}{isFlatPerk ? " Flat" : " %"}</small>}</div>
                    </div>
                    : <div className='text flex-col'>
                        <div className='text perk-flat-percent'>{displayedValue}{isFlatPerk ? " Flat" : " %"}</div>
                        <div className='text perk-effective'>{multiplier > 1 && <small>Effective: {formatValue(effectiveValue)}{isFlatPerk ? " Flat" : " %"}</small>}</div>
                    </div>
                }
            </>}

            {!hideChangeButton && (onClick
                ? <Button slim text={buttonText} color={buttonColor} disabled={changeDisabled} onClick={() => onClick()} />
                : <div className='text perk-not-changeable'>not changeable</div>
            )}
        </div>
    )
}

export default memo(ItemPerk)
