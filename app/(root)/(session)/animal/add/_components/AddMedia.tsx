import Button from '@/components/ui/Button'
import SiteLogo from '@/components/website/logo/SiteLogo'
import ImageUploadWrapper from '@/components/wrappers/ImageUploadWrapper'
import { useLoader } from '@/hooks/useLoader'
import { constructBase64Image, fileToPayload, ImagePayload } from '@/lib/image'
import { formalizeText } from '@/lib/utils'
import { FileImageIcon, Trash, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    deletePost: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const AddMedia = (props: Props) => {
    const [images, setImages] = useState<any[]>([])
    const setLoading = useLoader((state: any) => state.setLoading)

    useEffect(() => {
        if (props.animal.images) {
            setImages(props.animal.images)
        }
    }, [props.animal])

    const handleAddMedia = async (files: File[]) => {
        if (files.length > 3) {
            files = files.slice(0, 3)
        }
        setLoading(true)
        try {
            // Convert all files to payloads in parallel
            const payloads = await Promise.all(files.map(fileToPayload));

            // Set into your animal state
            const prevAnimals = props.animal.images || []
            const newImages = [...prevAnimals, ...payloads]
            props.setAnimal({ ...props.animal, images: newImages.slice(0, 3) });
            setImages(payloads);

        } catch (error) {
            console.error("Error converting files:", error);
            alert("There was an error processing your images. Please try again.");
        }
        setLoading(false)
    }

    const handleRemoveMedia = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)
        props.setAnimal({ ...props.animal, images: newImages })
    }
    const handleRemoveAllMedia = () => {
        setImages([])
        props.setAnimal({ ...props.animal, images: [] })
    }


    return (
        <div className='w-full relative min-h-[95dvh] flex flex-col items-center gap-4 p-4 select-none'>
            <div className='flex flex-col gap-4'>
                <div className='text-xl font-semibold tracking-tight text-center'>Please select 3 images of {formalizeText(props.animal.breed)} {props.animal.type}</div>
                {images.length !== 3 && <ImageUploadWrapper limit={3} onChange={handleAddMedia}>
                    <div className='p-4 border border-zinc-200 px-6 cursor-pointer  flex flex-col justify-center items-center rounded-xl' style={{ boxShadow: "0px 20px 14px -8px #98d3b5" }}>
                        <SiteLogo size="lg" />
                        <div className='text-xl font-bold font-sans text-emerald-800 tracking-tight'>Select Images</div>
                        <div className='text-sm'>You can add <span className='font-semibold'>3 images</span> per post.</div>
                    </div>
                </ImageUploadWrapper>}
                {images && images.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                        {/* Header */}
                        <div className="flex items-center justify-between w-full">
                            <div className="text-lg font-semibold">Selected Images</div>
                        </div>

                        {/* Images and Add Slots */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-2 justify-start">
                                {/* Display existing images */}
                                {images.map((image: ImagePayload, index: number) => (
                                    <div key={index} className="flex flex-col gap-2">
                                        <Image
                                            src={`${constructBase64Image(image.base64, image.extension)}`}
                                            alt="animal"
                                            width={24}
                                            height={24}
                                            priority
                                            layout="fixed"
                                            className="w-24 h-24 object-cover border border-zinc-400 rounded-xl"
                                            style={{ boxShadow: "0px 13px 6px -8px #00000054" }}
                                        />
                                        <button
                                            onClick={() => handleRemoveMedia(index)}
                                            className="cursor-pointer underline text-start text-xs w-fit"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                {/* Add placeholder icons for empty slots */}
                                {Array.from({ length: 3 - images.length }).map((_, idx) => (
                                    <ImageUploadWrapper
                                        key={`placeholder-${idx}`}
                                        limit={3}
                                        onChange={handleAddMedia}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <FileImageIcon
                                                className="w-20 h-20 object-cover text-zinc-500 border border-zinc-400 rounded-xl"
                                                style={{ boxShadow: "0px 13px 6px -8px #00000054" }}
                                            />
                                            <div className="text-center text-xs w-fit">Add image</div>
                                        </div>
                                    </ImageUploadWrapper>
                                ))}
                            </div>

                            {/* Remove all images */}
                            <Trash
                                onClick={handleRemoveAllMedia}
                                className="cursor-pointer w-8 h-8 mb-5 border rounded-full p-1 text-slate-500 fill-slate-500 hover:text-slate-700 transition-all duration-200 ease-in-out"
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className='w-full p-4 mt-auto'>
                {props.animal && <div className='my-4 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Clear Post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                    <Button onClick={props.moveNext} className='w-full' disabled={false}>Next</Button>
                    {/* <Button onClick={props.moveNext} className='w-full' disabled={images && images.length === 3 ? false : true}>Next</Button> */}
                </div>
            </div>
        </div >
    )
}

export default AddMedia