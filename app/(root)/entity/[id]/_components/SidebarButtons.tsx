'use client'
import { actions } from '@/actions/serverActions/actions'
import { useUser } from '@/socket-client/SocketWrapper'
import { InteractionType } from '@prisma/client'
import { HeartIcon, ShareIcon } from 'lucide-react'
import React from 'react'

type Props = {
    animal: any
}

const SidebarButtons = (props: Props) => {
    const user = useUser()

    const doInteraction = async (type: InteractionType) => {
        const response: any = await actions.client.user.interactions.saveInteraction(props.animal.id, user.id, type)
    }

    return (
        <div className='w-fit z-[1] scroll-smooth fixed flex flex-col gap-2 right-0 bottom-1/2 translate-y-1/2 bg-white p-2 py-4 rounded-l-md border border-zinc-200 shadow-sm'>
            <HeartIcon size={20} />
            <ShareIcon size={20} />
        </div>
    )
}

export default SidebarButtons