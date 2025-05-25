'use client'
import ProfileImageChangeWrapper from '@/components/website/profile/_components/ProfileImageChangeWrapper'
import { images } from '@/consts/images'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    user: any
}

const ProfileImage = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [image, setImage] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (props.user?.profileImage && props.user.profileImage.length > 0) {
            setImage(props.user.profileImage[0]?.image);
        } else {
            setImage(images.site.placeholders.userProfile);
        }
    }, [props.user])

    return (
        isMounted && <ProfileImageChangeWrapper user={props.user} image={image} setImage={setImage}>
            <Image src={image} draggable={false} width={100} height={100} quality={100} className='w-[120px] -ml-2 pointer-events-none select-none h-[120px] object-cover rounded-full border-6 border-white ' alt='janwarmarkaz' />
        </ProfileImageChangeWrapper>
    )
}

export default ProfileImage