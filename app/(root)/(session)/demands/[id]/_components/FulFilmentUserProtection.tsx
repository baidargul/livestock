'use client'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    demand: any
}

const FulFilmentUserProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawuser = getUser()
            setUser(rawuser)
        }
    }, [isMounted])

    if (user && user.id === props.demand.userId) {
        return (
            <div className='pointer-events-none select-none w-full flex flex-col items-center justify-center'>
                <div className='w-full grayscale pointer-events-none select-none line-through'>
                    {props.children}
                </div>
                <label className='tracking-tight p-1 italic text-zinc-700'>You cannot fulfill your own demand</label>
            </div>
        )
    }

    return (
        <div className='w-full'>{props.children}</div>
    )
}

export default FulFilmentUserProtection