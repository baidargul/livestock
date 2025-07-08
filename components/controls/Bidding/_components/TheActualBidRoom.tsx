import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import { calculatePricing, formatCurrency } from '@/lib/utils'
import { ChevronLeftIcon } from 'lucide-react'
import React from 'react'

type Props = {
    handleLeaveRoom: any
    isAuthor: any
    socketState: any
    activeBidRoom: any
    animal: any
}

const TheActualBidRoom = (props: Props) => {
    return (
        <div className=''>
            <div className='text-xl font-semibold flex justify-between items-center mt-1'>
                <div className='flex items-center gap-1'>
                    <div><ChevronLeftIcon onClick={() => props.handleLeaveRoom(!props.isAuthor)} className='w-6 h-6 cursor-pointer' /></div>
                    <div className='flex items-center gap-1'>{props.socketState.isOtherUserConnected ? <div className='w-2 h-2 bg-emerald-500 rounded-full'></div> : <div className='w-2 h-2 bg-amber-500 rounded-full'></div>} <div className='line-clamp-1'>{props.isAuthor ? props.activeBidRoom.user.name : props.activeBidRoom.author.name}<div className='text-xs font-normal italic -mt-1'>{props.isAuthor ? "Buyer" : "Seller"}</div></div></div>
                </div>
                <div className='text-sm tracking-wide text-nowrap'>
                    {props.activeBidRoom.bids.length > 0 && <div>
                        <div className='p-1 px-2 text-center bg-amber-100 rounded-md'>
                            {formatCurrency(props.activeBidRoom.bids.length > 0 && props.activeBidRoom.bids[props.activeBidRoom.bids.length - 1]?.price)}
                        </div>
                        <div className='p-1 px-2 text-center border-t pt-1 border-zinc-300'>
                            {formatCurrency(calculatePricing(props.animal).price)}
                        </div>
                    </div>}
                </div>
            </div>
            <div className="text-xs tracking-wide -mt-3 px-6 flex gap-1 items-center">
                <div className='border-r-2 border-zinc-300 pr-4'>
                    {
                        props.activeBidRoom.deliveryOptions.map((option: any, index: number) => <DeliveryIcon icon={option} key={`${option}-${index}`} />)
                    }
                </div>
                {Object.entries({ male: props.activeBidRoom.maleQuantityAvailable, female: props.activeBidRoom.femaleQuantityAvailable }).filter(([_, value]) => value > 0).map(([key, value]) => `${value} ${key.charAt(0).toUpperCase()}${key.slice(1)}`).join(", ")}
            </div>
        </div>
    )
}

export default TheActualBidRoom