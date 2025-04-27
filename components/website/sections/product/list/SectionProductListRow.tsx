import RatingBar from '@/components/website/ratings/RatingBar'
import { images } from '@/consts/images'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const SectionProductListRow = (props: Props) => {
    return (
        <Link href={`/entity/1`} className='w-full'>
            <div className="flex items-center gap-0">
                <Image src={images.chicken.covers[3]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-36 h-36 select-none object-cover rounded-lg' />
                <div className='p-2 pl-4 bg-emerald-50 rounded-r-xl'>
                    <h1 className='text-xl font-semibold'>Golden Retriver</h1>
                    <div className='flex subheading1 gap-1 items-center -mt-1'>
                        <div className='font-medium'>2 Months</div> | <div className='font-medium'>Male</div>
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
                        Rs 45,000
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SectionProductListRow