'use client'
import { actions } from '@/actions/serverActions/actions'
import { useLoader } from '@/hooks/useLoader'
import React from 'react'

type Props = {
    children: React.ReactNode
    id: string
    onComplete?: () => void
}

const DeleteDemandWrapper = (props: Props) => {
    const setLoading = useLoader((state: any) => state.setLoading)

    const handleDelete = async () => {
        setLoading(true)
        const response = await actions.client.demand.removeDemand(props.id)
        if (response.status === 200) {
            if (props.onComplete) {
                props.onComplete()
            } else {
                window.location.replace("/home")
            }
        }
        setLoading(false)
    }

    return (
        <div onClick={handleDelete} className='cursor-pointer select-none'>{props.children}</div>
    )
}

export default DeleteDemandWrapper