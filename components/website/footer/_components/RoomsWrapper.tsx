'use client'
import { useRooms } from '@/hooks/useRooms'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}

const RoomsWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)
    const [myUnreadBids, setMyUnreadBids] = useState(0)
    const [otherUnreadBids, setOtherUnreadBids] = useState(0)
    const rooms = useRooms((state: any) => state.rooms);

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

    }, [rooms])

    if (!isMounted) {
        return props.children
    }

    console.log(rooms)

    return (
        isMounted && <div className='relative flex items-center'>
            {myUnreadBids > 0 && <div className='absolute bg-emerald-500 drop-shadow-sm border-2 border-white text-white  font-semibold -top-2 -right-2 text-xs w-5 h-5 text-center flex items-center justify-center rounded-full '>{myUnreadBids}</div>}
            {otherUnreadBids > 0 && <div className='absolute bg-amber-500 drop-shadow-sm border-2 border-white text-white  font-semibold -top-2 -left-2 text-xs w-5 h-5 text-center flex items-center justify-center rounded-full '>{otherUnreadBids}</div>}
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default RoomsWrapper