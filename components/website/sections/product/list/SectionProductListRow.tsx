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

    const totalQuantity = Number(props.animal?.maleQuantityAvailable || 0) + Number(props.animal?.femaleQuantityAvailable || 0)

    const sellerCargo = props.animal?.deliveryOptions.includes("SELLER_DELIVERY")
    const selfPickup = props.animal?.deliveryOptions.includes("SELF_PICKUP")

    return (
        <Link href={`/entity/${props.animal?.id}`} className='w-full p-2 bg-white hover:outline-2 hover:outline-zinc-300 group rounded-md drop-shadow-lg h-full flex flex-col justify-between'>
            <div className="flex flex-col items-center gap-0">
                <div className='relative w-full bg-black border-l border-y border-zinc-200/40 rounded-md overflow-hidden'>
                    {props.animal?.deliveryOptions.length > 0 && <div className='absolute bottom-2  z-10 right-2 bg-white rounded p-1 flex gap-1 items-center text-zinc-700 border border-zinc-500 drop-shadow-sm'>
                        {sellerCargo && <div title='SELLER CARGO'>
                            <TruckIcon size={20} />
                        </div>}
                        {selfPickup && <div title='SELF PICKUP'>
                            <SquareUserIcon size={20} />
                        </div>}
                    </div>}
                    {props.animal?.city && props.animal?.province && props.animal?.city.length > 0 && props.animal?.province.length > 0 && <div className='absolute z-20 text-white group-hover:opacity-0 transition-all duration-300 ease-in-out text-center tracking-tight bottom-2 left-0 pl-2 text-xs p-1 bg-gradient-to-r from-black to-transparent'>{formalizeText(props.animal?.city)}, {formalizeText(props.animal?.province)}</div>}
                    <div className='bg-gradient-to-t from-black/50 to-transparent w-full h-[40%] absolute bottom-0 left-0'></div>
                    <Image src={props.animal?.images[0].image} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[200px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-cover' />
                </div>
                <div className='w-full pt-4'>
                    <div className='transition-all duration-200 ease-in-out w-[90%] sm:w-auto text-xl font-semibold line-clamp-1 text-balance'>{formalizeText(props.animal?.title)}</div>
                    <div className='flex subheading1 gap-1 items-center -mt-1'>
                        <div className='tracking-wide'>{totalQuantity}</div> <div className=''>{`${formalizeText(props.animal?.type)} ${props.animal?.breed}`}</div>
                    </div>
                    <div className='tracking-widest'>
                        {Number(props.animal?.maleQuantityAvailable ?? 0) > 0 && <span className='text-sm'>{props.animal?.maleQuantityAvailable} Male</span>}
                        {Number(props.animal?.femaleQuantityAvailable ?? 0) > 0 && <span className='text-sm'> {props.animal?.femaleQuantityAvailable} Female</span>}
                    </div>
                    {props.animal?.user?.name && props.animal?.user?.name.length > 0 && <div className='flex flex-col gap-1 my-2'>
                        <div className='font-medium text-zinc-700 tracking-tight text-base text-balance leading-4'>
                            {props.animal?.user?.name}
                        </div>
                        <div>
                            <RatingBar readonly defaultRating={4} />
                        </div>
                    </div>}
                </div>
            </div>
            <div className='text-2xl sm:text-xl md:text-lg text-nowrap text-right text-emerald-600 tracking-wide font-bold'>
                {formatCurrency(calculatePricing(props.animal).price)}
            </div>
        </Link >
    )
}

export default SectionProductListRow