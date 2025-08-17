import Button from '@/components/ui/Button'
import { MoveRightIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const PurchaseOrderRow = (props: Props) => {
    return (
        <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 text-center sm:text-start items-center sm:items-start bg-white rounded p-4 shadow-sm'>
            <div>
                <div className='text-lg sm:text-md font-bold'>Sahiwal silver cow x 4</div>
                <div className='text-xs text-zinc-500 -mt-2 flex gap-1 items-center'>Jhang, Punjab <MoveRightIcon /> Lahore, Punjab </div>
                <div className='text-xl sm:text-lg font-bold'>Rs 35,000</div>
            </div>
            <div className='flex flex-col gap-1 w-full sm:w-fit'>
                <Button variant={'btn-secondary'} className='w-full text-nowrap'>Open</Button>
                <Button variant={'btn-secondary'} className='w-full text-nowrap'>Withdraw order</Button>
            </div>
        </div>
    )
}

export default PurchaseOrderRow