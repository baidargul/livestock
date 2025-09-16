import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import RoomRow from './RoomRow'
import { IoReturnUpBackSharp } from "react-icons/io5";
type Props = {
    animal: any
    handleSelectAnimal: (animal: any) => void
}

const RoomsContainer = (props: Props) => {
    return (
        <div className='flex flex-col gap-2'>
            <div onClick={() => props.handleSelectAnimal(null)} className='relative cursor-pointer'>
                <div className='absolute top-1 left-1 bg-black/50 p-2 px-4 rounded'>
                    <IoReturnUpBackSharp className='text-white' size={14} />
                </div>
                <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} className='w-full h-44 rounded-md object-cover' alt='janwarmarkaz' />
            </div>
            <div className='flex flex-col gap-2'>
                {
                    props.animal.rooms.map((room: any, index: number) => {

                        return (
                            <RoomRow handleSelectAnimal={props.handleSelectAnimal} key={`${room.key}-${index}`} room={room} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RoomsContainer