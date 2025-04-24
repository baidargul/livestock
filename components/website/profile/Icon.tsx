import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {}

const UserProfileIcon = (props: Props) => {
    return (
        <div>
            <Image src={images.hens.covers[3]} width={200} height={200} quality={100} alt='livestock' className='rounded-full object-cover w-10 h-10' />
        </div>
    )
}

export default UserProfileIcon