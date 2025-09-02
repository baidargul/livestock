'use client'
import { actions } from '@/actions/serverActions/actions'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    toggleMenu?: (val: boolean) => void
}

const BrokerToggleSwitch = (props: Props) => {
    const user = useUser()
    const router = useRouter()
    const logoutUser = useSession((state: any) => state.logoutUser)
    const setLoading = useLoader((state: any) => state.setLoading)

    const handleToggleBroker = async () => {
        if (!user) return
        setLoading(true)
        const response = await actions.client.user.toggleBroker(user.id, !user.broker)
        if (response.status === 200) {
            logoutUser()
            if (props.toggleMenu) props.toggleMenu(false)
            router.refresh()
        }
        setLoading(false)
    }

    return (
        user && <>
            {!user.broker && <div onClick={handleToggleBroker} className='cursor-pointer text-xs tracking-tight text-emerald-700'>Switch to broker account</div>}
            {user.broker && <div onClick={handleToggleBroker} className='cursor-pointer text-xs tracking-tight text-emerald-700'>Switch to normal account</div>}
        </>
    )
}

export default BrokerToggleSwitch