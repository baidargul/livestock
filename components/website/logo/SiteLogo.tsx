import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
    sm: { w: 32, h: 32, class: 'w-8 h-8' },
    md: { w: 64, h: 64, class: 'w-16 h-16' },
    lg: { w: 128, h: 128, class: 'w-32 h-32' },
}

const SiteLogo: React.FC<Props> = ({ size = 'md' }) => {
    const { w, h, class: cls } = SIZE_MAP[size]

    return (
        <Image
            src={images.site.logo.desktopIcon}
            alt="site-logo"
            width={w}
            height={h}
            loading="lazy"
            layout="fixed"
            quality={100}
            className={`${cls} select-none`}
            draggable={false}
        />
    )
}

export default SiteLogo
