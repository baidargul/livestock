'use client'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import { useUser } from '@/socket-client/SocketWrapper'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const page = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()
    const user = useUser()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            if (!user) {
                router.push("/home")
            }
        }
    }, [isMounted])

    return (
        <div className='flex flex-col w-full min-h-[100dvh] select-none'>
            <GeneralHeader />
            <div className='w-full h-full px-4'>
                <div className='text-xl font-bold mb-2'>Orders</div>
                <div className='grid grid-cols-2 gap-2 w-full'>
                    <Link href={`orders/selling/`} className='cursor-pointer'>
                        <div className='p-4 rounded-md bg-emerald-600 text-white text-center'>
                            <div className='font-bold tracking-tight'>Selling</div>
                            <div className='text-6xl font-bold'>12</div>
                        </div>
                    </Link>
                    <Link href={`orders/buying/`} className='cursor-pointer'>
                        <div className='p-4 rounded-md bg-amber-600 text-white text-center'>
                            <div className='font-bold tracking-tight'>Buying</div>
                            <div className='text-6xl font-bold'>4</div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className='mt-auto'>
                <GeneralFooter />
            </div>
        </div>
    )
}

export default page