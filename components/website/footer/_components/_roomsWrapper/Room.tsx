import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'
import { images } from '@/consts/images'
import { formalizeText, formatCurrency, TrimString } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    room: any
    user: any
    type: "seller" | "buyer"
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
        animal && props.user && <BiddingWrapper animal={animal} room={props.room} staticStyle allowJoinRoomImmediately>
            <div className='flex flex-col gap-1'>
                <div className='text-black'>
                    {props.room.demandId && props.room.demandId.length > 0 && <div className='p-1 px-2 bg-zinc-300 rounded text-xs scale-90 origin-top-left'>demand</div>}
                    <div className='tracking-tight leading-tight line-clamp-1 mt-1'>{props.type === "seller" ? props.room.user.name : props.room.author.name}</div>
                    <div className='px-1'>
                        <div className='text-xs scale-90 origin-top-left tracking-widest text-zinc-400 uppercase line-clamp-1'>{formalizeText(props.room.animal.city)}, {formalizeText(props.room.animal.province)}</div>
                    </div>
                    <div className=''>
                        <ThatOneBid bids={props.room.bids} user={props.user} index={1} className={`font-semibold tracking-wide ${props.room.bids[props.room.bids.length - 1]?.isSeen && props.room.bids[props.room.bids.length - 1]?.name !== props.user.name ? "bg-emerald-50" : "bg-amber-50"}`} />
                        <ThatOneBid bids={props.room.bids} user={props.user} index={2} className='opacity-50 bg-zinc-100' />
                        {/* <ThatOneBid bids={props.room.bids} user={props.user} index={3} className='opacity-10 bg-zinc-100' /> */}
                    </div>
                </div>
            </div>
        </BiddingWrapper>
    )
}

export default Room


const ThatOneBid = ({ bids, user, index, className }: { bids: any[], user: any, index: number, className?: string }) => {
    if (bids.length === 0) return null

    const isValidDemand: any = (Number(bids.length) - Number(index) > -1)
    if (!isValidDemand) return null


    return (
        <div className={`flex justify-between items-center tracking-tight border-b border-zinc-300 p-1 ${className}`}>
            <div className='text-sm px-1'>{TrimString(bids[bids.length - index]?.user.name === user.name ? 'You' : bids[bids.length - index]?.user.name, 8)}</div>
            <div className='text-sm px-1'>{formatCurrency(bids[bids.length - index]?.price)}</div>
        </div>
    )
}