import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Groupbox from '@/components/ui/Groupbox'
import Radiogroup from '@/components/ui/radiogroup'
import Selectbox from '@/components/ui/selectbox'
import Textbox from '@/components/ui/Textbox'
import { formalizeText } from '@/lib/utils'
import { Animal } from '@prisma/client'
import React, { useEffect, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: Animal
}

const SelectAgeGenderWeight = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isDisabledForward, setIsDisabledForward] = useState(true)

    useEffect(() => {
        if (!props.animal.averageWeight) {
            props.setAnimal((prev: any) => ({ ...prev, averageWeight: 0 }))
        }
        if (!props.animal.averageAge) {
            props.setAnimal((prev: any) => ({ ...prev, averageAge: 0 }))
        }

        const validated = validate()
        setIsDisabledForward(validated)
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const validated = validate()
            setIsDisabledForward(validated)
        }
    }, [props.animal])

    const validate = () => {
        let disableForward = true
        if (props.animal.maleQuantityAvailable || props.animal.femaleQuantityAvailable) {
            if (Number(props.animal.maleQuantityAvailable) > 0 || Number(props.animal.femaleQuantityAvailable) > 0) {
                disableForward = false
            } else {
                disableForward = true
            }
        }
        if (props.animal.averageAge && props.animal.averageAge > 0) {
            if (props.animal.ageUnit) {
                disableForward = false
            } else {
                disableForward = true
            }
        }
        if (props.animal.averageWeight && props.animal.averageWeight > 0) {
            if (props.animal.weightUnit) {
                disableForward = false
            } else {
                disableForward = true
            }
        }

        return disableForward
    }

    const handleWeightChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, averageWeight: Number(val) }))
    }
    const handleAgeChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, averageAge: Number(val) }))
    }

    const handleQuantityChange = (val: string | number, key: string) => {
        props.setAnimal((prev: any) => ({ ...prev, [key]: Number(val) }))
    }

    const handleAgeUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, ageUnit: val }))
    }

    const handleWeightUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, weightUnit: val }))
    }

    const handleMoveNext = () => {
        if (props.animal.maleQuantityAvailable || props.animal.femaleQuantityAvailable) {
            if (Number(props.animal.maleQuantityAvailable) > 0 || Number(props.animal.femaleQuantityAvailable) > 0) {
                props.moveNext()
            }
        }
    }



    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`More about ${formalizeText(props.animal.breed)} ${props.animal.type}`}</div>
            <div className='flex flex-col gap-4 w-full '>
                {/* <Radiogroup options={["Male", "Female"]} onChange={handleGenderChange} value={props.animal.gender} label='Gender' /> */}
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <Textbox label='Male quantity' type='number' labelClassName='text-nowrap' value={Number(props.animal.maleQuantityAvailable) ?? 1} onChange={(val: string) => handleQuantityChange(val, 'maleQuantityAvailable')} />
                        {/* <Textbox label='Mix' type='number' labelClassName='text-nowrap' value={String(props.animal.quantityAvailable) ?? 1} onChange={handleQuantityChange} /> */}
                        <Textbox label='Female quantity' type='number' labelClassName='text-nowrap' value={Number(props.animal.femaleQuantityAvailable) ?? 1} onChange={(val: string) => handleQuantityChange(val, 'femaleQuantityAvailable')} />
                    </div>
                    {/* <div className={`flex flex-col gap-2`}>
                            <Checkbox onChange={handleAllowMinimumChange} value={props.animal.isQuantityNegotiable ?? false} label='کم سے کم کتنی تعداد؟' />
                            {props.animal.isQuantityNegotiable && props.animal.isQuantityNegotiable === true && <Textbox type='number' placeholder='Minimum quantity allowed' value={String(props.animal.minimumOrderQuantity) ?? 1} onChange={handleMinimumQuantityChange} />}
                        </div> */}
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <Textbox label='Average age' type='number' value={Number(props.animal.averageAge)} onChange={handleAgeChange} />
                    <Selectbox label='Unit' options={["Days", "Months", "Years"]} value={props.animal.ageUnit ?? ""} onChange={handleAgeUnitChange} />
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <Textbox label={`Average weight`} type='number' value={Number(props.animal.averageWeight)} onChange={handleWeightChange} />
                    <Selectbox label='Unit' options={["Kg", "Grams"]} value={props.animal.weightUnit ?? ""} onChange={handleWeightUnitChange} />
                </div>
                {/* <div className='flex items-center gap-5'>
                    <Checkbox onChange={(val: boolean) => handleChecks(val, "vaccinationStatus")} value={props.animal.vaccinationStatus ?? false} label='Vaccined' />
                    <Checkbox onChange={(val: boolean) => handleChecks(val, "pregnancyStatus")} value={props.animal.pregnancyStatus ?? false} label='Can get pregnant' />
                </div> */}
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={handleMoveNext} disabled={isDisabledForward} className='w-full'>Next</Button>
            </div>
        </div>
    )
}

export default SelectAgeGenderWeight