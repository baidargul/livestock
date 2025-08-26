'use client'
import Button from '@/components/ui/Button'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/socket-client/SocketWrapper'
import { actions } from '@/actions/serverActions/actions'
import SaleOrderRow from './_components/SaleOrderRow'

type Props = {}

const page = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
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

    useEffect(() => {
        fetchOrders()
    }, [currentPage])

    const fetchOrders = async () => {
        if (!user) return
        setIsFetching(true)
        const response = await actions.client.orders.getSellingOrders(user.id, currentPage, orderLimit)
        if (response.status === 200) {
            setOrders(response.data.orders)
            setTotalOrders(response.data.total)
        }
        setIsFetching(false)
    }

    return (
        <div className='flex flex-col w-full min-h-[100dvh] select-none text-zinc-800'>
            <GeneralHeader />
            <div className='w-full h-full px-4'>
                <h1 className='text-2xl font-semibold mb-2'>Sold order receipts</h1>
                <div className='flex flex-col gap-2 sm:flex-row max-h-[55dvh] overflow-x-hidden overflow-y-auto'>
                    {
                        orders && orders.map((order, index) => {
                            return <SaleOrderRow key={index} order={order} refresh={fetchOrders} index={currentPage * orderLimit - orderLimit + index + 1} />
                        })
                    }
                    {
                        orders && orders.length === 0 && !isFetching && <div className='flex justify-center items-center min-h-[55dvh] w-full h-full text-zinc-600'>No orders found</div>
                    }
                </div>
            </div>
            {orders.length > 0 && <div className='flex justify-between gap-2 items-center mt-4 px-4'>
                <button className='cursor-pointer w-10 h-10 border bg-slate-100 border-slate-200 flex justify-center items-center' onClick={() => setCurrentPage((prev) => prev - 1)}><MoveLeftIcon /></button>
                <div className='flex gap-1 items-center'>

                    {
                        Array.from({ length: Math.ceil(totalOrders / orderLimit) }).map((_, index) => {
                            return <button key={index} className={`cursor-pointer w-10 h-10 border ${currentPage === index + 1 ? "bg-emerald-600 border-emerald-700 text-white" : "bg-slate-100 border-slate-200 text-black"}  flex justify-center items-center`} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                        })
                    }
                </div>
                <button className='cursor-pointer w-10 h-10 border bg-slate-100 border-slate-200 flex justify-center items-center' onClick={() => setCurrentPage((prev) => prev + 1)}><MoveRightIcon /></button>
            </div>}
            <div className='mt-auto'>
                <GeneralFooter />
            </div>
        </div>
    )
}

export default page