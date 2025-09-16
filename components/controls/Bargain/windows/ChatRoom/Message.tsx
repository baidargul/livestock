import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { formatCurrency } from '@/lib/utils'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import { Bids } from '@prisma/client'
import { serialize } from 'bson'
import React, { useEffect } from 'react'
import { FaLock } from 'react-icons/fa6'
import { RiCheckDoubleFill } from 'react-icons/ri'

type Props = {
    message: Bids
    isPlaceHolder?: boolean
}

const Message = (props: Props) => {
    const message = props.message
    const user = useUser()
    const socket = useSocket()
    const isMyMessage = user?.id === message.userId

    useEffect(() => {
        if (isMyMessage && !message.isSeen) handleMessageSeen()
    }, [])

    const handleMessageSeen = () => {
        if (socket) {
            if (message.isSeen) return
            socket.emit("message-seen", serialize({ bidId: message.id, room: message.bidRoomId }));
        }
    };

    if (isMyMessage) {
        return (
            <div className='ml-auto rounded p-2 w-fit pl-4 flex flex-col justify-end text-end items-end bg-lime-100 shadow-sm'>
                <div className='flex gap-1 items-center'>
                    {!props.isPlaceHolder && <RiCheckDoubleFill size={24} className={message.isSeen ? "text-blue-400" : "text-zinc-400"} />}
                    <div className='font-bold'>{formatCurrency(message.price)}</div>
                    {!props.isPlaceHolder && <FaLock className='ml-4' />}
                </div >
                <ElapsedTimeControl date={new Date(message.createdAt).toString()} />
            </div >
        )
    } else {
        return (
            <div className='rounded p-2 w-fit pr-4 flex flex-col bg-white'>
                <div className='flex gap-1 items-center'>
                    <div className='font-bold'>{formatCurrency(message.price)}</div>
                    {/* <div>Lock</div> */}
                </div>
                <ElapsedTimeControl date={new Date(message.createdAt).toString()} />
            </div>
        )
    }
}

export default Message