'use client'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'

type Props = {}

const Username = (props: Props) => {
    const user = useUser()
    return (
        <span className='tracking-wide text-wrap max-w-44 sm:max-w-full line-clamp-1'>{user?.name ?? ""}</span>
    )
}

export default Username