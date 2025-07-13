import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import MediaViewer from '../controls/MediaViewer'

type Props = {
    images: any[]
}

const ProductGallery = (props: Props) => {
    const firstImage = props.images[0]?.image
    const otherImages = props.images.slice(1)

    return (
        <div className=''>
            <div className='flex gap-1 items-start h-full'>
                <div>
                    <MediaViewer image={firstImage ?? images.chickens.images[1]}>
                        <Image src={firstImage ?? images.chickens.images[1]} width={500} height={500} layout='fixed' loading='lazy' quality={50} alt='janwarmarkaz' className='w-[400px] h-[400px] object-cover' />
                    </MediaViewer>
                </div>
                <div className='flex flex-col gap-1 overflow-y-auto max-h-[400px]'>
                    {
                        otherImages.map((image: any, index: number) => {

                            return (
                                <MediaViewer key={`${image.id}-${index}`} image={image.image ?? images.chickens.images[1]}>
                                    <Image src={image.image ?? images.chickens.images[1]} width={500} height={500} layout='fixed' loading='lazy' quality={50} alt='janwarmarkaz' className='w-[198px] h-[198px] object-cover' />
                                </MediaViewer>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductGallery