import { images } from '@/consts/images'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IoReturnUpBackSharp } from 'react-icons/io5'
import AuthorCard from './AuthorCard'
import UserCard from './UserCard'
import Message from './Message'
import Textbox from '@/components/ui/Textbox'
import Button from '@/components/ui/Button'
import { serialize } from 'bson'
import { useDialog } from '@/hooks/useDialog'
import { useRooms } from '@/hooks/useRooms'
import { Bids } from '@prisma/client'
import FinalBidSelection from './FinalBidSelection'

type Props = {
    animal: any
    currentRoom: any
    handleSelectCurrentRoom: (room: any) => void
    refresh: () => void
}

const Chatroom = (props: Props) => {
    const [value, setValue] = useState<number | null>(0)
    const [tempMessage, setTempMessage] = useState<Bids | null>(null)
    const [isLockingOffer, setIsLockingOffer] = useState(false)
    const [lockedBids, setLockedBids] = useState<Bids[]>([])
    const user = useUser();
    const isLastMessageWasMine = props.currentRoom?.bids[props.currentRoom?.bids.length - 1]?.userId === user?.id
    const isAuthor = props.animal.userId === user?.id
    const socket = useSocket();
    const dialog = useDialog();
    const Rooms = useRooms();

    useEffect(() => {
        setIsLockingOffer(false)
        props.refresh()
        setTempMessage(null)
        extractLockedBids(props.currentRoom.bids)
    }, [Rooms.rooms.myRooms, Rooms.rooms.otherRooms])

    const extractLockedBids = (bids: any[]) => {
        if (user) {
            let myBid = null
            let otherUserBid = null

            for (const bid of bids) {
                if (bid.userId === user.id) {
                    if (bid.isFinalOffer && !myBid) {
                        myBid = bid
                    }
                } else {
                    if (bid.isFinalOffer && !otherUserBid) {
                        otherUserBid = bid
                    }
                }
            }
            let locked = []
            if (myBid) {
                locked.push(myBid)
            }

            if (otherUserBid) {
                locked.push(otherUserBid)
            }

            setLockedBids(locked)
        } else {
            setLockedBids([])
        }
    }

    const handleValueChange = (val: string) => {
        const raw = val && val.length > 0 ? Number(val) : null
        setValue(raw)
    }

    const handleOnKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }

    const handleSendMessage = async () => {
        if (!user) dialog.showDialog("Unable to send message", null, "Please login again!")
        if (socket) {
            if (!isLastMessageWasMine) {
                setTempMessage({
                    bidRoomId: props.currentRoom.id,
                    createdAt: new Date(),
                    id: `${props.currentRoom.id}-${user.id}`,
                    intial: false,
                    isFinalOffer: false,
                    isSeen: false,
                    price: value || 0,
                    userId: user.id
                })
                socket.emit("place-bid", serialize({ roomKey: props.currentRoom.key, userId: user.id, amount: value }));
                setValue(null)
            } else {
                dialog.showDialog("Unable to send message", null, "You can't send a message twice in a row")
            }
        } else {
            dialog.showDialog("Unable to send message", null, "Error: No internet connection")
        }
    }

    const handleLockOffer = async (message: Bids) => {
        if (socket) {
            if (user) {
                if (!isLockingOffer) {
                    setIsLockingOffer(true)
                    socket.emit("lock-bid-as-final-offer", serialize({ bid: message, userId: user.id }));
                } else {
                    dialog.showDialog("Unable to send message", null, "You can't lock an offer while another offer is being locked!")
                }
            } else {
                dialog.showDialog("Unable to send message", null, "Please login again!")
            }
        } else {
            dialog.showDialog("Unable to send message", null, "Error: No internet connection")
        }
    }

    const totalQuantity = Number(props.currentRoom.maleQuantityAvailable || 0) + Number(props.currentRoom.femaleQuantityAvailable || 0)
    const afterSlicedBids = props.currentRoom.bids.length > 3 ? props.currentRoom?.bids.slice(props.currentRoom?.bids.length - 3) : props.currentRoom.bids
    return (
        <div className='flex flex-col gap-2'>
            <div onClick={() => props.handleSelectCurrentRoom(null)} className='relative cursor-pointer'>
                <div className='absolute top-1 left-1 bg-white/50 z-[3] border border-white/30 p-2 px-4 rounded'>
                    <IoReturnUpBackSharp className='text-white' size={14} />
                </div>
                <div className='absolute bottom-1 left-2 z-[2] text-white'>
                    <div className='leading-2'>
                        <div className='text-sm'>{totalQuantity} x Persian Cats</div>
                        <div className='text-zinc-400 text-xs'>
                            {Number(props.currentRoom.maleQuantityAvailable || 0) > 0 && <span>{Number(props.currentRoom.maleQuantityAvailable || 0)} Male</span>}
                            {Number(props.currentRoom.femaleQuantityAvailable || 0) > 0 && <span>{Number(props.currentRoom.femaleQuantityAvailable || 0)} Female</span>}
                        </div>
                    </div>
                </div>
                <div className='w-full h-[100%] absolute pointer-events-none rounded-md bg-gradient-to-r from-black to-transparent z-[1]'></div>
                <Image src={props.animal.images.length > 0 ? props.animal.images[0].image : images.chickens.images[1]} width={100} height={100} className='w-full h-20 origin-top-left rounded-md object-cover' alt='janwarmarkaz' />
            </div>
            <div>
                {isAuthor && <AuthorCard room={props.currentRoom} />}
                {!isAuthor && <UserCard room={props.currentRoom} />}
            </div>
            {lockedBids.length !== 2 &&
                <section>
                    <div className='flex flex-col gap-2 bg-amber-700/10 p-2 max-h-[300px] overflow-y-auto'>
                        {
                            afterSlicedBids.map((bid: any, index: number) => {

                                return (
                                    <Message handleLockOffer={handleLockOffer} isLockingOffer={isLockingOffer} key={`${bid.id}-${index}`} message={bid} currentRoom={props.currentRoom} />
                                )
                            })
                        }
                        {
                            tempMessage &&
                            <Message handleLockOffer={handleLockOffer} isLockingOffer={isLockingOffer} message={tempMessage} currentRoom={props.currentRoom} isPlaceHolder />
                        }
                    </div>
                    <div className='relative'>
                        <div className='grid grid-cols-[2fr_1fr] gap-2 p-2 bg-white shadow-sm'>
                            <Textbox disabled={isLastMessageWasMine || tempMessage !== null || isLockingOffer} onKeyDown={handleOnKeyDown} onChange={handleValueChange} value={value ?? ''} type='number' className='w-full' />
                            <Button disabled={isLastMessageWasMine || tempMessage !== null || isLockingOffer} onClick={handleSendMessage} className='w-full'>Send</Button>
                        </div>
                    </div>
                </section>
            }
            {
                lockedBids.length === 2 &&
                <FinalBidSelection lockedBids={lockedBids} isAuthor={isAuthor} />
            }
        </div>
    )
}

export default Chatroom