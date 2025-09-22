import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    animal: any
    handleSelectAnimal: (animal: any) => void
}

const AnimalRow = (props: Props) => {
    const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)
    return (
        <div onClick={() => props.handleSelectAnimal(props.animal)} className='relative rounded-md overflow-hidden cursor-pointer'>
            <div className='absolute bottom-4 left-2 z-[2] text-white'>
                <div className={`text-4xl font-semibold text-amber-400`}>{Number(props.animal.roomCount) > 1 ? `${props.animal.roomCount} Applicants` : `${props.animal.roomCount} Applicant`}</div>
                <div className='leading-2'>
                    <div className='text-lg'>{totalQuantity} x Persian Cats</div>
                    <div className='text-zinc-400 text-sm flex gap-1 items-center'>
                        {Number(props.animal.maleQuantityAvailable || 0) > 0 && <span>{Number(props.animal.maleQuantityAvailable || 0)} Male</span>}
                        {Number(props.animal.femaleQuantityAvailable || 0) > 0 && <span>{Number(props.animal.femaleQuantityAvailable || 0)} Female</span>}
                    </div>
                </div>
            </div>
            <div className='w-full h-[100%] absolute pointer-events-none rounded-md bg-gradient-to-r from-black to-transparent z-[1]'></div>
            <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} className='w-full h-28 rounded-md object-cover' alt='janwarmarkaz' />
        </div>
    )
}

export default AnimalRow