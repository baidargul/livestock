'use client'
import { LuHandshake } from "react-icons/lu";
import { formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { useEffect, useState } from 'react'
import LastMessage from './LastMessage'
import { Bids } from '@prisma/client'
import { bidRoom } from '@/actions/serverActions/server/partials/bidroom'

type Props = {
    room: any
    handleSelectAnimal: (animal: any) => void
    handleSelectCurrentRoom: (room: any) => void
}

const RoomRow = (props: Props) => {
    const [closedBid, setClosedBid] = useState<Bids | null>(null)
    const user = useUser()
    const room = props.room
    const isBuyingRoom = room.userId === user.id
    const isSelfPickUp = !room.deliveryOptions.includes("SELLER_DELIVERY")

    const isDealClosed = room.closedAt && String(room.closedAt).length > 0

    useEffect(() => {
        if (isDealClosed && user) {
            let selectedBid = null
            room.bids.forEach((bid: Bids) => {
                if (bid.selected && bid.selected === true) {
                    selectedBid = bid
                }
            })
            if (selectedBid) {
                setClosedBid(selectedBid)
            } else {
                setClosedBid(null)
            }
        }
    }, [isDealClosed, user])

    if (isBuyingRoom) {
        return (
            <div onClick={() => props.handleSelectCurrentRoom(room)} className='bg-white cursor-pointer p-2 rounded-md flex justify-between items-center'>
                <div>
                    <div className={`font-semibold line-clamp-1 text-black text-xl`}>
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
                    <div className={`font-semibold line-clamp-1 flex items-center gap-1 text-black text-xl ${closedBid && closedBid.userId !== user.id ? 'line-through text-zinc-600' : ''}`}>
                        {closedBid && <LuHandshake className={`${closedBid && closedBid.userId !== user.id ? "hidden" : "text-emerald-700 fill-emerald-50 "}`} />}
                        {room.user.name}
                    </div>
                    {closedBid && closedBid.userId !== user.id ? <div className='text-zinc-500 text-sm'>
                        Rejected
                    </div> :
                        <div className='text-zinc-500 text-sm'>
                            {!isSelfPickUp ? `${formalizeText(room.city)}, ${formalizeText(room.province)}` : "I'll self pickup"}
                        </div>
                    }
                </div>
                <div className={`${closedBid && closedBid.userId !== user.id ? 'line-through text-zinc-600' : ''}`}>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
                </div>
            </div>
        )
    }
}

export default RoomRow