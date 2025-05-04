import Button from '@/components/ui/Button'
import ImageUploadWrapper from '@/components/wrappers/ImageUploadWrapper'
import { formalizeText } from '@/lib/utils'
import { FileImageIcon, Trash } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const AddMedia = (props: Props) => {
    const [images, setImages] = useState<any[]>([])

    useEffect(() => {
        if (props.animal.images) {
            setImages(props.animal.images)
        }
    }, [props.animal])

    const handleAddMedia = (files: File[]) => {
        if (files.length > 4) {
            alert("You can only upload 4 files")
            return
        }
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('images', file)
        })
        console.log()
        props.setAnimal({ ...props.animal, images: formData.getAll('images') })
        setImages(formData.getAll('images'))
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


    console.log(props.animal)

    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4 select-none'>
            <div className='text-xl font-semibold tracking-tight text-center'>Please select atleast 4 images of {formalizeText(props.animal.breed)} {props.animal.type}</div>
            {!props.animal.images && <ImageUploadWrapper limit={4} onChange={handleAddMedia}>
                <div className='p-2 bg-emerald-100 cursor-pointer border-emerald-400 flex flex-col justify-center items-center rounded-xl border' style={{ boxShadow: "0px 20px 14px -8px #98d3b5" }}>
                    <FileImageIcon className='w-28 h-28 text-emerald-800' />
                    <div className='text-xl font-bold font-sans text-emerald-800'>Select Images</div>
                </div>
            </ImageUploadWrapper>}
            {images && images.length > 0 && <div className='flex flex-col gap-2 w-full'>
                <div className='flex items-center justify-between w-full'>
                    <div className='text-lg font-semibold'>Selected Images</div>
                    <Trash onClick={handleRemoveAllMedia} className='cursor-pointer w-8 h-8 border rounded-full p-1 text-red-500 fill-red-500 hover:text-red-700 transition-all duration-200 ease-in-out' />
                </div>
                <div className='flex flex-wrap gap-2 justify-center'>
                    {images.map((image: File, index: number) => {
                        return (
                            <div key={index} className='relative'>
                                <Trash onClick={() => handleRemoveMedia(index)} className='absolute w-5 h-5 top-1 right-1 z-10 cursor-pointer bg-white border p-1 rounded-full text-red-500 fill-red-500 hover:text-red-700 transition-all duration-200 ease-in-out' />
                                <Image src={URL.createObjectURL(image)} alt="animal" width={24} height={24} priority layout='fixed' className='w-24 h-24 object-contain border border-emerald-400 rounded-xl' />
                            </div>
                        )
                    })}
                </div>
            </div>}
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full' disabled={images && images.length === 4 ? false : true}>Next</Button>
            </div>
        </div >
    )
}

export default AddMedia