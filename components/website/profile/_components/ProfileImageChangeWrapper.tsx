'use client'
import { actions } from '@/actions/serverActions/actions'
import MediaViewer from '@/components/controls/MediaViewer'
import ImageUploadWrapper from '@/components/wrappers/ImageUploadWrapper'
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

const ProfileImageChangeWrapper = (props: Props) => {
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

    const handleProfileImageChange = async (files: File[]) => {
        try {
            const payloads = await Promise.all(files.map(fileToPayload));
            const image = constructBase64Image(payloads[0].base64, payloads[0].extension);
            props.setImage(image);
            props.user.profileImage = image
            const response = await actions.client.user.setProfileImage(currentUser?.id, payloads[0]);
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
            <ImageUploadWrapper limit={1} onChange={handleProfileImageChange}>
                <CameraIcon width={40} height={40} className='absolute cursor-pointer left-8 bottom-3 drop-shadow-sm  text-white z-10' />
            </ImageUploadWrapper>
            <div className='w-full cursor-pointer'>
                <MediaViewer image={props.user.profileImage[0]?.image ?? props.image}>
                    {props.children}
                </MediaViewer>
            </div>
        </div >
    )
}

export default ProfileImageChangeWrapper