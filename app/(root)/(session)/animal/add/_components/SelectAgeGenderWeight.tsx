import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Radiogroup from '@/components/ui/radiogroup'
import Selectbox from '@/components/ui/selectbox'
import Textbox from '@/components/ui/Textbox'
import { formalizeText } from '@/lib/utils'
import { Animal } from '@prisma/client'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: Animal
}

const SelectAgeGenderWeight = (props: Props) => {

    const handleGenderChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, gender: val }))
    }

    const handleWeightChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, weight: val }))
    }
    const handleAgeChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, age: val }))
    }

    const handleQuantityChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, quantity: val }))
    }

    const handleAgeUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, ageUnit: val }))
    }

    const handleWeightUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, weightUnit: val }))
    }

    const handleAllowMinimumChange = (val: boolean) => {
        props.setAnimal((prev: any) => ({ ...prev, isQuantityNegotiable: val }))
    }

    const handleMinimumQuantityChange = (val: string) => {
        const minValue = Number(val);

        if (isNaN(minValue)) {
            console.error("Invalid input: not a number");
            return;
        }

        if (minValue > props.animal.quantityAvailable) {
            props.setAnimal((prev: any) => ({
                ...prev,
                minimumOrderQuantity: props.animal.quantityAvailable,
            }));
        } else if (minValue < 1) {
            props.setAnimal((prev: any) => ({
                ...prev,
                minimumOrderQuantity: 1,
            }));
        } else {
            props.setAnimal((prev: any) => ({
                ...prev,
                minimumOrderQuantity: minValue,
            }));
        }
    }

    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`More about ${formalizeText(props.animal.breed)} ${props.animal.type}`}</div>
            <div className='flex flex-col gap-4 w-full '>
                <Radiogroup options={["Male", "Female"]} onChange={handleGenderChange} value={props.animal.gender} label='Gender' />
                <div className='flex items-center gap-4'>
                    <Textbox label='Quantity' type='number' value={String(props.animal.quantityAvailable) ?? 1} onChange={handleQuantityChange} />
                    <div className={`flex flex-col gap-1`}>
                        <Checkbox onChange={handleAllowMinimumChange} value={props.animal.isQuantityNegotiable ?? false} label='Accept minimum' />
                        {props.animal.isQuantityNegotiable && props.animal.isQuantityNegotiable === true && <Textbox type='number' placeholder='Minimum quantity allowed' value={String(props.animal.minimumOrderQuantity) ?? 1} onChange={handleMinimumQuantityChange} />}
                    </div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <Textbox label='Age' type='number' value={String(props.animal.age)} onChange={handleAgeChange} />
                    <Selectbox label='Unit' options={["Days", "Months", "Years"]} value={props.animal.ageUnit} onChange={handleAgeUnitChange} />
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <Textbox label='Weight' type='number' value={String(props.animal.weight)} onChange={handleWeightChange} />
                    <Selectbox label='Unit' options={["Kg", "Lbs"]} value={props.animal.weightUnit} onChange={handleWeightUnitChange} />
                </div>
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full'>Next</Button>
            </div>
        </div>
    )
}

export default SelectAgeGenderWeight