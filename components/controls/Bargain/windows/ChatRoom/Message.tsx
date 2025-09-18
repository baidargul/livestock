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
    isLockingOffer: boolean
    handleLockOffer: (message: Bids) => void
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
        if (!props.isLockingOffer) {
            setToggleLockControls(val)
        }
    }

    if (isMyMessage) {
        return (
            <div className={`${props.isLockingOffer ? "animate-pulse" : ""} ${props.message.isFinalOffer ? "mt-4 border border-emerald-600" : ""} relative ml-auto rounded p-2 px-4 w-fit flex flex-col justify-end text-end items-end bg-lime-100 shadow-sm`}>
                {props.message.isFinalOffer && <div className='p-1 text-xs px-6 text-center flex gap-2 justify-center items-center bg-emerald-600 text-white rounded-t absolute -top-4 scale-[.7] origin-top-left left-0'>
                    <FaLock /> <div>Locked</div>
                </div>}
                <div>
                    <div className={`flex gap-1 justify-evenly items-center ${toggleLockControls ? "mb-2" : ""} transition-all duration-300 ease-in-out delay-150`}>
                        {!props.isPlaceHolder && <RiCheckDoubleFill size={24} className={`${message.isSeen ? "text-blue-400" : "text-zinc-400"} ${toggleLockControls ? "w-8 h-8" : "w-5 h-5"} transition-all delay-100 duration-300 ease-in-out`} />}
                        <div className={`font-bold ${toggleLockControls ? "text-xl" : "text-base"} transition-all delay-100 duration-300 ease-in-out`}>{formatCurrency(message.price)}</div>
                        {!props.isPlaceHolder && !message.isFinalOffer && <FaLock onClick={() => handleToggleLockControls(!toggleLockControls)} className={`${toggleLockControls ? "w-8 h-8 text-emerald-800" : "w-5 h-5"} transition-all duration-300 ease-in-out`} />}
                    </div >
                    <div className={`w-fit ${toggleLockControls ? "block opacity-100" : "hidden opacity-0"} transition-all transition-discrete delay-300 duration-300 ease-in-out}`}>
                        <LockControls handleLockOffer={props.handleLockOffer} isLockingOffer={props.isLockingOffer} message={message} handleToggleLockControls={handleToggleLockControls} />
                    </div>
                </div>
                <div className={`${toggleLockControls ? "opacity-0" : "opacity-100"} transition-all duration-300 ease-in-out`}>
                    <ElapsedTimeControl date={new Date(message.createdAt).toString()} />
                </div>
            </div >
        )
    } else {
        return (
            <div className={`${props.message.isFinalOffer ? "mt-4 border border-zinc-600" : ""} rounded relative p-2 w-fit pr-4 flex flex-col bg-white`}>
                {props.message.isFinalOffer && <div className='p-1 text-xs px-6 text-center flex gap-2 justify-center items-center bg-zinc-600 text-white rounded-t absolute -top-4 scale-[.7] origin-top-left left-0'>
                    <FaLock /> <div>Locked</div>
                </div>}
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