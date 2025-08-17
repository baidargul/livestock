'use client'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'

type Props = {
    hidden?: boolean
    matchId?: string
}

const SessionProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const user = useUser()

    useEffect(() => {
        if (isMounted) {
            if (!user) {
                window.location.replace("/home")
            }
            if (props.matchId) {
                if (props.matchId !== user?.id) {
                    window.location.replace("/home")
                }
            }
        }
    }, [user, isMounted])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!props.hidden) {
        return (
            <span className='font-bold tracking-wide'>{user?.name ? user.name : "man"}</span>
        )
    } else {
        return null
    }
}

export default SessionProtection