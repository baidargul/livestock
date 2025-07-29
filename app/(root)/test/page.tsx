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
        tl.set('.coin', { opacity: 0, yPercent: 0, rotate: 0 })
        tl.set('.coin-text', { opacity: 0, yPercent: 0, rotate: 0 })
        tl.to('.coin', { opacity: 1, duration: .2, ease: 'power1.out', rotate: -90 })
            .to('.coin', { yPercent: -150, duration: .2, ease: 'power1.out', rotate: -120 }, "<")
            .to(".coin-text", { opacity: 1, yPercent: -50, duration: .7, ease: 'power1.out' }, "<0.1")
            .to('.coin', { opacity: 0, duration: .2, ease: 'power1.out', rotate: -180 }, "<")
            .to(".coin-text", { opacity: 0, duration: .4, ease: 'power1.out' })
    }

    return (
        <>
            <div className='w-full min-h-[100dvh] flex justify-center items-center'>
                <div className='relative flex justify-center items-center'>
                    <div className='coin absolute top-0 opacity-0 pointer-events-none flex flex-col items-center gap-0'>
                        <Image src={images.site.coins.gold.shine} alt='coin' width={50} height={50} layout='fixed' quality={100} />
                    </div>
                    <div className='coin-text absolute -top-4 opacity-0 pointer-events-none'>300 Coins</div>
                    <Button onClick={handleClick}>Click here</Button>
                </div>
            </div>
        </>
    )
}

export default page