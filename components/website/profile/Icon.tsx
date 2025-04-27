import { images } from '@/consts/images'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const UserProfileIcon = (props: Props) => {
    return (
        <div>
            <Link href={'/animal/add'}>
                <Image src={images.hens.covers[3]} width={40} height={40} layout='fixed' loading='lazy' quality={100} alt='livestock' className='rounded-full object-cover w-10 h-10' />
            </Link>
        </div>
    )
}

export default UserProfileIcon