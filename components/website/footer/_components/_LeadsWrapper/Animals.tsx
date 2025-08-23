'use client'
import { actions } from '@/actions/serverActions/actions'
import { images } from '@/consts/images'
import { useUser } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    selectAnimal: (animal: any) => void
    selectedAnimal: any
}

const Animals = (props: Props) => {
    const [animals, setAnimals] = useState<any[]>([])
    const user = useUser()

    useEffect(() => {
        if (user) {
            fetchUserAnimals()
        } else {
            setAnimals([])
        }
    }, [user])

    const fetchUserAnimals = async () => {
        if (!user) return
        const response = await actions.client.posts.listByUser(user.id)
        if (response.status === 200) {
            setAnimals(response.data)
            console.log(response.data)
        } else {
            setAnimals([])
        }
    }

    return (
        <div className='w-full h-full pt-2 flex flex-col gap-2'>
            {animals.length > 0 ? (
                [...animals, ...animals, ...animals, ...animals, ...animals, ...animals, ...animals, ...animals, ...animals, ...animals, ...animals,].map((animal, index: number) => (
                    <div onClick={() => props.selectAnimal && props.selectAnimal(animal)} key={`${animal.id}-${index}`} className={`p-2 cursor-pointer rounded border-b border-zinc-200 ${props.selectedAnimal && props.selectedAnimal.id === animal.id ? "bg-emerald-100" : "bg-zinc-100"}`}>
                        <Image src={animal.images.length > 0 ? animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[100px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-contain' />
                        <div className='text-xs font-bold'>{animal.title}</div>
                    </div>
                ))
            ) : (
                <div className='p-4 text-center text-zinc-500'>No leads available</div>
            )}
        </div>
    )
}

export default Animals