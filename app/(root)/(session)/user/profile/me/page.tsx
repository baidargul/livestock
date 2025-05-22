import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import Username from './_components/Username'
import FollowButton from '@/components/ui/FollowButton'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='relative w-full min-h-[100vh]'>
            <div className='relative w-full h-[250px] mb-24'>
                <Image src={images.chickens.covers[3]} draggable={false} width={100} height={100} quality={100} className='w-full h-[250px] pointer-events-none select-none object-cover' alt='janwarmarkaz' />
                <div className='flex justify-between w-full px-8 items-center absolute z-10 bottom-[-75px]'>
                    <Image src={images.chickens.covers[3]} draggable={false} width={100} height={100} quality={100} className='w-[120px] -ml-2 pointer-events-none select-none h-[120px] object-cover rounded-full border-6 border-white ' alt='janwarmarkaz' />
                    <div className='font-normal tracking-tight text-sm flex flex-col justify-end items-end gap-1'>
                        <FollowButton />
                        <div><span className='tracking-wide'>404 </span>posts <span className='tracking-wide'>1.6k </span>likes</div>
                    </div>
                </div>
                <div className='absolute bottom-0 left-0 bg-gradient-to-t from-white to-transparent w-full h-[100px] select-none'></div>
            </div>
            <div className='px-8'>
                <div className=''>
                    <Username />
                </div>
            </div>
        </div>
    )
}

export default page