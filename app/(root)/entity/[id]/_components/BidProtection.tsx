'use client'
import BiddingWrapper, { bidsReverse } from '@/components/controls/Bidding/BiddingWrapper'
import Button from '@/components/ui/Button'
import { useRooms } from '@/hooks/useRooms'
import { useSession } from '@/hooks/useSession'
import { formatCurrency } from '@/lib/utils'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import { deserialize, serialize } from 'bson'
import { ChartCandlestickIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PostBiddingOptions from './PostBiddingOptions'
import LeadsWindow from './LeadsWindow'
import CreateLeadButton from './CreateLeadButton'

type Props = {
    children: React.ReactNode
    animal: any
}

const BidProtection = (props: Props) => {
    const user = useUser()
    const [isMounted, setIsMounted] = useState(false)
    const [bid, setBid] = useState<any>(null)
    const [room, setRoom] = useState<any>(null)
    const [isOpeningBidRoom, setIsOpeningBidRoom] = useState(false)
    const [postBiddingOptions, setPostBiddingOptions] = useState<{
        deliveryOptions: string[],
        maleQuantityAvailable: number,
        femaleQuantityAvailable: number,
        amount: number,
        posted: boolean
        province: string,
        city: string
    }>({
        deliveryOptions: [],
        maleQuantityAvailable: 0,
        femaleQuantityAvailable: 0,
        amount: 0,
        posted: false
        , province: ""
        , city: ""
    })
    const rooms = useRooms((state: any) => state.rooms)
    const isFetching = useRooms((state: any) => state.isFetching)
    const find = useRooms((state: any) => state.find)
    const socket = useSocket()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (socket) {
            socket?.on("user-joined-bidroom", (binaryData) => {
                const { room, userId }: any = deserialize(binaryData);
                const route = window.location.pathname;
                if (route === `/entity/${room.animalId}` && userId === user?.id) {
                    setIsOpeningBidRoom(false)
                }
            });

            // return () => {
            //     socket?.off("user-joined-bidroom");
            // };
        }
    }, [socket])

    useEffect(() => {
        if (rooms && user) {
            const room = find(props.animal.id, user.id, "userId")
            setRoom(room)
            setBid(room ? room.bids[room.bids.length - 1] : null)
        }
    }, [rooms, user])



    const handleCloseBidRoom = async () => {
        if (socket) {
            if (room && user) {
                socket.emit("close-bidroom", serialize({ room, userId: user.id }));
            }
        }
    }

    if (!user) {
        return (
            <div className='w-full bg-zinc-100 p-2 border-b-2 border-zinc-200 flex justify-center items-center text-center'>
                <div className='text-sm'>⚠️ Please login to bid</div>
            </div>
        )
    }

    // IF NOT AUTHOR AND HAS NOT STARTED BIDDING YET
    if (!room && props.animal.userId !== user?.id && !isFetching) {
        return (
            <PostBiddingOptions postBiddingOptions={postBiddingOptions} setPostBiddingOptions={setPostBiddingOptions} animal={props.animal} user={user}>
                {props.children}
            </PostBiddingOptions>
        )
    }

    if (!bid) {
        return (
            <BiddingWrapper animal={props.animal} >
                {props.children}
            </BiddingWrapper>
        )
    }

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
                <CreateLeadButton animal={props.animal} />
                {/* <div className='text-2xl text-center p-2 px-4 text-emerald-700'>
                    You have won the deal at <br />{formatCurrency(room?.closedAmount ?? 0)}
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <Button variant='btn-primary' className='w-full'>Proceed to Pay</Button>
                    <Button variant='btn-secondary' onClick={handleCloseBidRoom} className='w-full'>Withdraw Deal</Button>
                </div> */}
            </div>
        )
    }
    if (room && room.closedAt && room.userOfferAccepted === false) {
        return (
            <div className='w-full mb-4'>
                <div className='text-2xl text-center p-2 px-4 text-amber-700'>
                    You have lost the deal at <br />{formatCurrency(room?.closedAmount ?? 0)}
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <Button variant='btn-secondary' onClick={handleCloseBidRoom} className='w-full'>Withdraw</Button>
                </div>
            </div>
        )
    }

    if (room && !room.closedAt) {
        return (
            <BiddingWrapper animal={props.animal}>
                <div className='w-full cursor-pointer' onClick={() => setIsOpeningBidRoom(true)}>
                    <div className='text-xs p-1 px-2 bg-emerald-700 text-white rounded-t w-fit'>You're currently bargaining on this animal</div>
                    <div className='w-full rounded-b border-t border-t-emerald-700/30 bg-gradient-to-r from-emerald-100 via-white to-zinc-50 p-2 flex gap-2 justify-evenly text-center items-center'>
                        <div>
                            <div className='flex justify-between items-center px-1'>
                                {!bid.isSeen && bid.user !== user.id && <div className='w-4 h-4 left-2 bg-amber-500 rounded-full line-clamp-1'></div>} <ChartCandlestickIcon className='w-6 h-6' /><div className='line-clamp-1 -ml-2'>{user?.id === bid.userId ? "You" : bid.user.name}</div>
                            </div>
                            <div className='text-start pl-13'>{formatCurrency(bid.price)}</div>
                        </div>
                        <div className={`p-2 ${isOpeningBidRoom ? "bg-amber-700" : "bg-emerald-700"} text-nowrap  text-white rounded`}>{isOpeningBidRoom ? `Loading Bargains` : `Show Bargains`}</div>
                    </div>
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