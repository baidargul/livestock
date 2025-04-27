import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    heading?: string
    subheading?: string
}

const SectionLandingPageImage = (props: Props) => {
    return (
        <div className='relative w-full max-h-[230px] flex justify-center items-center overflow-hidden select-none'>
            <div className='absolute z-20 text-white text-center'>
                <h1 className='text-4xl font-semibold' style={{ textShadow: "1px 1px 3px black" }}>{props.heading ?? "Adorable pets"}</h1>
                <h2 className='tracking-tight font-medium' style={{ textShadow: "1px 1px 3px black" }}>{props.subheading ?? "get your adorable pets home today!"}</h2>
            </div>
            <div className='absolute z-10 top-0 left-0 w-full h-[150%] rounded-t-xl bg-gradient-to-t from-transparent to-emerald-600/50'></div>
            <Image src={images.chicken.covers[1]} priority layout='fixed' alt='livestock' draggable={false} width={406} height={195} quality={70} className='w-full max-h-[230px] h-full rounded-xl object-cover' />
        </div>
    )
}

export default SectionLandingPageImage