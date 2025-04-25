import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {}

const SiteLogo = (props: Props) => {
    return (
        <Image src={images.site.logo.desktopIcon} alt={`site-logo`} width={64} height={64} loading='lazy' layout='fixed' quality={100} className='w-16 h-16 select-none' draggable={false} />
    )
}

export default SiteLogo