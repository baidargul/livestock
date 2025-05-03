import Button from '@/components/ui/Button'
import { FileImageIcon } from 'lucide-react'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const AddMedia = (props: Props) => {
    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4 select-none'>
            <div className='text-xl font-semibold tracking-tight text-center'>Please select atleast 4 images</div>
            <div className='p-2 bg-emerald-100 cursor-pointer border-emerald-400 flex flex-col justify-center items-center rounded-xl border' style={{ boxShadow: "0px 20px 14px -8px #98d3b5" }}>
                <FileImageIcon className='w-28 h-28 text-emerald-800' />
                <div className='text-xl font-bold font-sans text-emerald-800'>Select Images</div>
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full'>Next</Button>
            </div>
        </div>
    )
}

export default AddMedia