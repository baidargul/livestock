'use client'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {}

const SessionProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUser(rawUser)
            window.location.replace("/home")
        }

    }, [isMounted])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <span className='font-bold tracking-wide'>{user?.name ? user.name : "man"}</span>
    )
}

export default SessionProtection