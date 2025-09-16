import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import { formalizeText } from '@/lib/utils'
import React from 'react'
import { FaShippingFast } from 'react-icons/fa'

type Props = {
    room: any
}

const AuthorCard = (props: Props) => {
    const room = props.room
    return (
        <div className='p-2 bg-white rounded-md'>
            <div className='text-2xl'>{room.user.name}</div>
            <div className='text-sm text-zinc-600'>
                {Number(room.maleQuantityAvailable || 0) > 0 && <span>{Number(room.maleQuantityAvailable || 0)} Male</span>}
                {Number(room.femaleQuantityAvailable || 0) > 0 && <span>{Number(room.femaleQuantityAvailable || 0)} Female</span>}
            </div>
            <div className='-ml-3'>
                {
                    room.deliveryOptions.map((opt: any, index: number) => {
                        return (
                            <div key={`${opt}-${index}`} className='flex gap-1 items-center text-sm'>
                                <DeliveryIcon icon={opt} />
                                {
                                    opt === "SELLER_DELIVERY" ? "He'll Cargo to me" : "I'll Self Pick up from him"
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className='grid grid-cols-3 w-full place-items-center'>
                <div className='text-sm'>
                    {formalizeText(room.animal.city)}, {formalizeText(room.animal.province)}
                </div>
                <FaShippingFast size={24} />
                <div className='text-sm'>
                    {formalizeText(room.city)}, {formalizeText(room.province)}
                </div>
            </div>
        </div>
    )
}

export default AuthorCard