import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'
import { formalizeText } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type Props = {
    room: any
    user: any
}

const Room = (props: Props) => {
    const [unreadBids, setUnreadBids] = useState(0)
    const animal = props.room.animal

    useEffect(() => {
        if (props.user) {

            const calculateUnreadBids = () => {
                let count = 0
                props.room.bids.forEach((bid: any) => {
                    if (bid.isSeen === false && bid.userId !== props.user.id) {
                        count = count + 1
                    }
                })
                setUnreadBids(count)
            }
            calculateUnreadBids()
        }
    }, [props.room, props.user])


    return (
        <BiddingWrapper animal={animal} room={props.room} staticStyle allowJoinRoomImmediately>
            <div className='grid grid-cols-2 w-full cursor-pointer hover:bg-emerald-50'>
                <div>
                    <div className='font-semibold tracking-tight leading-tight text-xl'><span className='font-normal'>{Number(animal.maleQuantityAvailable) + Number(animal.femaleQuantityAvailable)} x</span> {formalizeText(animal.type)} {animal.breed}</div>
                    <div className='px-1'>
                        <div className='text-sm tracking-tight italic'>{formalizeText(animal.title)}</div>
                    </div>
                </div>
                <div className='ml-auto '>
                    <div className='text-sm px-1 tracking-tight text-emerald-600 bg-emerald-50 p-1 rounded w-fit h-fit'>{unreadBids} new bid{unreadBids > 1 ? 's' : ''}</div>
                </div>
            </div>
        </BiddingWrapper>
    )
}

export default Room