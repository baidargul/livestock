'use client'
import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { useSession } from '@/hooks/useSession'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    activeBidRoomId: string
    user: any
}

const CTOButton = (props: Props) => {
    const [isFetching, setIsFetching] = useState(false)
    const dialog = useDialog()
    const [user, setUser] = useState<any>(null)
    const fetchBalance = useSession((state: any) => state.fetchBalance)

    const handleClick = async () => {
        if (!isFetching) {
            setIsFetching(true)
            const response = await actions.client.bidRoom.GetCustomerContact(props.activeBidRoomId, props.user.id)
            if (response.status === 200) {
                setUser(response.data)
                fetchBalance()
            } else {
                dialog.showDialog(`Unable to get user information`, null, `Error: ${response.message}`)
            }
            setIsFetching(false)
        }
    }


    return (
        <>
            {!user && <div className={`w-full ${isFetching ? 'opacity-50 pointer-events-none grayscale-100' : ''}`}>
                <Button onClick={handleClick} className='w-full'>Call</Button>
            </div>}
            {user && <Link href={`tel:${user.phone}`} className='w-full border-2 text-lg cursor-pointer text-center border-dashed border-emerald-600 p-4 text-emerald-700 bg-emerald-50 rounded-lg'>
                {user.phone}
            </Link>}
        </>
    )

}

export default CTOButton