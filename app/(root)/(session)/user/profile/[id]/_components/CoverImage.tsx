'use client'
import ProfileCoverImageChangeWrapper from '@/components/website/profile/_components/ProfileCoverImageChangeWrapper'
import { images } from '@/consts/images'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    user: any
}

const CoverImage = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [image, setImage] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (props.user?.coverImage && props.user.coverImage.length > 0) {
            setImage(props.user.coverImage[0]?.image);
        } else {
            setImage(images.site.placeholders.userCover);
        }
    }, [props.user])

    return (
        isMounted && <ProfileCoverImageChangeWrapper user={props.user} image={image} setImage={setImage}>
            <Image src={image} draggable={false} width={100} height={100} quality={100} className='w-full h-[200px] pointer-events-none select-none object-cover' alt='janwarmarkaz' />
        </ProfileCoverImageChangeWrapper>
    )
}

export default CoverImage