'use client'
import { actions } from '@/actions/serverActions/actions'
import React from 'react'

type Props = {
    children: React.ReactNode
    id: string
    onComplete?: () => void
}

const DeleteProductWrapper = (props: Props) => {

    const handleDelete = async () => {
        const response = await actions.client.posts.removePost(props.id)
        console.log(response)
        if (response.status === 200) {
            if (props.onComplete) {
                props.onComplete()
            } else {
                window.location.replace("/home")
            }
        }
    }

    return (
        <div onClick={handleDelete} className='cursor-pointer select-none'>{props.children}</div>
    )
}

export default DeleteProductWrapper