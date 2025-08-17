'use client'
import Button from '@/components/ui/Button'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import { MoveRightIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PurchaseOrderRow from './_components/PurchaseOrderRow'
import { useUser } from '@/socket-client/SocketWrapper'
import { actions } from '@/actions/serverActions/actions'

type Props = {}

const page = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [orders, setOrders] = useState([])
    const [totalOrders, setTotalOrders] = useState(0)
    const [orderLimit, setOrderLimit] = useState(6)
    const [currentPage, setCurrentPage] = useState(1)
    const user = useUser()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            if (!user) {
                // window.location.replace("/home")
            } else {
                fetchOrders()
            }
        }
    }, [isMounted, user])

    const fetchOrders = async () => {
        if (!user) return
        const response = await actions.client.orders.getPurchaseOrders(user.id, currentPage, orderLimit)
        if (response.status === 200) {
            setOrders(response.data.orders)
            setTotalOrders(response.data.total)
        }
    }

    return (
        <div className='flex flex-col w-full min-h-[100dvh] select-none text-zinc-800'>
            <GeneralHeader />
            <div className='w-full h-full px-4'>
                <h1 className='text-2xl font-semibold mb-2'>Purchase orders</h1>
                <div className='columns-1 sm:columns-2'>
                    {
                        orders && orders.map((order, index) => {
                            return <PurchaseOrderRow key={index} order={order} refresh={fetchOrders} />
                        })
                    }
                </div>
            </div>
            <div className='mt-auto'>
                <GeneralFooter />
            </div>
        </div>
    )
}

export default page