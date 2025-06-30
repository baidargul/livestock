'use client'
import { actions } from '@/actions/serverActions/actions'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import React, { use, useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    id: string
    authorId: string
    onComplete?: () => void
}

const DeleteProductWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)
    const setLoading = useLoader((state: any) => state.setLoading)
    const [isAuthor, setIsAuthor] = useState(false)

    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUser(rawUser)
            setIsAuthor(rawUser?.id === props.authorId)
        }
    }, [isMounted])

    const handleDelete = async () => {
        if (isAuthor) {
            setLoading(true)
            const response = await actions.client.posts.removePost(props.id)
            if (response.status === 200) {
                if (props.onComplete) {
                    props.onComplete()
                } else {
                    window.location.replace("/home")
                }
            }
            setLoading(false)
        }
    }

    if (!isAuthor) return null

    return (
        <div onClick={handleDelete} className='cursor-pointer select-none'>{props.children}</div>
    )
}

export default DeleteProductWrapper