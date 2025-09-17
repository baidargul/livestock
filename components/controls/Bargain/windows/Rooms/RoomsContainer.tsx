import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import RoomRow from './RoomRow'
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useUser } from '@/socket-client/SocketWrapper';
type Props = {
    animal: any
    handleSelectAnimal: (animal: any) => void
    handleSelectCurrentRoom: (room: any) => void
    disableAnimalChange?: boolean
}

const RoomsContainer = (props: Props) => {
    const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)

    const handleGoBack = () => {
        if (!props.disableAnimalChange) {
            props.handleSelectAnimal(null)
        }
    }

    console.log(props.animal)

    return (
        <div className='flex flex-col gap-2'>
            <div onClick={handleGoBack} className={`relative ${props.disableAnimalChange ? "cursor-default" : "cursor-pointer"} `}>
                {!props.disableAnimalChange && <div className='absolute top-1 left-1 bg-white/50 border border-white/30 z-[3] p-2 px-4 rounded'>
                    <IoReturnUpBackSharp className='text-white' size={14} />
                </div>}
                <div className='absolute bottom-4 left-2 z-[2] text-white'>
                    <div className={`text-4xl font-semibold text-amber-400`}>{Number(props.animal.roomCount) > 1 ? `${props.animal.roomCount} Applicants` : `${props.animal.roomCount} Applicant`}</div>
                    <div className='leading-2'>
                        <div className='text-lg'>{totalQuantity} x Persian Cats</div>
                        <div className='text-zinc-400 text-sm'>
                            {Number(props.animal.maleQuantityAvailable || 0) > 0 && <span>{Number(props.animal.maleQuantityAvailable || 0)} Male</span>}
                            {Number(props.animal.femaleQuantityAvailable || 0) > 0 && <span>{Number(props.animal.femaleQuantityAvailable || 0)} Female</span>}
                        </div>
                    </div>
                </div>
                <div className='w-full h-[100%] absolute pointer-events-none rounded-md bg-gradient-to-r from-black to-transparent z-[1]'></div>
                <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} className='w-full h-44 rounded-md object-cover' alt='janwarmarkaz' />
            </div>
            <div className='flex flex-col gap-2'>
                {
                    props.animal.rooms.map((room: any, index: number) => {

                        return (
                            <RoomRow handleSelectCurrentRoom={props.handleSelectCurrentRoom} handleSelectAnimal={props.handleSelectAnimal} key={`${room.key}-${index}`} room={room} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RoomsContainer