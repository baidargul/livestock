'use client'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {}

const SessionProtection = (props: Props) => {
    const getUser = useSession((state: any) => state.getUser)
    const router = useRouter()

    useEffect(() => {
        const rawUser = getUser()
        if (!rawUser) {
            router.push("/home")
        }
    }, [])

    return (
        null
    )
}

export default SessionProtection