import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React from 'react'
import LastMessage from './LastMessage'

type Props = {
    room: any
    handleSelectAnimal: (animal: any) => void
    handleSelectCurrentRoom: (room: any) => void
}

const RoomRow = (props: Props) => {
    const user = useUser()
    const room = props.room
    const isBuyingRoom = room.userId === user.id

    if (isBuyingRoom) {
        return (
            <div onClick={() => props.handleSelectCurrentRoom(room)} className='bg-white cursor-pointer p-2 rounded-md flex justify-between items-center'>
                <div>
                    <div className='font-semibold line-clamp-1 text-black text-xl'>
                        {room.animal.user.name}
                    </div>
                    <div className='text-zinc-500 text-sm'>
                        {formalizeText(room.animal.city)}, {formalizeText(room.animal.province)}
                    </div>
                </div>
                <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
            </div>
        )
    } else {
        return (
            <div onClick={() => props.handleSelectCurrentRoom(room)} className='bg-white cursor-pointer p-2 rounded-md flex justify-between items-center'>
                <div>
                    <div className='font-semibold line-clamp-1 text-black text-xl'>
                        {room.user.name}
                    </div>
                    <div className='text-zinc-500 text-sm'>
                        {formalizeText(room.city)}, {formalizeText(room.province)}
                    </div>
                </div>
                <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
            </div>
        )
    }
}

export default RoomRow