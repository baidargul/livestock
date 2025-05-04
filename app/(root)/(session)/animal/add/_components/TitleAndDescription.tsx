import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { formalizeText } from '@/lib/utils'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const TitleAndDescription = (props: Props) => {
    return (
        <div className='w-full select-none min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`Add some info for your ${formalizeText(props.animal.breed)} ${props.animal.type}`}</div>
            <div>
                <div className='flex flex-col gap-2 mt-4'>
                    <label htmlFor="title" className='text-sm font-semibold'>Title</label>
                    <Textbox id='title' placeholder={`e.g. ${props.animal.breed} is looking for a new home`} onChange={(e: any) => props.setAnimal({ ...props.animal, title: e })} />
                </div>
                <div className='flex flex-col gap-2 mt-4'>
                    <label htmlFor="description" className='text-sm font-semibold'>Description</label>
                    <textarea id='description' placeholder={`e.g. ${props.animal.breed} is a friendly ${props.animal.type}.`} className='w-full p-2 border border-gray-300 rounded-md' onChange={(e) => props.setAnimal({ ...props.animal, description: e.target.value })} />
                    <label className='p-1 text-sm text-center bg-amber-50 rounded-md border-amber-100 border tracking-tight'>⚠️ Avoid sharing phone numbers, email addresses, or other contact details, or your account might get banned.</label>
                </div>
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full' disabled={props.animal?.breed && props.animal?.breed !== "" ? false : true}>{props.animal?.breed && props.animal?.breed !== "" ? `Next` : "Select"}</Button>
            </div>
        </div>
    )
}

export default TitleAndDescription