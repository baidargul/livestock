import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'
import { formatCurrency } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import RoomStatus from './RoomStatus'

type Props = {
    room: any
    user: any
    type: "seller" | "buyer"
}

const Room = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [unreadBids, setUnreadBids] = useState(0)
    const [targetRoomKey, setTargetRoomKey] = useState({
        key: '',
        refill: () => {
            const temp = { ...targetRoomKey, key: props.room.key }
            setTargetRoomKey(temp)
        },
        clear: () => {
            const temp = { ...targetRoomKey, key: '' }
            setTargetRoomKey(temp)
        }
    })
    const [bid, setBid] = useState<any>(null)
    const animal = props.room.animal

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            if (props.user && props.room) {
                const calculateUnreadBids = () => {
                    let count = 0
                    props.room.bids.forEach((bid: any) => {
                        if (bid.isSeen === false && bid.userId !== props.user?.id) {
                            count = count + 1
                        }
                    })
                    setUnreadBids(count)
                }
                calculateUnreadBids()
            }
        }
        targetRoomKey.refill()
        const rawbid = props.room.bids.length > 0 ? props.room.bids[props.room.bids.length - 1] : null
        setBid(rawbid)
    }, [props.room, props.user])


    const totalQuantity = Number(props.room.maleQuantityAvailable ?? 0) + Number(props.room.femaleQuantityAvailable ?? 0)
    const isAuthor = props.room.user.id === props.user?.id
    return (
        animal && props.user && <BiddingWrapper animal={animal} room={props.room} targetRoomKey={targetRoomKey} staticStyle>
            <div className='flex flex-col gap-1 relative cursor-pointer'>
                <div className={`text-xs p-1 px-2 max-w-[120px] flex gap-1 items-center truncate -pb-1 absolute left-0 -top-6 rounded-t-md border-t border-x ${bid?.userId === props.user.id ? "bg-zinc-100 border-transparent" : "bg-amber-50 border-amber-200"}`}>
                    <RoomStatus room={props.room} />
                    {isAuthor ? props.room.author.name : props.room.user.name}
                </div>
                <div className='text-black'>
                    {props.room.demandId && props.room.demandId.length > 0 && <div className='p-1 px-2 bg-zinc-300 rounded text-xs scale-90 origin-top-left'>demand</div>}
                    <div className={`${bid?.userId === props.user?.id ? "bg-zinc-100 border-transparent" : "bg-amber-50 border-amber-200"} border  text-xs rounded-md rounded-tl-none w-full p-2 flex justify-between items-center`}>
                        <div className='text-center flex flex-col justify-center items-center'>
                            <div>Quantity</div>
                            <div className='font-bold text-base'>{totalQuantity}</div>
                        </div>
                        {bid && <div className='text-center flex flex-col justify-center items-center'>
                            <div>Running Bid</div>
                            <div className={`font-bold text-base  ${bid?.user?.id === props.user?.id ? "text-zinc-700" : "text-amber-700"}`}>{formatCurrency(bid.price ?? 0)}</div>
                        </div>}
                    </div>
                </div>
            </div>
        </BiddingWrapper>
    )
}

export default Room