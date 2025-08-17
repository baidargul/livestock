'use client'
import Button from '@/components/ui/Button'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import { MoveRightIcon } from 'lucide-react'
import React from 'react'
import PurchaseOrderRow from './_components/PurchaseOrderRow'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='flex flex-col w-full min-h-[100dvh] select-none text-zinc-800'>
            <GeneralHeader />
            <div className='w-full h-full px-4'>
                <h1 className='text-2xl font-semibold mb-2'>Purchase orders</h1>
                <div className='w-full'>
                    <PurchaseOrderRow />
                </div>
            </div>
            <div className='mt-auto'>
                <GeneralFooter />
            </div>
        </div>
    )
}

export default page