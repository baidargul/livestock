import RatingBar from '@/components/website/ratings/RatingBar'
import { images } from '@/consts/images'
import { formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { PackageOpenIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    animal?: Animal | any
}

const SectionProductListRow = (props: Props) => {

    // console.log(props.animal)

    const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)

    const sellerCargo = props.animal?.deliveryOptions.includes("SELLER_DELIVERY")
    const selfPickup = props.animal?.deliveryOptions.includes("SELF_PICKUP")

    return (
        <Link href={`/entity/1`} className='w-full'>
            <div className="flex items-center gap-0">
                <div className='relative'>
                    {props.animal?.deliveryOptions.length > 0 && <div className='absolute bottom-2 left-2 bg-emerald-100 rounded-md p-1 flex gap-1 items-center text-emerald-600'>
                        {sellerCargo && <div title='SELLER CARGO'>
                            <TruckIcon size={20} />
                        </div>}
                        {selfPickup && <div title='SELF PICKUP'>
                            <PackageOpenIcon size={20} />
                        </div>}
                    </div>}
                    <Image src={props.animal?.images[0].image} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-40 h-40 select-none object-cover rounded-l-lg' />
                </div>
                <div className='p-2 pl-4 bg-emerald-50 rounded-r-xl'>
                    <h1 className='text-xl font-semibold'>{props.animal?.title}</h1>
                    <div className='flex subheading1 gap-1 items-center -mt-1'>
                        <div className='font-medium'>{totalQuantity}</div> <div className='font-medium'>{`${formalizeText(props.animal?.type)} ${props.animal?.breed}`}</div>
                    </div>
                    <div>
                        <span className='text-sm tracking-tight'>{props.animal?.maleQuantityAvailable} Male</span>
                        <span className='text-sm tracking-tight'> {props.animal?.femaleQuantityAvailable} Female</span>
                    </div>
                    <div className='flex gap-1 items-center my-2'>
                        <div className='font-medium w-[70%] tracking-tight text-base leading-4'>
                            Hamza poultry services & Farms
                        </div>
                        <div>
                            <RatingBar readonly defaultRating={4} />
                        </div>
                    </div>
                    <div className='text-xl mt-2 text-emerald-600 tracking-wide font-bold'>
                        {formatCurrency(props.animal?.price)}
                    </div>
                </div>
            </div>
        </Link >
    )
}

export default SectionProductListRow