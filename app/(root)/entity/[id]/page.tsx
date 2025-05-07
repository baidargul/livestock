import { actions } from '@/actions/serverActions/actions'
import BackNavigator from '@/components/controls/BackNavigator'
import DeleteProductWrapper from '@/components/controls/DeleteProductWrapper'
import MediaViewer from '@/components/controls/MediaViewer'
import Tag from '@/components/general/Tags/Tag'
import Button from '@/components/ui/Button'
import { images } from '@/consts/images'
import { formalizeText } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { ArrowLeftCircleIcon, ClipboardCheckIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        { id: '6' },
        { id: '7' },
        { id: '8' },
        { id: '9' },
        { id: '10' },
        { id: '11' },
        { id: '12' },
        { id: '13' },
    ]
}

const page = async (props: Props) => {
    const { params } = props
    const { id } = await params

    const response = await actions.server.post.list(id, 'id');
    const animal = response.data as any

    return (
        animal && <div className='relative w-full min-h-[100vh]'>
            <BackNavigator className='absolute top-3 left-3 z-10 bg-black/20 rounded-full p-1'>
                <ArrowLeftCircleIcon width={32} height={32} className='text-white' />
            </BackNavigator>
            <DeleteProductWrapper>
                <Trash2Icon size={32} className='absolute top-3 right-0 z-10 text-red-500 rounded-l-full w-14 bg-white p-1' />
            </DeleteProductWrapper>
            <div className='relative'>
                <Image
                    src={animal.images[0].image}
                    draggable={false}
                    priority
                    layout="fixed"
                    quality={50}
                    alt="hen"
                    width={100}
                    height={100}
                    style={{ height: "250px" }}
                    className="w-full h-[250px] z-0 select-none origin-top-left object-left-top object-cover"
                />

                <div className='bg-emerald-50 p-4 rounded-lg mx-4 absolute -mt-20 z-10' style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <h1 className='text-3xl text-center font-bold text-gray-800 mt-4'>{formalizeText(animal?.breed ?? "")} {formalizeText(animal?.type ?? "")}</h1>
                    <div className='px-4 py-2'>
                        <p className='text-sm text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
                    </div>
                </div>
            </div>
            <div className='mt-32 p-4'>
                <h2 className='text-lg font-bold text-gray-800'>{animal.title}</h2>
                <p className='text-sm text-gray-600'>{animal.description}</p>
            </div>
            <div className='px-4 flex flex-col gap-4'>
                <div className='flex flex-wrap justify-start items-start gap-2'>
                    {animal.images.map((item: any) => {
                        return (
                            <MediaViewer key={item.name} image={item.image}>
                                <Image src={item.image} alt='hen' width={100} height={100} quality={60} loading='lazy' layout='fixed' className='w-24 h-14 object-cover object-left-center rounded-xl cursor-pointer' />
                            </MediaViewer>
                        )
                    })}
                </div>
                <div className='flex justify-evenly items-center my-4 w-full'>{
                    animal.deliveryOptions.map((option: any) => {
                        return (
                            <div key={option} className='flex gap-1 items-center'><ClipboardCheckIcon size={20} className='text-emerald-700' /> {String(option).toLocaleLowerCase() === "self_pickup" ? "Self Pickup" : "Seller delivery"}</div>
                        )
                    })
                }</div>
            </div>
            <div className='my-4 flex justify-center items-center w-full'>
                <Button className='w-full mx-4'>Buy Now</Button>
            </div>
        </div>
    )
}

export default page