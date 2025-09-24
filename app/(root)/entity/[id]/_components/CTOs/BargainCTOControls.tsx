'use client'
import BargainChatWrapper from '@/components/controls/Bargain/BargainChatWrapper'
import Button from '@/components/ui/Button'
import { Animal, Bids } from '@prisma/client'
import { CandlestickChartIcon, LockIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PostBiddingOptions from '../PostBiddingOptions'
import { useRooms } from '@/hooks/useRooms'
import { formatCurrency } from '@/lib/utils'
import { LuHandshake } from 'react-icons/lu'
type Props = {
    animal: Animal
    leads: any[]
    isChecking: boolean
    isCreating: boolean
    handleCreateLead: () => void
    postBiddingOptions: any
    setPostBiddingOptions: (options: any) => void
    user: any
    fixedAmount?: number
}

const BargainCTOControls = (props: Props) => {
    const [rooms, setRooms] = useState<any>([])
    const isAuthor = props.user?.id === props.animal.userId
    const user = props.user

    const Systemrooms = useRooms()
    const isFetching = useRooms((state: any) => state.isFetching)


    useEffect(() => {
        if (user && Systemrooms) {
            const thisAnimalRooms = Systemrooms?.rooms?.otherRooms?.filter((room: any) => room?.animalId === props.animal?.id)
            setRooms(thisAnimalRooms)
        }
    }, [user, Systemrooms])

    return (
        props.user && !isAuthor && <>
            {
                props.animal.allowBidding && isFetching &&
                <div className='w-full flex flex-col gap-2 justify-center items-center'>
                    <div className='w-full h-6 bg-zinc-200 animate-pulse'></div>
                    <div className='w-full h-28 bg-zinc-200 animate-pulse'></div>
                    <div className='w-[10%] ml-auto h-6 bg-zinc-200 animate-pulse'></div>
                </div>
            }
            {props.animal.allowBidding && props.isChecking === false && rooms.length > 0 && !isFetching &&
                <BargainChatWrapper animal={props.animal}>
                    <div className='flex flex-col gap-2'>
                        <div className='font-semibold tracking-tight'>You're bargaining for this animal</div>
                        <div className='cursor-pointer p-1 border border-zinc-300 rounded'>
                            {
                                rooms[0].bids.slice(0, 3).map((bid: any, index: number) => {

                                    return (
                                        <div key={`bid-${index}-${rooms[0].id}`} className={`flex border-b p-1 border-zinc-300 gap-1 justify-between items-center ${bid.selected && bid.userId === user.id ? "bg-emerald-100" : bid.selected && bid.userId !== user.id ? "bg-red-100" : ""}`}>
                                            <div className='flex gap-1 items-center'>{bid.selected && <LuHandshake className="text-emerald-600" />}{bid.userId === user.id ? "You" : bid.user.name}</div>
                                            <div className='flex gap-1 items-center'> {bid.isFinalOffer && <LockIcon size={14} className='text-amber-700' />}{formatCurrency(bid.price)}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='text-emerald-700 text-right w-full text-xs underline cursor-pointer'>Click to Bargain</div>
                    </div>
                </BargainChatWrapper>
            }
            {props.animal.allowBidding && rooms.length === 0 && !isFetching && <PostBiddingOptions directCTO directCTOAction={props.handleCreateLead} postBiddingOptions={props.postBiddingOptions} setPostBiddingOptions={props.setPostBiddingOptions} animal={{ ...props.animal, price: props.fixedAmount && props.fixedAmount > 0 ? props.fixedAmount : props.animal.price }} user={props.user}>
                <Button disabled={props.isChecking || props.isCreating} className='w-full mt-2'>{props.isCreating ? "..." : `Create bargain request`}</Button>
            </PostBiddingOptions>}
        </>
    )
}

export default BargainCTOControls