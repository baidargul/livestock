'use client'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {}

const Username = (props: Props) => {
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
    }, []);

    return (
        <span className='tracking-wide text-wrap max-w-44 sm:max-w-full line-clamp-1'>{user?.name ?? ""}</span>
    )
}

export default Username