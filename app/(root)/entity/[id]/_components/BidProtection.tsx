'use client'
import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'
import Button from '@/components/ui/Button'
import { useRooms } from '@/hooks/useRooms'
import { useSession } from '@/hooks/useSession'
import { formatCurrency } from '@/lib/utils'
import { ChartCandlestickIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    animal: any
}

const BidProtection = (props: Props) => {
    const [user, setUser] = useState<any>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [bid, setBid] = useState<any>(null)
    const [room, setRoom] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)
    const rooms = useRooms((state: any) => state.rooms)
    const find = useRooms((state: any) => state.find)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            if (rawUser) {
                setUser(rawUser)
            }
        }
    }, [isMounted])

    useEffect(() => {
        if (rooms && user) {
            const room = find(props.animal.id, user.id, "userId")
            if (room) {
                setRoom(room)
                setBid(room.bids[room.bids.length - 1])
            }
        }
    }, [rooms, user])

    if (!user && !bid && !room) {
        return (
            <BiddingWrapper animal={props.animal} >
                {props.children}
            </BiddingWrapper>
        )
    }

    if (room && room.closedAt && room.userOfferAccepted === true) {
        return (
            <div className='w-full mb-4'>
                <div className='text-2xl text-center p-2 px-4 text-emerald-700'>
                    You have won the deal at <br />{formatCurrency(room?.closedAmount ?? 0)}
                </div>
                <div className='w-full'>
                    <Button variant='btn-primary' className='w-full'>Proceed to Pay</Button>
                </div>
            </div>
        )
    }
    if (room && room.closedAt && room.userOfferAccepted === false) {
        return (
            <div className='w-full mb-4'>
                <div className='text-2xl text-center p-2 px-4 text-amber-700'>
                    You have lost the deal at <br />{formatCurrency(room?.closedAmount ?? 0)}
                </div>
            </div>
        )
    }

    if (room && !room.closedAt) {
        return (
            <BiddingWrapper animal={props.animal}>
                <div className='w-full'>
                    <Button variant='btn-primary' className='w-full flex gap-2 justify-center text-center items-center'>
                        {!bid.isSeen && bid.user !== user.id && <div className='w-4 h-4 left-2 bg-amber-500 rounded-full'></div>} <ChartCandlestickIcon className='w-6 h-6' /><div>{bid.user.name}</div> <div>({formatCurrency(bid.price)})</div>
                    </Button>
                </div>
            </BiddingWrapper>
        )
    }

    return (
        <BiddingWrapper animal={props.animal}>
            {props.children}
        </BiddingWrapper>
    )
}

export default BidProtection