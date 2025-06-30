'use client'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {}

const SessionProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            if (rawUser) {
                window.location.replace("/home")
            }
        }

    }, [isMounted])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <></>
    )
}

export default SessionProtection