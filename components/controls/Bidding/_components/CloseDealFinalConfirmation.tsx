import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { formatCurrency } from '@/lib/utils'
import React from 'react'

type Props = {
    user: any
    bid: any
    action: () => void
}

const CloseDealFinalConfirmation = (props: Props) => {
    const dialog = useDialog()
    const isThisUserBid = props.bid.userId === props.user?.id

    return (
        <div className='flex flex-col gap-2 px-4'>
            <div>You have selected {isThisUserBid ? "Your own" : `${props.bid.user.name}'s`} bid for {formatCurrency(props.bid.price)}.</div>
            <div className='font-bold'>Are you sure you want to close this deal?</div>
            <div className='w-full flex gap-2 justify-evenly items-center'>
                <Button onClick={async () => { await props.action(); dialog.closeDialog() }} variant={'btn-secondary'} className='w-full'>Yes</Button>
                <Button onClick={() => dialog.closeDialog()} variant={'btn-secondary'} className='w-full'>No</Button>
            </div>
        </div>
    )
}

export default CloseDealFinalConfirmation