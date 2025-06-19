import RatingBar from '@/components/website/ratings/RatingBar'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { SquareUserIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    animal?: Animal | any
}

const SectionProductListRow = (props: Props) => {

    const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)

    const sellerCargo = props.animal?.deliveryOptions.includes("SELLER_DELIVERY")
    const selfPickup = props.animal?.deliveryOptions.includes("SELF_PICKUP")

    return (
        <Link href={`/entity/${props.animal?.id}`} className='w-full'>
            <div className="flex items-center gap-0 w-full">
                <div className='relative bg-zinc-50 border-l border-y border-zinc-200/40'>
                    {props.animal?.deliveryOptions.length > 0 && <div className='absolute bottom-2 left-2 bg-emerald-100 rounded-md p-1 flex gap-1 items-center text-emerald-600'>
                        {sellerCargo && <div title='SELLER CARGO'>
                            <TruckIcon size={20} />
                        </div>}
                        {selfPickup && <div title='SELF PICKUP'>
                            <SquareUserIcon size={20} />
                        </div>}
                    </div>}
                    <Image src={props.animal?.images[0].image} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='min-w-32 w-40 h-40 select-none object-cover rounded-l-lg' />
                </div>
                <div className='p-2 pl-4 w-full bg-zinc-50 border-r border-y border-zinc-200/40 rounded-r-xl'>
                    <div className='text-[1rem] transition-all duration-200 ease-in-out w-[90%] sm:w-auto sm:text-xl font-semibold truncate text-balance'>{formalizeText(props.animal?.title)}</div>
                    <div className='flex subheading1 gap-1 items-center -mt-1'>
                        <div className='font-medium'>{totalQuantity}</div> <div className='font-medium'>{`${formalizeText(props.animal?.type)} ${props.animal?.breed}`}</div>
                    </div>
                    <div>
                        {Number(props.animal.maleQuantityAvailable ?? 0) > 0 && <span className='text-sm tracking-tight'>{props.animal.maleQuantityAvailable} Male</span>}
                        {Number(props.animal.femaleQuantityAvailable ?? 0) > 0 && <span className='text-sm tracking-tight'> {props.animal.femaleQuantityAvailable} Female</span>}
                    </div>
                    <div className='flex gap-1 items-center my-2'>
                        <div className='font-medium w-[70%] tracking-tight text-base text-balance leading-4'>
                            {props.animal?.user?.name ?? "Hamza poultry services & Farms"}
                        </div>
                        <div>
                            <RatingBar readonly defaultRating={4} />
                        </div>
                    </div>
                    <div className='text-xl mt-2 text-emerald-600 tracking-wide font-bold'>
                        {formatCurrency(calculatePricing(props.animal).price)}
                    </div>
                </div>
            </div>
        </Link >
    )
}

export default SectionProductListRow