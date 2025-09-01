'use client'
import { actions } from '@/actions/serverActions/actions'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

const BrokerToggleSwitch = (props: Props) => {
    const user = useUser()
    const router = useRouter()
    const logoutUser = useSession((state: any) => state.logoutUser)

    const handleToggleBroker = async () => {
        if (!user) return

        const response = await actions.client.user.toggleBroker(user.id, !user.broker)
        if (response.status === 200) {
            logoutUser()
            router.refresh()
        }
    }

    return (
        user && <>
            {!user.broker && <div onClick={handleToggleBroker} className='text-xs tracking-tight text-emerald-700'>Switch to broker account</div>}
            {user.broker && <div onClick={handleToggleBroker} className='text-xs tracking-tight text-emerald-700'>Switch to normal account</div>}
        </>
    )
}

export default BrokerToggleSwitch