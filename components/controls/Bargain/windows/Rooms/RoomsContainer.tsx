import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import RoomRow from './RoomRow'

type Props = {
    animal: any
}

const RoomsContainer = (props: Props) => {
    return (
        <div className='flex flex-col gap-2'>
            <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} className='w-full h-44 rounded-md object-cover' alt='janwarmarkaz' />
            <div className='flex flex-col gap-2'>
                {
                    props.animal.rooms.map((room: any, index: number) => {

                        return (
                            <RoomRow key={`${room.key}-${index}`} room={room} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RoomsContainer