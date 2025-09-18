import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { formatCurrency } from '@/lib/utils'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import { Bids } from '@prisma/client'
import { serialize } from 'bson'
import { useEffect, useState } from 'react'
import { FaLock } from 'react-icons/fa6'
import { RiCheckDoubleFill } from 'react-icons/ri'
import LockControls from './LockControls'

type Props = {
    currentRoom: any
    message: Bids
    isPlaceHolder?: boolean
}

const Message = (props: Props) => {
    const [toggleLockControls, setToggleLockControls] = useState(false)
    const message = props.message
    const user = useUser()
    const socket = useSocket()
    const isMyMessage = user?.id === message.userId

    useEffect(() => {
        if (user && socket) {
            if (!isMyMessage && !message.isSeen) handleMessageSeen()
        }
    }, [user, socket, isMyMessage, message])

    const handleMessageSeen = () => {
        if (socket) {
            if (message.isSeen) return
            if (isMyMessage) return
            socket.emit("message-seen", serialize({ bidId: message.id, room: props.currentRoom }));
        }
    };

    const handleToggleLockControls = (val: boolean) => {
        setToggleLockControls(val)
    }

    if (isMyMessage) {
        return (
            <div className='ml-auto rounded p-2 px-4 w-fit flex flex-col justify-end text-end items-end bg-lime-100 shadow-sm'>
                <div>
                    <div className='flex gap-1 justify-evenly items-center'>
                        {!props.isPlaceHolder && <RiCheckDoubleFill size={24} className={`${message.isSeen ? "text-blue-400" : "text-zinc-400"} ${toggleLockControls ? "w-8 h-8" : "w-5 h-5"} transition-all delay-300 duration-300 ease-in-out`} />}
                        <div className={`font-bold ${toggleLockControls ? "text-xl" : "text-base"} transition-all delay-200 duration-300 ease-in-out`}>{formatCurrency(message.price)}</div>
                        {!props.isPlaceHolder && <FaLock onClick={() => handleToggleLockControls(!toggleLockControls)} className={`${toggleLockControls ? "w-8 h-8 text-emerald-800" : "w-5 h-5"} transition-all duration-300 ease-in-out`} />}
                    </div >
                    <div className={`w-fit ${toggleLockControls ? "block opacity-100" : "hidden opacity-0"} transition-all transition-discrete delay-600 duration-300 ease-in-out}`}>
                        <LockControls handleToggleLockControls={handleToggleLockControls} />
                    </div>
                </div>
                <div className={`${toggleLockControls ? "opacity-0" : "opacity-100"} transition-all duration-300 ease-in-out`}>
                    <ElapsedTimeControl date={new Date(message.createdAt).toString()} />
                </div>
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