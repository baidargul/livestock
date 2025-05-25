'use client'
import { actions } from '@/actions/serverActions/actions'
import MediaViewer from '@/components/controls/MediaViewer'
import ImageUploadWrapper from '@/components/wrappers/ImageUploadWrapper'
import { images } from '@/consts/images'
import { useSession } from '@/hooks/useSession'
import { constructBase64Image, fileToPayload } from '@/lib/image'
import { CameraIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    user: any
    image: any
    setImage: (image: any) => void
    children: React.ReactNode
}

const ProfileCoverImageChangeWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        const rawUser = getUser()
        if (rawUser) {
            setCurrentUser(rawUser)
        } else {
            setCurrentUser(null)
        }
        setIsMounted(true)
    }, [])

    if (!isMounted || props.user.id !== currentUser?.id) {
        return props.children
    }

    const handlecoverImageChange = async (files: File[]) => {
        try {
            const payloads = await Promise.all(files.map(fileToPayload));
            const image = constructBase64Image(payloads[0].base64, payloads[0].extension);
            props.setImage(image);
            props.user.coverImage = image
            const response = await actions.client.user.setCoverImage(currentUser?.id, payloads[0]);
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error converting files:", error);
            alert("There was an error processing your images. Please try again.");
        }
    }

    return (
        isMounted && <div className='w-full select-none relative flex justify-center group items-center'>
            <ImageUploadWrapper limit={1} onChange={handlecoverImageChange}>
                <CameraIcon width={40} height={40} className='absolute cursor-pointer right-2 bottom-3 drop-shadow-sm  text-white z-20' />
            </ImageUploadWrapper>
            <div className='w-full cursor-pointer'>
                <MediaViewer image={props.image ?? images.chickens.covers[3]}>
                    {props.children}
                </MediaViewer>
            </div>
        </div >
    )
}

export default ProfileCoverImageChangeWrapper