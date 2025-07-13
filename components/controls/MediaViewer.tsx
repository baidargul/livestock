'use client'
import { images } from '@/consts/images'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {
    children: React.ReactNode
    image: any
}

const MediaViewer = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            {isOpen && <div onClick={handleClose} className='fixed top-0 left-0 w-full h-full bg-black/70 backdrop-blur-[1px] z-20'></div>}
            <div className={`fixed select-none top-0 left-0 z-30 w-[400px] h-[400px] flex justify-center items-center transition-all duration-100 ease-in-out delay-150 ${isOpen ? "opacity-100 pointer-events-auto translate-y-0" : "0 opacity-0 translate-y-full pointer-events-none"}`} style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div className={`bg-white p-4 rounded drop-shadow-2xl w-[400px] h-[400px] relative`}>
                    <XIcon className='absolute top-5 right-5 bg-blend-difference cursor-pointer' onClick={handleClose} />
                    <Image src={props.image ?? images.chickens.images[1]} loading='lazy' layout='fixed' width={100} height={100} quality={50} alt='janwarmarkaz' className=' w-full h-full object-cover' />
                </div>
            </div>
            <span
                className='cursor-pointer'
                onClick={handleOpen}
            >{props.children}</span>
        </>
    )
}

export default MediaViewer