import BackNavigator from '@/components/controls/BackNavigator'
import { images } from '@/consts/images'
import { ArrowLeftCircleIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    params: { id: string }
}

const page = (props: Props) => {
    return (
        <div className='relative'>
            <BackNavigator className='absolute top-3 left-3 z-10 bg-black/20 rounded-full p-1'>
                <ArrowLeftCircleIcon width={32} height={32} className='text-white' />
            </BackNavigator>
            <div className='relative'>
                <Image
                    src={images.hens.covers[1]}
                    draggable={false}
                    priority
                    layout="responsive"
                    quality={70}
                    alt="hen"
                    className="w-full h-[400px] z-0 select-none object-cover"
                />

                <div className='bg-emerald-50 p-4 rounded-lg mx-4 absolute -mt-20 z-10' style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <h1 className='text-3xl text-center font-bold text-gray-800 mt-4'>Golden Retriver</h1>
                    <div className='px-4 py-2'>
                        <p className='text-sm text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page