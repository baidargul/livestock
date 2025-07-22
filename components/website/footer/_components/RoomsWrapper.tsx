'use client'
import { useRooms } from '@/hooks/useRooms'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'
import RoomListContainer from './_roomsWrapper/RoomListContainer'

type Props = {
    children: React.ReactNode
    forPhone?: boolean
}

const RoomsWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isToggled, setIsToggled] = useState(false)
    const getUser = useSession((state: any) => state.getUser)
    const [myUnreadBids, setMyUnreadBids] = useState(0)
    const [otherUnreadBids, setOtherUnreadBids] = useState(0)
    const rooms = useRooms((state: any) => state.rooms);
    const getLatestRooms = useRooms((state: any) => state.getLatestRooms);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUser(rawUser)
        }
    }, [isMounted])

    useEffect(() => {
        if (isMounted) {
            if (user) {
                const calculateUnreadBids = () => {
                    let count = 0
                    rooms.myRooms.forEach((room: any) => {
                        room.bids.forEach((bid: any) => {
                            if (bid.isSeen === false && bid.userId !== user.id) {
                                count = count + 1
                            }
                        })
                    })
                    setMyUnreadBids(count)
                    count = 0
                    rooms.otherRooms.forEach((room: any) => {
                        room.bids.forEach((bid: any) => {
                            if (bid.isSeen === false && bid.userId !== user.id) {
                                count = count + 1
                            }
                        })
                    })
                    setOtherUnreadBids(count)
                }
                calculateUnreadBids()
            }
        }
    }, [rooms, isMounted])

    if (!isMounted) {
        return props.children
    }

    const handleToggle = (toggle: boolean) => {
        setIsToggled(toggle)
    }

    return (
        isMounted && <>
            <RoomListContainer isToggled={isToggled} handleToggleMenu={handleToggle} rooms={rooms} user={user} />
            <div className='relative flex items-center'>
                {myUnreadBids > 0 && <div className={`absolute pointer-events-none bg-emerald-500 drop-shadow-sm border-2 border-white text-white  font-semibold ${props.forPhone ? "top-1 right-1" : "-top-2 -right-2"}  text-xs w-5 h-5 text-center flex items-center justify-center rounded-full`}>{myUnreadBids}</div>}
                {otherUnreadBids > 0 && <div className={`absolute pointer-events-none bg-amber-500 drop-shadow-sm border-2 border-white text-white  font-semibold ${props.forPhone ? "top-1 left-1" : "-top-2 -left-2"}  text-xs w-5 h-5 text-center flex items-center justify-center rounded-full`}>{otherUnreadBids}</div>}
                <div onClick={() => handleToggle(!isToggled)} className='cursor-pointer' >
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default RoomsWrapper