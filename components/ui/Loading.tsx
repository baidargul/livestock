'use client'
import { images } from '@/consts/images'
import { useLoader } from '@/hooks/useLoader'
import { LoaderState } from '@/types/useLoader'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}

const Loading = (props: Props) => {
    const [translate, setTranslate] = useState("-translate-x-2")
    const [rotate, setRotate] = useState("-rotate-2")
    const loading = useLoader((state: LoaderState) => state.loading)

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setTranslate(prev => prev === "-translate-x-2" ? "translate-x-2" : "-translate-x-2")
                setRotate(prev => prev === "-rotate-4" ? "rotate-4" : "-rotate-4")
            }, 500)

            return () => clearInterval(interval)
        }
    }, [loading])

    return (
        <>
            {loading && <div className='fixed z-50 flex inset-0 w-full h-full bg-red-200/80 pointer-events-none justify-center items-center cursor-not-allowed' style={{ zIndex: 999 }} >
                <div className='text-red-600 font-bold tracking-wide bg-gradient-to-b from-red-100 via-white to-red-100 p-10 px-14 rounded-xl' style={{ boxShadow: "0px 3px 4px 0px #71141987" }}>
                    <Image src={images.site.logo.desktopIcon} width={100} height={100} quality={10} alt='logo' className={`w-32 h-32 mx-auto transition-all duration-200 ease-in-out ${rotate}`} />
                    <div className={`${translate} ${rotate} duration-300 text-center ease-in-out transition-all`}>
                        Please wait
                    </div>
                </div>
            </div>}
            <div className={`${loading ? "pointer-events-none" : ""} transition-all duration-200 ease-in-out`}>
                {props.children}
            </div>
        </>
    )
}

export default Loading