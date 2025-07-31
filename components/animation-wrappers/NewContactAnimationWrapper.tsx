import React, { useEffect } from 'react'
import { gsap } from "gsap";
import Image from 'next/image';
import { images } from '@/consts/images';
import { useContacts } from '@/hooks/useContacts';
type Props = {
    children: React.ReactNode
    className?: string
    activated?: boolean
}

const NewContactAnimationWrapper = (props: Props) => {
    const toggleIsAdding = useContacts((state: any) => state.toggleIsAdding)

    useEffect(() => {
        if (props.activated) {
            execute()
            toggleIsAdding(false)
        }
    }, [props.activated])

    const execute = () => {
        const tl = gsap.timeline()
        tl.set('.plusIcon', { opacity: 0, yPercent: 0, rotate: 0 })
        tl.to('.plusIcon', { opacity: 1, yPercent: -150, rotate: -360, duration: 1 })
            .to(".plusIcon", { opacity: 0 }, "<.9")
    }


    return (
        <div className={props.className}>
            <div className='relative w-full flex justify-center items-center text-center'>
                <div className='plusIcon absolute top-0 opacity-0 pointer-events-none w-full flex flex-col text-center items-center gap-0'>
                    <Image src={images.site.ui.plusIcon} alt='plus' width={30} height={30} layout='fixed' quality={100} />
                </div>
                <div className='w-full'>{props.children}</div>
            </div>
        </div>
    )
}

export default NewContactAnimationWrapper