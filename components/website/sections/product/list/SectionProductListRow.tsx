import RatingBar from '@/components/website/ratings/RatingBar'
import { images } from '@/consts/images'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { CandlestickChartIcon, SquareUserIcon, TruckIcon } from 'lucide-react'
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
        <Link href={`/entity/${props.animal?.id}`} className='w-full p-2 z-0 bg-white hover:outline-2 hover:outline-zinc-300 group rounded-md shadow-md h-full flex flex-col justify-between'>
            <div className="flex flex-col items-center gap-0">
                <div className='relative w-full bg-black border-l border-y border-zinc-200/40 rounded-md overflow-hidden'>
                    {props.animal?.deliveryOptions.length > 0 &&
                        <div className='absolute bottom-2  z-[1] right-2 bg-white rounded p-1 flex gap-1 items-center text-zinc-700 border border-zinc-500 drop-shadow-sm'>
                            {sellerCargo && <div title='SELLER CARGO'>
                                <TruckIcon size={20} />
                            </div>}
                            {selfPickup && <div title='SELF PICKUP'>
                                <SquareUserIcon size={20} />
                            </div>}
                            {
                                props.animal.allowBidding && <div title='ALLOW BIDDING'>
                                    <CandlestickChartIcon size={20} className='text-amber-500 animate-pulse' />
                                </div>
                            }
                        </div>}
                    <div className='bg-gradient-to-t from-black/50 to-transparent w-full h-[40%] absolute bottom-0 left-0'></div>
                    <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[200px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-cover' />
                </div>
                <div className='w-full pt-4'>
                    <div className='transition-all duration-200 ease-in-out w-[90%] sm:w-auto text-xl font-semibold line-clamp-1 text-balance'>{formalizeText(props.animal?.title)}</div>
                    <div className='leading-3 text-sm text-zinc-700'>
                        <span className='underline underline-offset-4 uppercase'>
                            <span className='tracking-widest'>{totalQuantity}</span> <span className=''>{`${props.animal?.breed} ${formalizeText(props.animal?.type).slice(0, props.animal?.type.length - 1)}`}</span>
                        </span>
                    </div>
                    <div className='tracking-widest'>
                        {Number(props.animal?.maleQuantityAvailable ?? 0) > 0 && <span className='text-sm'>{props.animal?.maleQuantityAvailable} Male</span>}
                        {Number(props.animal?.femaleQuantityAvailable ?? 0) > 0 && <span className='text-sm'> {props.animal?.femaleQuantityAvailable} Female</span>}
                    </div>
                    {props.animal?.user?.name && props.animal?.user?.name.length > 0 && <div className='flex flex-col gap-1 my-2'>
                        {/* <div className='font-medium text-zinc-800 tracking-tight text-base text-balance leading-4 -mb-1'>
                            {props.animal?.user?.name}
                        </div> */}
                        {props.animal?.city && props.animal?.province && props.animal?.city.length > 0 && props.animal?.province.length > 0 && <div className='text-xs text-zinc-700 tracking-tight'>{formalizeText(props.animal?.city)}, {formalizeText(props.animal?.province)}</div>}
                    </div>}
                </div>
            </div>
            <div className='text-2xl sm:text-xl md:text-lg text-nowrap text-left text-emerald-600 tracking-wide font-bold'>
                {formatCurrency(calculatePricing(props.animal).price)}
            </div>
        </Link >
    )
}

export default SectionProductListRow