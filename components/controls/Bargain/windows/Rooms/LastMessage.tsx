import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { Bids } from '@prisma/client'
import React from 'react';
import { RiCheckDoubleFill } from "react-icons/ri";
import { FaCircle } from "react-icons/fa6";
type Props = {
    lastBid: Bids
}

const LastMessage = (props: Props) => {
    const user = useUser();
    const lastBid = props.lastBid
    if (!lastBid) return null
    const isMyMessage = user.id === lastBid.userId

    if (isMyMessage) {
        return (
            props.lastBid && <div className='text-right flex flex-col justify-end items-end'>
                <div>
                    <ElapsedTimeControl date={new Date(lastBid.createdAt).toString()} />
                </div>
                <div className='flex gap-1 items-center'>
                    <RiCheckDoubleFill size={24} className={lastBid.isSeen ? "text-blue-400" : "text-zinc-400"} />
                    <div className='text-xl font-bold'>
                        {formatCurrency(lastBid.price)}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            props.lastBid && <div className='text-right flex flex-col justify-end items-end'>
                <div>
                    <ElapsedTimeControl date={new Date(lastBid.createdAt).toString()} />
                </div>
                <div className='flex gap-1 items-center'>
                    {!lastBid.isSeen && <FaCircle className={lastBid.isSeen ? "text-amber-500" : "text-amber-400"} />}
                    <div className='text-xl font-bold'>
                        {formatCurrency(lastBid.price)}
                    </div>
                </div>
            </div>
        )
    }
}

export default LastMessage