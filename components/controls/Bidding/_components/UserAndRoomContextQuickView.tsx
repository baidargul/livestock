
'use client'
import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
    animal: any
    otherUser: any
    room: any
    children: React.ReactNode
    isAuthor: boolean
}

const UserAndRoomContextQuickView = (props: Props) => {
    const [isToggled, setIsToggled] = useState(false)
    const totalAnimals = Number(props.room.maleQuantityAvailable) + Number(props.room.femaleQuantityAvailable)
    const runningValue = props.room.bids[props.room.bids.length - 1]?.price
    const perUnitValue = Number(Number(runningValue / totalAnimals).toFixed(0))
    const perUnitCost = Number(Number(calculatePricing({ ...props.animal, ...props.room }).price / totalAnimals).toFixed(0))
    const difference = Number(perUnitValue) - Number(perUnitCost)

    const handleToggle = (val: boolean) => {
        if (props.isAuthor && props.isAuthor === true) {
            setIsToggled(val)
        }
    }
    return (
        <div className='relative'>
            {isToggled && <div className='text-base font-normal absolute top-0 right-0 w-full min-w-[200px] min-h-[200px] bg-white shadow-sm rounded p-2 z-[1]'>
                <div className='flex gap-2 items-start justify-between'>
                    <div className='text-lg leading-4'>
                        {props.otherUser?.name}
                    </div>
                    <XIcon onClick={() => handleToggle(false)} className='cursor-pointer' />
                </div>
                <div className='text-xs tracking-tight'>{props.room.city ? `${formalizeText(props.room.city)}, ${formalizeText(props.room.province)}` : `${formalizeText(props.room.user.city)}, ${formalizeText(props.room.user.province)}`}</div>
                <div className='mt-4'>
                    <div className='font-semibold'>Demands</div>
                    <div className='text-xs'>
                        <div>
                            {props.room.maleQuantityAvailable} Males, {props.room.femaleQuantityAvailable} Females = {totalAnimals} {props.room.animal.type}
                        </div>

                        <div className='text-xs font-semibold mt-1'>Delivery:</div>
                        <div className='pr-4 flex gap-1 items-center'>
                            {
                                props.room.deliveryOptions.map((option: any, index: number) => {


                                    return (
                                        <div key={`${option}-${index}`} className='flex flex-col items-center text-center'>
                                            <DeliveryIcon icon={option} />
                                            <div className='text-xs'>{option === "SELLER_DELIVERY" ? "By Cargo" : "Self Pickup"}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
                <div className='mt-4 leading-5 scale-75 origin-top-left'>
                    <div className=''>
                        <div>
                            Posted:
                        </div>
                        <div className='text-base'>
                            {formatCurrency(perUnitCost)} per animal.
                        </div>
                    </div>
                    <div>
                        Offered <span className={`tracking-tight font-semibold ${perUnitValue > perUnitCost ? "text-green-700" : perUnitValue === perUnitCost ? "text-amber-700" : "text-red-700"}`}>{formatCurrency(perUnitValue)}</span> per animal.
                    </div>
                </div>
                <div>
                    Difference <span className={`tracking-tight font-semibold ${perUnitValue > perUnitCost ? "text-green-700" : perUnitValue === perUnitCost ? "text-amber-700" : "text-red-700"}`}>{formatCurrency(difference)}</span> per animal.
                </div>
            </div>}
            <div className='cursor-pointer' onClick={() => handleToggle(true)}>{props.children}</div>
        </div>
    )
}

export default UserAndRoomContextQuickView