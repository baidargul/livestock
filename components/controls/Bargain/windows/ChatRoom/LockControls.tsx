import { formatCurrency } from '@/lib/utils'
import { Bids } from '@prisma/client'
import React from 'react'

type Props = {
    message: Bids
    handleToggleLockControls: (val: boolean) => void
    isLockingOffer: boolean
    handleLockOffer: (message: Bids) => void
}

const LockControls = (props: Props) => {
    if (props.message.isFinalOffer) return null
    return (
        <div className='text-sm tracking-tight text-left mt-4 flex flex-col gap-4'>
            <div>You're about to lock {formatCurrency(props.message.price)} as your final offer, doing this will lock your controls. <br /><br /> <span className='flex justify-center items-center text-center'>Are you sure to proceed?</span></div>
            <div className='flex justify-evenly gap-2 items-center'>
                <div onClick={async () => { await props.handleLockOffer(props.message) }} className={`${props.isLockingOffer ? "pointer-events-none" : "pointer-events-auto"} p-1 px-2 cursor-pointer hover:bg-emerald-50 border border-emerald-600 w-full rounded text-center`}>{props.isLockingOffer ? "..." : "Yes"}</div>
                <div onClick={() => { props.handleToggleLockControls(false) }} className='p-1 px-2 cursor-pointer hover:bg-emerald-50 border border-emerald-600 w-full rounded text-center'>No</div>
            </div>
        </div>
    )
}

export default LockControls