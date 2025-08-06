import { HeartIcon, ShareIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const SidebarButtons = (props: Props) => {
    return (
        <div className='w-fit z-[1] scroll-smooth fixed flex flex-col gap-2 right-0 bottom-1/2 translate-y-1/2 bg-white p-2 py-4 rounded-l-md border border-zinc-200 shadow-sm'>
            <HeartIcon size={20} />
            <ShareIcon size={20} />
        </div>
    )
}

export default SidebarButtons