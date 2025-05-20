import { images } from '@/consts/images'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ProfileMenuWrapper from './_components/ProfileMenuWrapper'

type Props = {}

const UserProfileIcon = (props: Props) => {
    return (
        <div>
            <ProfileMenuWrapper>
                <Image src={images.chickens.covers[3]} width={40} height={40} layout='fixed' loading='lazy' quality={100} alt='janwarmarkaz' className='rounded-full object-cover w-10 h-10' />
            </ProfileMenuWrapper>
        </div>
    )
}

export default UserProfileIcon