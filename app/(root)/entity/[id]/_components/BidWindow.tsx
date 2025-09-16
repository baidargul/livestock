'use client'
import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { useRooms } from '@/hooks/useRooms'
import { formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
}

const BidWindow = (props: Props) => {
    const [rooms, setRooms] = useState([])
    const user = useUser()
    const isFetching = useRooms((state: any) => state.isFetching)
    const Systemrooms = useRooms()

    useEffect(() => {
        if (user && Systemrooms) {
            const thisAnimalRooms = Systemrooms?.rooms?.myRooms?.filter((room: any) => room?.animalId === props.animal?.id)
            //set first 4 only
            thisAnimalRooms.splice(4)
            setRooms(thisAnimalRooms)
        }
    }, [user, Systemrooms])


    return (
        <div className='px-3 cursor-pointer'>
            <div className='p-1 bg-zinc-100 border border-zinc-200 font-mono '>Active bargainers ({isFetching ? "..." : rooms.length})</div>
            <div className='p-1 text-xs relative'>
                {
                    isFetching && <div>
                        {
                            [...Array(4)].map((_, index) => {
                                return (
                                    <div key={index}>
                                        <div className='w-full grid grid-cols-[2fr_1fr] gap-2 border-b border-zinc-200 pb-2'>
                                            <div className='w-full mt-2 p-2 animate-pulse bg-zinc-100 border border-zinc-200 rounded-md -mx-1'>
                                            </div>
                                            <div className='w-full mt-2 p-2 animate-pulse bg-zinc-100 border border-zinc-200 rounded-md -mx-1'>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                {
                    !isFetching && rooms.map((room: any, index: number) => {

                        return (
                            <div key={`${room.key}${room.id}-${index}`}>
                                <div className='w-full grid grid-cols-[1fr_1fr] border-b border-zinc-200 pb-2'>
                                    <div>
                                        <div className='truncate'>
                                            {room.user.name}
                                        </div>
                                        {
                                            room.deliveryOptions.includes("SELF_PICKUP") ? <div className='text-xs text-zinc-600'>Self Pickup</div> : <div>{formalizeText(room.city)}, {formalizeText(room.province)}</div>
                                        }
                                    </div>
                                    <div className='ml-auto text-right'>
                                        {formatCurrency(room.bids[0]?.price ?? 0)}
                                        <ElapsedTimeControl date={room.bids[0]?.createdAt} />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {!isFetching && <div className='w-full h-[50%] absolute bottom-0 left-0 bg-gradient-to-t from-white to-transparent z-[1]'></div>}
            </div>
        </div>
    )
}

export default BidWindow