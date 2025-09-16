import { images } from '@/consts/images'
import { useUser } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import React from 'react'
import { IoReturnUpBackSharp } from 'react-icons/io5'
import AuthorCard from './AuthorCard'
import UserCard from './UserCard'
import Message from './Message'

type Props = {
    animal: any
    currentRoom: any
    handleSelectCurrentRoom: (room: any) => void
}

const Chatroom = (props: Props) => {
    console.log(props.currentRoom)
    const currentRoom = props.currentRoom
    const user = useUser();
    const isAuthor = props.animal.userId === user?.id

    const totalQuantity = Number(currentRoom.maleQuantityAvailable || 0) + Number(currentRoom.femaleQuantityAvailable || 0)
    return (
        <div className='flex flex-col gap-2'>
            <div onClick={() => props.handleSelectCurrentRoom(null)} className='relative cursor-pointer'>
                <div className='absolute top-1 left-1 bg-white/50 z-[3] border border-white/30 p-2 px-4 rounded'>
                    <IoReturnUpBackSharp className='text-white' size={14} />
                </div>
                <div className='absolute bottom-1 left-2 z-[2] text-white'>
                    <div className='leading-2'>
                        <div className='text-sm'>{totalQuantity} x Persian Cats</div>
                        <div className='text-zinc-400 text-xs'>
                            {Number(currentRoom.maleQuantityAvailable || 0) > 0 && <span>{Number(currentRoom.maleQuantityAvailable || 0)} Male</span>}
                            {Number(currentRoom.femaleQuantityAvailable || 0) > 0 && <span>{Number(currentRoom.femaleQuantityAvailable || 0)} Female</span>}
                        </div>
                    </div>
                </div>
                <div className='w-full h-[100%] absolute pointer-events-none rounded-md bg-gradient-to-r from-black to-transparent z-[1]'></div>
                <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} className='w-full h-20 origin-top-left rounded-md object-cover' alt='janwarmarkaz' />
            </div>
            <div>
                {isAuthor && <AuthorCard room={currentRoom} />}
                {!isAuthor && <UserCard room={currentRoom} />}
            </div>
            <div className='flex flex-col gap-2'>
                {
                    currentRoom.bids.slice(currentRoom.bids.length - 3).map((bid: any, index: number) => {

                        return (
                            <Message key={`${bid.id}-${index}`} message={bid} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Chatroom