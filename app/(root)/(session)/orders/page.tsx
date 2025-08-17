'use client'
import { actions } from '@/actions/serverActions/actions'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import { useUser } from '@/socket-client/SocketWrapper'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const page = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [gettingOrderCount, setGettingOrderCount] = useState(false)
    const [orders, setOrders] = useState({ buying: 0, selling: 0 })
    const router = useRouter()
    const user = useUser()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            if (!user) {
                // router.push("/home")
            } else {
                fetchOrderCount()
            }
        }
    }, [isMounted, user])

    const fetchOrderCount = async () => {
        if (!user) return
        setGettingOrderCount(true)
        const response = await actions.client.orders.getOrderCount(user.id)
        console.log(response)
        if (response.status === 200) {
            setOrders(response.data)
        }
        setGettingOrderCount(false)
    }


    const buyingPercentage = orders.buying > 0 && orders.selling > 0 && Number(((orders.buying / (orders.buying + orders.selling)) * 100).toFixed(0))
    const sellingentage = orders.selling > 0 && orders.selling > 0 && Number(((orders.selling / (orders.buying + orders.selling)) * 100).toFixed(0))

    return (
        <div className='flex flex-col w-full min-h-[100dvh] select-none'>
            <GeneralHeader />
            <div className='w-full h-full px-4'>
                <div className='text-xl font-bold mb-2'>Orders</div>
                <div className='grid grid-cols-2 gap-2 w-full h-full'>
                    <Link href={`orders/selling/`} className='cursor-pointer w-full h-full min-h-[140px] flex flex-col justify-center items-center  relative'>
                        <div className='absolute w-full h-full p-4 rounded-md text-black text-center z-[2]'>
                            <div className='font-bold tracking-tight'>Selling</div>
                            <div className={`text-6xl font-bold ${gettingOrderCount ? "blur-[1]" : ""}`}>{orders.selling}</div>
                        </div>
                        <div className='bg-emerald-600 w-full h-full rounded-md'></div>
                        <div className='w-full bg-emerald-300/20 rounded-md absolute bottom-0 left-0 z-[1]' style={{ height: `${sellingentage ?? 0}%` }}></div>
                    </Link>
                    <Link href={`orders/buying/`} className='cursor-pointer w-full h-full min-h-[140px] flex flex-col justify-center items-center relative'>
                        <div className='absolute w-full h-full p-4 rounded-md text-black text-center z-[2]'>
                            <div className='font-bold tracking-tight'>Buying</div>
                            <div className={`text-6xl font-bold ${gettingOrderCount ? "blur-[1]" : ""}`}>{orders.buying}</div>
                        </div>
                        <div className='bg-amber-600 w-full h-full rounded-md'></div>
                        <div className='w-full bg-amber-300/20 rounded-md absolute bottom-0 left-0 z-[1]' style={{ height: `${buyingPercentage ?? 0}%` }}></div>
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