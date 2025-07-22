'use client'
import { actions } from '@/actions/serverActions/actions'
import { useDialog } from '@/hooks/useDialog'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import React, { use, useEffect, useState } from 'react'
import Button from '../ui/Button'

type Props = {
    children: React.ReactNode
    id: string
    animal: any
    onComplete?: () => void
}

const DeleteProductWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)
    const setLoading = useLoader((state: any) => state.setLoading)
    const [isAuthor, setIsAuthor] = useState(false)
    const dialog = useDialog((state) => state)

    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUser(rawUser)
            setIsAuthor(rawUser?.id === props.animal.userId)
        }
    }, [isMounted])


    const handleDelete = async () => {
        if (isAuthor) {
            dialog.closeDialog()
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

    const triggerDialog = () => {
        dialog.showDialog("Are you sure to remove this post?", <AreYouSureModal handleDelete={handleDelete} handleClose={() => dialog.closeDialog()} />)
    }

    if (!isAuthor) return null

    return (
        <div onClick={triggerDialog} className='cursor-pointer select-none md:hidden'>{props.children}</div>
    )
}

export default DeleteProductWrapper

const AreYouSureModal = (props: { handleDelete: () => void, handleClose: () => void }) => {
    return (
        <div>
            <div className='flex justify-evenly gap-2 px-4 items-center'>
                <Button onClick={props.handleDelete} className='w-full'>Yes</Button>
                <Button onClick={props.handleClose} variant='btn-secondary' className='w-full'>No</Button>
            </div>
        </div>
    )
}