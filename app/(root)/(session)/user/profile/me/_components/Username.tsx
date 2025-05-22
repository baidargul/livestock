'use client'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {}

const Username = (props: Props) => {
    const getUser = useSession((state: any) => state.getUser)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const rawUser = getUser()
        if (rawUser) {
            setUser(rawUser)
        } else {
            setUser(null)
        }
    }, [])

    return (
        <div className=''>
            <div className='text-2xl font-semibold'>{user?.name}</div>
            <div className='text-sm font-medium text-zinc-600'>{user?.email}</div>
        </div>
    )
}

export default Username