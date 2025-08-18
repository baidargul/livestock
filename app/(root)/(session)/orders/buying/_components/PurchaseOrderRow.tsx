import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { Orders } from '@prisma/client'
import { MoveRightIcon } from 'lucide-react'
import React, { useState } from 'react'
import OrderPreview from './_purchaseOrderRow/OrderPreview'

type Props = {
    order: any
    refresh: () => void
    index?: number
}

const PurchaseOrderRow = (props: Props) => {
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [isPreviewing, setIsPreviewing] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [order, setOrder] = useState(null)
    const dialog = useDialog()
    const user = useUser()

    const handleTogglePreview = () => {
        setShowPreview(!showPreview)
    }
    const handleWithdrawDeal = () => {

        const handleWithdraw = async () => {
            setIsWithdrawing(true)
            const response = await actions.client.orders.withdraw(user.id, props.order.id)
            if (response.status === 200) {
                props.refresh()
                dialog.closeDialog()
            } else {
                dialog.showDialog(`Unable to withdraw deal`, null, `Error: ${response.message}`)
            }
            setIsWithdrawing(false)
        }

        dialog.showDialog('Withdraw Deal', <WithdrawConfirmationBox isWithdrawing={isWithdrawing} onYes={handleWithdraw} closeDialog={() => dialog.closeDialog()} order={props.order} />)
    }



    const handleOrderPreview = (orderId: string) => {
        if (!orderId || orderId.length === 0) return

        const getPreview = async (orderId: string) => {
            setIsPreviewing(true)
            const response = await actions.client.orders.getOrderPreview(orderId)
            if (response.status === 200) {
                setOrder(() => response.data)
                handleTogglePreview()
            } else {
                dialog.showDialog(`Unable to get order preview`, null, `Error: ${response.message}`)
            }
            setIsPreviewing(false)
        }

        if (!order) {
            getPreview(orderId)
        } else {
            handleTogglePreview()
        }

    }

    const totalQuantity = Number(props.order.maleQuantityAvailable || 0) + Number(props.order.femaleQuantityAvailable || 0)

    return (
        <>
            {showPreview && order && <OrderPreview order={order} togglePreview={handleTogglePreview} />}
            <div inert={isWithdrawing || isPreviewing} className='relative flex flex-col my-1 sm:my-0 sm:mx-1 border border-zinc-200 sm:flex-row justify-between gap-4 sm:gap-0 text-center sm:text-start items-center sm:items-start bg-white rounded p-4 shadow-sm'>
                {props.index && props.index > 0 && <div className='absolute left-1 top-1 text-zinc-400 pointer-events-none'>{props.index} - </div>}
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
                <div className={`flex flex-col gap-1 w-full sm:w-fit ${isPreviewing || isWithdrawing ? 'pointer-events-none grayscale-100' : ''}`}>
                    <Button onClick={() => handleOrderPreview(props.order.id)} variant={'btn-secondary'} className='w-full text-nowrap'>Preview</Button>
                    <Button onClick={handleWithdrawDeal} variant={'btn-secondary'} className='w-full text-nowrap'>Withdraw order</Button>
                </div>
            </div>
        </>
    )
}

export default PurchaseOrderRow


const WithdrawConfirmationBox = (props: { onYes: () => void, closeDialog: () => void, order: Orders, isWithdrawing: boolean }) => {

    return (
        <div className='px-4 flex flex-col gap-2'>
            <div>
                <div className='text-lg'>Are you sure to permenently delete this order?</div>
            </div>
            <div className='font-normal text-xs'>Removing this order will not only removes the order, but also clear up and delete any bidrooms associated with this order.</div>
            <div className='w-full flex justify-between items-center gap-2'>
                <Button disabled={props.isWithdrawing} variant={'btn-secondary'} onClick={props.onYes} className='w-full'>Yes</Button>
                <Button disabled={props.isWithdrawing} variant={'btn-secondary'} onClick={props.closeDialog} className='w-full'>No</Button>
            </div>
        </div>
    )
}