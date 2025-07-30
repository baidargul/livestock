import React, { useEffect } from 'react'
import { gsap } from "gsap";
import Image from 'next/image';
import { images } from '@/consts/images';
type Props = {
    children: React.ReactNode
    className?: string
    text?: string
    type?: "success" | "warning" | "error"
}

const CoinTransactionAnimationWrapper = (props: Props) => {

    useEffect(() => {
        if (props.text && props.text.length > 0) {
            execute()
        }
    }, [props.text])

    const execute = () => {
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
        <div className={props.className}>
            <div className='relative w-full flex justify-center items-center text-center'>
                <div className='coin absolute top-0 opacity-0 pointer-events-none w-full flex flex-col text-center items-center gap-0'>
                    <Image src={images.site.coins.gold.shine} priority={true} alt='coin' width={50} height={50} layout='fixed' quality={100} />
                </div>
                <div className={`coin-text ${props.type === "warning" ? "text-amber-700" : props.text === "error" ? "text-red-500" : "text-green-500"} w-full absolute -top-4 opacity-0 pointer-events-none`}>{props.text ? props.text : "Transaction complete"}</div>
                <div className='w-full'>{props.children}</div>
            </div>
        </div>
    )
}

export default CoinTransactionAnimationWrapper