'use client'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const SessionProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const getUser = useSession((state: any) => state.getUser)
    const router = useRouter()

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            if (rawUser) {
                router.push("/home")
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