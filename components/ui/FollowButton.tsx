'use client'
import { CheckIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {}

const FollowButton = (props: Props) => {
    const [followed, setFollowed] = useState(false)

    const handleClick = () => {
        setFollowed(!followed)
    }


    return (
        <button onClick={handleClick} className={`text-md p-2 px-4 cursor-pointer  ${followed ? 'bg-emerald-400 tracking-wide font-semibold' : 'hover:bg-emerald-200 bg-zinc-200'} w-fit transition-all duration-300 border-4 border-white rounded-lg tracking-wide`}>{followed ? <div className="flex gap-1 items-center"><CheckIcon className="w-4 h-4"/> <div>Following</div></div> : "Follow"}</button>
    )
}

export default FollowButton