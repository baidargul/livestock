'use client'
import { images } from '@/consts/images'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ProfileMenuWrapper from './_components/ProfileMenuWrapper'
import { useSession } from '@/hooks/useSession'

type Props = {}

const UserProfileIcon = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser);

    useEffect(() => {
        const rawUser = getUser();
        setCurrentUser(rawUser);
        setIsMounted(true);
    }, [])


    if (!isMounted) {
        return (
            <div>
                <Image src={images.site.placeholders.userProfile} width={40} height={40} layout='fixed' loading='lazy' quality={100} alt='janwarmarkaz' className='rounded-full object-cover w-10 h-10' />
            </div>
        )
    }

    return (
        <div>
            <ProfileMenuWrapper>
                <Image src={currentUser.profileImage && currentUser.profileImage.length > 0 ? currentUser.profileImage[0].image : images.site.placeholders.userProfile} width={40} height={40} layout='fixed' loading='lazy' quality={100} alt='janwarmarkaz' className='rounded-full object-cover w-10 h-10' />
            </ProfileMenuWrapper>
        </div>
    )
}

export default UserProfileIcon