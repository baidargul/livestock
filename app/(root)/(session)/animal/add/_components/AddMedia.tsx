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
        <div className='select-none'>
            <div className='p-2 bg-emerald-100 cursor-pointer border-emerald-400 flex flex-col justify-center items-center rounded-xl border' style={{ boxShadow: "0px 20px 14px -8px #98d3b5" }}>
                <FileImageIcon className='w-28 h-28 text-emerald-800' />
                <div className='text-xl font-bold font-sans text-emerald-800'>Add Media</div>
            </div>
        </div>
    )
}

export default AddMedia