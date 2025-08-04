import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    animal: any
    children: React.ReactNode
}

const SoldOverlay = (props: Props) => {
    return (
        <div className='w-full h-full relative'>
            {props.children}
            {props.animal.sold && <div className='absolute bottom-0 left-0 z-50 pointer-events-none w-full h-full bg-gradient-to-t from-white to-transparent flex justify-center items-center'>
                <Image src={images.site.ui.sold} alt='sold' width={100} height={100} layout='fixed' className='w-full mt-auto' />
            </div>}
        </div>
    )
}

export default SoldOverlay