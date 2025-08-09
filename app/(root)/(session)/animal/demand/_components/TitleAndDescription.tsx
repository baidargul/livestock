import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { formalizeText } from '@/lib/utils'
import { Trash2Icon } from 'lucide-react'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
    deletePost: () => void
}

const TitleAndDescription = (props: Props) => {
    return (
        <div className='w-full select-none min-h-[95dvh] flex flex-col items-center gap-4 p-4'>
            <div>
                <div className='text-xl font-semibold tracking-tight text-center'>{`Add some info for your ${formalizeText(props.animal.breed)} ${props.animal.type}`}</div>
                <div>
                    <div className='flex flex-col gap-2 mt-4'>
                        <div className='flex gap-2 justify-evenly items-center'>
                            <div className='flex flex-col gap-2 my-2'>
                                <label htmlFor="title" className='text-sm font-semibold'>Province</label>
                                <Textbox id='title' placeholder={`Punjab`} onChange={(e: any) => props.setAnimal({ ...props.animal, province: e })} value={props.animal.province} />
                            </div>
                            <div className='flex flex-col gap-2 my-2'>
                                <label htmlFor="title" className='text-sm font-semibold'>District</label>
                                <Textbox id='title' placeholder={`Multan`} onChange={(e: any) => props.setAnimal({ ...props.animal, city: e })} value={props.animal.city} />
                            </div>
                        </div>
                        <label className='p-1 text-sm text-center bg-amber-50 rounded-md border-amber-100 border tracking-tight'>⚠️ Avoid sharing phone numbers, email addresses, or other contact details, or your account might get banned.</label>
                    </div>
                </div>
            </div>
            <div className='w-full p-4 mt-auto'>
                {props.animal && <div className='my-4 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Delete post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                    <Button onClick={props.moveNext} className='w-full' disabled={!props.animal?.province || String(props.animal?.province).length === 0 || !props.animal?.city || String(props.animal?.city).length === 0
                    }>{props.animal?.breed && props.animal?.breed !== "" ? `Next` : "Select"}</Button>
                </div>
            </div>
        </div>
    )
}

export default TitleAndDescription