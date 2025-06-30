'use client'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    userId: string
}

const PersonalDetailsProtector = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const getUser = useSession((state: any) => state.getUser)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUser(rawUser)
        }
    }, [isMounted])

    if (!user && isMounted) {
        return null
    }

    if (isMounted && user && user.id !== props.userId) {
        return null
    }

    return (
        isMounted && <div className='w-full'>
            <div className='w-full'>
                {
                    props.children
                }
            </div>
        </div>
    )
}

export default PersonalDetailsProtector