import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import Button from '@/components/ui/Button'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { Orders } from '@prisma/client'
import { MoveRightIcon } from 'lucide-react'
import React from 'react'

type Props = {
    order: any
}

const PurchaseOrderRow = (props: Props) => {

    const totalQuantity = Number(props.order.maleQuantityAvailable || 0) + Number(props.order.femaleQuantityAvailable || 0)

    return (
        <div className='flex flex-col my-1 sm:my-0 sm:mx-1 border border-zinc-200 sm:flex-row justify-between gap-4 sm:gap-0 text-center sm:text-start items-center sm:items-start bg-white rounded p-4 shadow-sm'>
            <div>
                <div className='text-lg sm:text-md font-bold'>{formalizeText(props.order.breed)} {props.order.type} x {totalQuantity}</div>
                <div className='text-xs text-zinc-700 -mt-2 flex gap-1 items-center'>{`${props.order.author.city}, ${props.order.author.province}`}<MoveRightIcon /> {`${formalizeText(props.order.city)}, ${formalizeText(props.order.province)}`} </div>
                <div className='text-xs text-zinc-500 -mt-1 flex gap-1 items-center justify-center text-center'>
                    {
                        `${new Date(props.order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })},`
                    }
                    <ElapsedTimeControl date={props.order.createdAt} />
                </div>
                <div className='text-xl sm:text-lg font-bold'>{formatCurrency(calculatePricing(props.order).price)}</div>
            </div>
            <div className='flex flex-col gap-1 w-full sm:w-fit'>
                <Button variant={'btn-secondary'} className='w-full text-nowrap'>Open</Button>
                <Button variant={'btn-secondary'} className='w-full text-nowrap'>Withdraw order</Button>
            </div>
        </div>
    )
}

export default PurchaseOrderRow