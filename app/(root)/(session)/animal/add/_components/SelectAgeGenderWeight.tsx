import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Groupbox from '@/components/ui/Groupbox'
import Radiogroup from '@/components/ui/radiogroup'
import Selectbox from '@/components/ui/selectbox'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import { formalizeText } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { Trash2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    deletePost: () => void
    animal: Animal
}

const SelectAgeGenderWeight = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isDisabledForward, setIsDisabledForward] = useState(true)
    const dialog = useDialog()

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
        if (Number(Number(props.animal.maleQuantityAvailable ?? 0) + Number(props.animal.femaleQuantityAvailable ?? 0)) > 0) {
            disableForward = false
        }
        if (props.animal.averageAge && Number(props.animal.averageAge) > 0) {
            if (props.animal.ageUnit && String(props.animal.ageUnit).length > 0) {
                disableForward = false
            } else {
                disableForward = true
            }
        }
        if (props.animal.averageWeight && Number(props.animal.averageWeight) > 0) {
            if (String(props.animal.weightUnit).length > 0) {
                disableForward = false
            } else {
                disableForward = true
            }
        }

        return disableForward
    }

    const handleWeightChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, averageWeight: Number(val) < 0 ? 0 : Number(val) }))
    }
    const handleAgeChange = (val: string | number) => {
        props.setAnimal((prev: any) => ({ ...prev, averageAge: Number(val) < 0 ? 0 : Number(val) }))
    }

    const handleQuantityChange = (val: string | number, key: string) => {
        props.setAnimal((prev: any) => ({ ...prev, [key]: Number(val) < 0 ? 0 : Number(val) }))
    }

    const handleAgeUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, ageUnit: val }))
    }

    const handleWeightUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, weightUnit: val }))
    }

    const handleMoveNext = () => {
        let isValid = true
        const totalAvailable = Number(props.animal.maleQuantityAvailable ?? 0) + Number(props.animal.femaleQuantityAvailable ?? 0)
        if (Number(totalAvailable) > 0) {
        } else {
            isValid = false
            dialog.showDialog('Please add at least one animal', null, 'Animal')
        }

        if (Number(props.animal.averageAge ?? 0) > 0) {
            if (String(props.animal.ageUnit ?? '').length === 0) {
                isValid = false
                dialog.showDialog('Age', null, 'Please select age unit')
            }
        }

        if (Number(props.animal.averageWeight ?? 0) > 0) {
            if (String(props.animal.weightUnit ?? '').length === 0) {
                isValid = false
                dialog.showDialog('Weight', null, 'Please select weight unit')
            }
        }

        if (isValid) {
            props.moveNext()
        }
    }



    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`More about ${formalizeText(props.animal.breed)} ${props.animal.type}`}</div>
            <div className='flex flex-col gap-4 w-full '>
                {/* <Radiogroup options={["Male", "Female"]} onChange={handleGenderChange} value={props.animal.gender} label='Gender' /> */}
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <Textbox label='Male quantity' type='number' labelClassName='text-nowrap' value={Number(props.animal.maleQuantityAvailable ?? null) ?? null} onChange={(val: string | number) => handleQuantityChange(val, 'maleQuantityAvailable')} />
                        {/* <Textbox label='Mix' type='number' labelClassName='text-nowrap' value={String(props.animal.quantityAvailable) ?? 1} onChange={handleQuantityChange} /> */}
                        <Textbox label='Female quantity' type='number' labelClassName='text-nowrap' value={Number(props.animal.femaleQuantityAvailable ?? null) ?? null} onChange={(val: string | number) => handleQuantityChange(val, 'femaleQuantityAvailable')} />
                    </div>
                    {/* <div className={`flex flex-col gap-2`}>
                            <Checkbox onChange={handleAllowMinimumChange} value={props.animal.isQuantityNegotiable ?? false} label='کم سے کم کتنی تعداد؟' />
                            {props.animal.isQuantityNegotiable && props.animal.isQuantityNegotiable === true && <Textbox type='number' placeholder='Minimum quantity allowed' value={String(props.animal.minimumOrderQuantity) ?? 1} onChange={handleMinimumQuantityChange} />}
                        </div> */}
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <Textbox label='Average age' type='number' value={Number(props.animal.averageAge ?? 0)} onChange={handleAgeChange} />
                    <Selectbox label='Unit' options={["Days", "Months", "Years"]} value={props.animal.ageUnit ?? ""} className={Number(props.animal.averageAge ?? 0) > 0 ? '' : 'opacity-50 grayscale-100'} onChange={handleAgeUnitChange} />
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <Textbox label={`Average weight`} type='number' value={Number(props.animal.averageWeight ?? 0)} onChange={handleWeightChange} />
                    <Selectbox label='Unit' options={["Kg", "Grams"]} value={props.animal.weightUnit ?? ""} className={Number(props.animal.averageWeight ?? 0) > 0 ? '' : 'opacity-50 grayscale-100'} onChange={handleWeightUnitChange} />
                </div>
            </div>

            <div className='w-full p-4'>
                {props.animal && <div className='my-4 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Delete post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                    <Button onClick={handleMoveNext} disabled={isDisabledForward} className='w-full'>Next</Button>
                </div>
            </div>
        </div>
    )
}

export default SelectAgeGenderWeight