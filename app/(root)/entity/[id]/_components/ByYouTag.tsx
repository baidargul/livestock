'use client'
import { useUser } from '@/socket-client/SocketWrapper'
import React from 'react'

type Props = {
    animal: any
}

const ByYouTag = (props: Props) => {
    const user = useUser()
    const isTrue = user && props.animal && user.id === props.animal.userId
    return (
        isTrue && <div className='w-fit tracking-tight scale-90 origin-top-left p-1 px-2 pr-4 text-sm bg-emerald-700 text-white rounded-r-full'>by You</div>
    )
}

export default ByYouTag