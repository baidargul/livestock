import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    room: any
}

const AnimalRow = (props: Props) => {
    console.log(props.room)
    const totalQuantity = Number(props.room.animal.maleQuantityAvailable || 0) + Number(props.room.animal.femaleQuantityAvailable || 0)
    return (
        <div className='relative rounded-md overflow-hidden cursor-pointer'>
            <div className='absolute bottom-4 left-2 z-[2] text-white'>
                <div className={`text-4xl font-semibold`}>{props.room.bids.length || 0} Messages</div>
                <div className='leading-2'>
                    <div className='text-lg'>{totalQuantity} x Persian Cats</div>
                    <div className='text-zinc-400 text-sm'>
                        {Number(props.room.animal.maleQuantityAvailable || 0) > 0 && <span>{Number(props.room.animal.maleQuantityAvailable || 0)} Male</span>}
                        {Number(props.room.animal.femaleQuantityAvailable || 0) > 0 && <span>{Number(props.room.animal.femaleQuantityAvailable || 0)} Female</span>}
                    </div>
                </div>
            </div>
            <div className='w-full h-[100%] absolute pointer-events-none rounded-md bg-gradient-to-r from-black to-transparent z-[1]'></div>
            <Image src={props.room.animal.images.length > 0 ? props.room.animal.images[0].image : images.chickens.images[1]} className='w-full h-28 rounded-md object-cover' alt='janwarmarkaz' />
        </div>
    )
}

export default AnimalRow