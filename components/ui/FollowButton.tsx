'use client'
import { actions } from '@/actions/serverActions/actions'
import { useSession } from '@/hooks/useSession'
import { CheckIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    targetUserId: string
    targetFollowingList: any[]
}

const FollowButton = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [followed, setFollowed] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)
    const setUser = useSession((state: any) => state.setUser)

    useEffect(() => {
        const rawUser = getUser()
        if (rawUser) {
            setCurrentUser(rawUser)
        } else {
            setCurrentUser(null)
        }

        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (currentUser) {
            const isFollowing = currentUser.following.some((user: any) => user.id === props.targetUserId)
            setFollowed(isFollowing)
        }
    }, [currentUser])

    const handleClick = () => {
        handleFollowFunction()
    }

    const handleFollowFunction = async () => {
        const response = await actions.client.user.followUser(props.targetUserId, currentUser?.id)
        if (response.status === 200) {
            setFollowed(!followed)
            const newUser = currentUser ? { ...currentUser, ...response.data } : null
            setUser(newUser)
        } else {
            console.log(response)
        }
    }

    if (currentUser?.id === props.targetUserId) {
        return (
            <div className='my-2'>
            </div>
        )
    }


    return (
        isMounted && <button onClick={handleClick} className={`text-md p-2 px-4 cursor-pointer  ${followed ? 'bg-emerald-400 tracking-wide font-semibold' : 'hover:bg-emerald-200 bg-zinc-200'} w-fit transition-all duration-300 border-4 border-white rounded-lg tracking-wide`}>{followed ? <div className="flex gap-1 items-center"><CheckIcon className="w-4 h-4" /> <div>Following</div></div> : "Follow"}</button>
    )
}

export default FollowButton