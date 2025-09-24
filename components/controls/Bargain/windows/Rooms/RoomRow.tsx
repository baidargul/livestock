'use client'
import { LuHandshake } from "react-icons/lu";
import { formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { useEffect, useState } from 'react'
import LastMessage from './LastMessage'
import { Bids } from '@prisma/client'
import { bidRoom } from '@/actions/serverActions/server/partials/bidroom'
import { MdOutlineCancel } from "react-icons/md";

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
                {/* BUYER WON */}
                {closedBid && closedBid.userId === user.id && <>
                    <div>
                        <div className={`font-semibold line-clamp-1 text-black text-xl flex items-center gap-1`}>
                            <LuHandshake className="text-emerald-600" /> {room.animal.user.name}
                        </div>
                        <div className='text-zinc-500 text-sm'>
                            {formalizeText(room.animal.city)}, {formalizeText(room.animal.province)}
                        </div>
                    </div>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
                </>}

                {/* SELLER REJECTED */}
                {closedBid && closedBid.userId !== user.id && <>
                    <div>
                        <div className={`font-semibold line-clamp-1 flex gap-1 items-center text-black text-xl`}>
                            <MdOutlineCancel className="text-red-600" /> {room.animal.user.name}
                        </div>
                        <div className='text-zinc-500 text-sm'>
                            {/* {formalizeText(room.animal.city)}, {formalizeText(room.animal.province)} */}
                            Seller has rejected your offer
                        </div>
                    </div>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
                </>}

                {/* ON GOING BIDS */}
                {!closedBid && <>
                    <div>
                        <div className={`font-semibold line-clamp-1 text-black text-xl`}>
                            {room.animal.user.name}
                        </div>
                        <div className='text-zinc-500 text-sm'>
                            {formalizeText(room.animal.city)}, {formalizeText(room.animal.province)}
                        </div>
                    </div>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
                </>}
            </div>
        )
    } else {
        const isSelfPickUp = !room.deliveryOptions.includes("SELLER_DELIVERY")
        return (
            <div onClick={() => props.handleSelectCurrentRoom(room)} className='bg-white cursor-pointer p-2 rounded-md flex justify-between items-center'>
                {/* YOU ACCEPTED BUYER*/}
                {closedBid && closedBid.userId === user.id && <>
                    <div>
                        <div className={`font-semibold line-clamp-1 text-black text-xl flex items-center gap-1`}>
                            <div>❌</div> <div className="line-clamp-1">{room.user.name}</div>
                        </div>
                        <div className='text-zinc-500 text-sm'>
                            {/* {formalizeText(room.animal.city)}, {formalizeText(room.animal.province)} */}
                            You've rejected this offer
                        </div>
                    </div>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />

                </>}

                {/* YOU REJECTED BUYER */}
                {closedBid && closedBid.userId !== user.id && <>
                    <div>
                        <div className={`font-semibold line-clamp-1 text-black text-xl flex items-center gap-1`}>
                            <LuHandshake className="text-emerald-600" size={24} /> <div className="line-clamp-1">{room.user.name}</div>
                        </div>
                        <div className='text-zinc-500 text-sm'>
                            {/* {isSelfPickUp ? "He'll Self Pick up" : `${formalizeText(room.city)}, ${formalizeText(room.province)}`} */}
                            Offer accepted
                        </div>
                    </div>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
                </>}

                {/* ON GOING BIDS */}
                {!closedBid && <>
                    <div>
                        <div className={`font-semibold line-clamp-1 text-black text-xl`}>
                            {room.user.name}
                        </div>
                        <div className='text-zinc-500 text-sm'>
                            {formalizeText(room.city)}, {formalizeText(room.province)}
                        </div>
                    </div>
                    <LastMessage lastBid={room.bids[room.bids.length - 1] ?? null} />
                </>}
            </div>
        )
    }
}

export default RoomRow