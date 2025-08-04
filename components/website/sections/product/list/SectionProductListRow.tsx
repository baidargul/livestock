'use client'
import { images } from '@/consts/images'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { CandlestickChartIcon, LocateIcon, LocationEditIcon, MapPinIcon, SquareUserIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CTOButton from './_components/CTOButton'
import { useUser } from '@/socket-client/SocketWrapper'

type Props = {
    animal: Animal | any
}

const SectionProductListRow = (props: Props) => {
    const user = useUser()

    const totalQuantity = Number(props.animal?.maleQuantityAvailable || 0) + Number(props.animal?.femaleQuantityAvailable || 0)

    const sellerCargo = props.animal?.deliveryOptions.includes("SELLER_DELIVERY")
    const selfPickup = props.animal?.deliveryOptions.includes("SELF_PICKUP")
    return (
        <Link href={`/entity/${props.animal?.id}`} prefetch={true} className={`break-inside-avoid-column w-full shadow-sm p-2 z-0 ${user?.id === props.animal.userId ? "bg-white" : "bg-white"}  hover:outline-2 hover:outline-zinc-300 group h-full flex flex-col justify-between`}>
            <div className="flex flex-col items-center gap-0">
                <div className='relative w-full bg-black border-l border-y border-zinc-200/40 overflow-hidden'>
                    {(props.animal?.deliveryOptions.length > 0 || props.animal?.allowBidding) &&
                        <div className='absolute bottom-2  z-[1] right-2 bg-white rounded p-1 flex gap-1 items-center text-zinc-700 border border-zinc-500 drop-shadow-sm'>
                            {sellerCargo && <div title='SELLER CARGO'>
                                <TruckIcon size={20} />
                            </div>}
                            {selfPickup && <div title='SELF PICKUP'>
                                <SquareUserIcon size={20} />
                            </div>}
                            {
                                props.animal.allowBidding && <div title='ALLOW BIDDING'>
                                    <CandlestickChartIcon size={20} className='text-emerald-700 animate-pulse' />
                                </div>
                            }
                        </div>}
                    <div className='bg-gradient-to-t from-black/50 to-transparent w-full h-[40%] absolute bottom-0 left-0'></div>
                    <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[150px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-contain' />
                </div>
                <div className='w-full pt-4'>
                    <div className='transition-all duration-200 ease-in-out w-[90%] sm:w-auto text-xl font-semibold line-clamp-1 text-balance'>{formalizeText(props.animal?.title)}</div>
                    <div className='-mt-1 text-zinc-700 tracking-tight'>
                        <span className=''>
                            <span className=''>{totalQuantity}</span> <span className=''>{`${props.animal?.breed} ${String(props.animal?.type).slice(0, props.animal?.type.length - 1)}`}</span>
                        </span>
                    </div>
                    {props.animal?.user?.name && props.animal?.user?.name.length > 0 && <div className='flex flex-col gap-1'>
                        {props.animal?.city && props.animal?.province && props.animal?.city.length > 0 && props.animal?.province.length > 0 && <div className='text-xs text-zinc-700 tracking-tight mb-2 flex gap-1 items-center'> <MapPinIcon size={14} /> {formalizeText(props.animal?.city)}, {formalizeText(props.animal?.province)}</div>}
                    </div>}
                </div>
            </div>
            <CTOButton animal={props.animal} />
        </Link >
    )
}

export default SectionProductListRow