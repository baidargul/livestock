'use client'
import Button from '@/components/ui/Button'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import { MoveRightIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='flex flex-col w-full min-h-[100dvh] select-none text-zinc-800'>
            <GeneralHeader />
            <div className='w-full h-full px-4'>
                <h1 className='text-2xl font-semibold'>Purchase orders</h1>
                <div>
                    <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 text-center sm:text-start items-center sm:items-start bg-white rounded p-4 shadow-sm'>
                        <div>
                            <div className='text-lg sm:text-md font-bold'>Sahiwal silver cow x 4</div>
                            <div className='text-xs text-zinc-500 -mt-2 flex gap-1 items-center'>Jhang, Punjab <MoveRightIcon /> Lahore, Punjab </div>
                            <div className='text-xl sm:text-lg font-bold'>Rs 35,000</div>
                        </div>
                        <div className='flex flex-col gap-1 w-full sm:w-fit'>
                            <Button variant={'btn-secondary'} className='w-full text-nowrap'>Withdraw order</Button>
                            <Button variant={'btn-secondary'} className='w-full text-nowrap'>Withdraw order</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-auto'>
                <GeneralFooter />
            </div>
        </div>
    )
}

export default page