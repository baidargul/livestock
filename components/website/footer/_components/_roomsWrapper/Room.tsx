import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'
import { images } from '@/consts/images'
import { formalizeText } from '@/lib/utils'
import Image from 'next/image'
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
        animal && <BiddingWrapper animal={animal} room={props.room} staticStyle allowJoinRoomImmediately>
            <div className='grid grid-cols-2 gap-2 w-full cursor-pointer hover:bg-emerald-50 py-2 bg-white p-2 rounded-md drop-shadow-sm border border-zinc-200'>
                <div>
                    {/* <Image src={animal.images.length > 0 ? animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[100px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-cover' /> */}
                    <Image src={images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[100px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-cover' />
                </div>
                <div className='text-black'>
                    {props.room.demandId && props.room.demandId.length > 0 && <div className='p-1 px-2 bg-zinc-300 rounded text-xs scale-90 origin-top-left'>demand</div>}
                    <div className='font-semibold tracking-tight leading-tight text-xl mt-1'><span className='font-normal'>{Number(animal?.maleQuantityAvailable ?? 0) + Number(animal?.femaleQuantityAvailable ?? 0)} x</span> {formalizeText(animal.breed)} {String(animal.type).slice(0, animal.type.length - 1)}</div>
                    <div className='px-1'>
                        <div className='text-sm italic line-clamp-1'>{formalizeText(animal.title)}</div>
                    </div>
                    <div className='text-sm px-1 tracking-tight text-emerald-600 bg-emerald-50 p-1 rounded w-fit h-fit'>{unreadBids} new bid{unreadBids > 1 ? 's' : ''}</div>
                </div>
            </div>
        </BiddingWrapper>
    )
}

export default Room