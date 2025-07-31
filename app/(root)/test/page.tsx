'use client'
import Button from '@/components/ui/Button'
import React from 'react'
import { gsap } from "gsap";
import Image from 'next/image';
import { images } from '@/consts/images';
type Props = {}

const page = (props: Props) => {

    const handleClick = () => {
        const tl = gsap.timeline()
        tl.set('.plus', { opacity: 0, yPercent: 0, rotate: 0 })
        tl.to('.plus', { opacity: 1, yPercent: -250, rotate: -360 })
            .to(".plus", { opacity: 0 }, "<0.1")
    }

    return (
        <>
            <div className='w-full min-h-[100dvh] flex justify-center items-center'>
                <div className='relative flex justify-center items-center'>
                    <div className='plus absolute top-0 opacity-0 pointer-events-none flex flex-col items-center gap-0'>
                        <Image src={images.site.ui.plusIcon} alt='plus' width={30} height={30} layout='fixed' quality={100} />
                    </div>
                    <Button onClick={handleClick}>Click here</Button>
                </div>
            </div>
        </>
    )
}

export default page