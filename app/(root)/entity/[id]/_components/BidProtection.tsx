'use client'
import Button from '@/components/ui/Button'
import { useRooms } from '@/hooks/useRooms'
import { useSession } from '@/hooks/useSession'
import { formatCurrency } from '@/lib/utils'
import { ChartCandlestickIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    animalId: string
}

const BidProtection = (props: Props) => {
    const [user, setUser] = useState<any>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [bid, setBid] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)
    const rooms = useRooms((state: any) => state.rooms)
    const find = useRooms((state: any) => state.find)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            if (rawUser) {
                setUser(rawUser)
            }
        }
    }, [isMounted])

    useEffect(() => {
        if (rooms && user) {
            const room = find(props.animalId, user.id, "userId")
            if (room) {
                setBid(room.bids[room.bids.length - 1])
            }
        }
    }, [rooms, user])

    if (!isMounted) return props.children
    if (!user) return props.children
    if (!bid) {
        return props.children
    }

    return (
        <div className='w-full'>
            <Button variant='btn-primary' className='w-full flex gap-2 justify-center text-center items-center'>
                {!bid.isSeen && bid.user === user.id && <div className='w-4 h-4 left-2 bg-amber-500 rounded-full'></div>} <ChartCandlestickIcon className='w-6 h-6' /><div>{bid.user.name}</div> <div>({formatCurrency(bid.price)})</div>
            </Button>
        </div>
    )
}

export default BidProtection