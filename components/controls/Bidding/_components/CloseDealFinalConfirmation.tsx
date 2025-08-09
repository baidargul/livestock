import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { formatCurrency } from '@/lib/utils'
import { serialize } from 'bson'
import React from 'react'

type Props = {
    user: any
    bid: any
    activeRoom: any
    socket: any
}

const CloseDealFinalConfirmation = (props: Props) => {
    const dialog = useDialog()
    const isThisUserBid = props.bid.userId === props.user?.id

    const handleYes = () => {
        console.log(props.socket)
        if (props.socket) {
            console.log(`Sending closing signal`)
            props.socket.emit("close-deal", serialize({ room: props.activeRoom, userId: props.user.id, bid: props.bid }))
            dialog.closeDialog()
        }
    }

    return (
        <div className='flex flex-col gap-2 px-4'>
            <div>You have selected {isThisUserBid ? "Your own" : `${props.bid.user.name}'s`} bid for {formatCurrency(props.bid.price)}.</div>
            <div className='font-bold'>Are you sure you want to close this deal?</div>
            <div className='w-full flex gap-2 justify-evenly items-center'>
                <Button onClick={handleYes} variant={'btn-secondary'} className='w-full'>Yes</Button>
                <Button onClick={() => dialog.closeDialog()} variant={'btn-secondary'} className='w-full'>No</Button>
            </div>
        </div>
    )
}

export default CloseDealFinalConfirmation