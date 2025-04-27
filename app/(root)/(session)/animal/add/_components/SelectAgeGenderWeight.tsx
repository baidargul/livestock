import Button from '@/components/ui/Button'
import Radiogroup from '@/components/ui/radiogroup'
import Textbox from '@/components/ui/Textbox'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
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



    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`More about`}</div>
            <div className='flex flex-col gap-4 w-full '>
                <Textbox label='Age' type='number' value={props.animal.age} onChange={handleAgeChange} />
                <Textbox label='Weight' type='number' value={props.animal.weight} onChange={handleWeightChange} />
                <Textbox label='Quantity' type='number' value={props.animal.quantity ?? 1} onChange={handleQuantityChange} />
                <Radiogroup options={["Male", "Female"]} onChange={handleGenderChange} value={props.animal.gender} label='Gender' />
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full'>Next</Button>
            </div>
        </div>
    )
}

export default SelectAgeGenderWeight