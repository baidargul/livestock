import { formatCurrency } from '@/lib/utils'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import { Bids } from '@prisma/client'
import { serialize } from 'bson'
import React from 'react'

type Props = {
    lockedBids: Bids[]
    isAuthor: boolean
    currentRoom: any
}

const FinalBidSelection = (props: Props) => {
    if (props.lockedBids.length < 2) return null
    const isAuthor = props.isAuthor
    const user = useUser()
    const socket = useSocket()

    const myBid = props.lockedBids[0]
    const otherBid = props.lockedBids[1]

    const handleSelectFinalBid = (bid: Bids) => {
        if (socket && user) {
            socket.emit("close-deal", serialize({ room: props.currentRoom, userId: user.id, bid: bid }))
        }
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='p-2 rounded text-xs tracking-tight bg-white/30 italic'>
                {isAuthor &&
                    <div className='not-italic'>
                        Please make final selection <br />between your {formatCurrency(myBid.price)} and {formatCurrency(otherBid.price)}.
                    </div>
                }
                {
                    !isAuthor &&
                    <div>
                        Author has locked his {formatCurrency(otherBid.price)} offer.<br />He'll take now final decision between your {formatCurrency(myBid.price)} and his {formatCurrency(otherBid.price)} offer. <br /><span className='text-amber-800'>Please wait for the final decision.</span>
                    </div>
                }
            </div>
            <div className='p-2 pt-5 bg-zinc-100 grid grid-cols-2 gap-2 w-full place-items-center text-center'>
                <div className='relative w-full'>
                    {/* <div className='p-2 w-full rounded text-emerald-800 bg-emerald-200 border border-emerald-300'>
                <div>{formatCurrency(myBid.price)}</div>
                </div> */}
                    {/* <div className='p-2 w-full rounded text-red-800 bg-red-200 border border-red-300'>
                <div>{formatCurrency(myBid.price)}</div>
                </div> */}
                    <div onClick={() => { handleSelectFinalBid(myBid) }} className='cursor-pointer p-2 w-full rounded text-zinc-800 bg-zinc-200 border border-zinc-300'>
                        <div>{formatCurrency(myBid.price)}</div>
                    </div>
                    <div className='absolute -top-4 left-0 text-xs scale-[.7] origin-top-left mt-1'>Your offer</div>
                </div>
                <div onClick={() => { handleSelectFinalBid(otherBid) }} className='cursor-pointer p-2 w-full rounded text-zinc-800 bg-zinc-200 border border-zinc-300'>
                    <div>{formatCurrency(otherBid.price)}</div>
                </div>
            </div>
        </div>
    )
}

export default FinalBidSelection