import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import Image from 'next/image'
import React from 'react'

type Props = {
    animal: any

}

const GeneralBasicInformation = (props: Props) => {
    return (
        <div className='flex flex-col gap-2 overflow-y-auto h-[80%]'>
            <div>
                <div className='text-xl font-semibold'>
                    {props.animal.title}
                </div>
                <div>
                    {props.animal.description}
                </div>
            </div>
            <div className='flex flex-wrap gap-2'>
                {
                    props.animal.images && props.animal.images.length > 0 && props.animal.images.map((image: any, index: number) => {
                        if (!image.image) return null
                        return (
                            <Image src={image.image} width={100} height={100} layout='fixed' priority key={index} className=' rounded-md object-contain border border-emerald-800/10 drop-shadow-[2px]' alt={`${props.animal.title}, ${props.animal.type} - ${props.animal.breed}`} />
                        )
                    })
                }
            </div>
            <div>
                <CalculatedDescription animal={props.animal} />
            </div>
        </div>
    )
}

export default GeneralBasicInformation