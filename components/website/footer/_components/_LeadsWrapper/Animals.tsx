'use client'
import { actions } from '@/actions/serverActions/actions'
import { images } from '@/consts/images'
import { calculatePricing, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    selectAnimal: (animal: any) => void
    selectedAnimal: any
    setIsFetching?: (val: boolean) => void
    defaultAnimalId?: string
    mode: "buying" | "selling"
    FreeMode?: boolean
}

const Animals = (props: Props) => {
    const [animals, setAnimals] = useState<any[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const user = useUser()

    useEffect(() => {
        setAnimals([])
        props.selectAnimal && props.selectAnimal(null)
    }, [props.mode])

    useEffect(() => {
        if (user && !isFetching) {
            fetchUserAnimals()
        } else {
            setAnimals([])
        }
    }, [user, props.mode])

    useEffect(() => {
        if (!isFetching) {
            if (animals.length > 0) {
                let target = null
                for (const aa of animals) {
                    if (aa.animal.id === props.defaultAnimalId) {
                        target = aa
                        break
                    }
                }
                props.selectAnimal && props.selectAnimal(target)
            }
        }
    }, [isFetching])

    const fetchUserAnimals = async () => {
        if (!user) return
        setIsFetching(true)
        props.setIsFetching && props.setIsFetching(true)
        let response
        if (props.mode === "buying") {
            response = await actions.client.leads.ImBuying(user.id)
        } else {
            response = await actions.client.leads.ImSelling(user.id)
        }
        if (response.status === 200) {
            const raw = []
            for (const lead of response.data) {
                let alreadyExists = false
                for (const temp of raw) {
                    temp.animal.id === lead.animal.id && (alreadyExists = true)
                }
                if (!alreadyExists) {
                    raw.push(lead)
                }
            }
            setAnimals(raw)
        } else {
            setAnimals([])
        }
        props.setIsFetching && props.setIsFetching(false)
        setIsFetching(false)
    }

    return (
        <div className='w-full h-full pt-1 flex flex-col gap-2'>
            {animals.length > 0 ? (
                animals.map((lead, index: number) => {

                    const animal = lead.animal

                    return (
                        <div onClick={() => props.selectAnimal && props.selectAnimal(animal)} key={`${animal.id}-${index}`} className={`p-2 cursor-pointer rounded border-b border-zinc-200 ${props.selectedAnimal ? props.selectedAnimal.id === animal.id ? "bg-amber-100" : "bg-zinc-100" : "bg-white"}`}>
                            <Image src={animal.images.length > 0 ? animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[100px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-contain' />
                            <div className='text-sm'>{Number(animal.maleQuantityAvailable ?? 0) + Number(animal.femaleQuantityAvailable ?? 0)} {animal.breed} {animal.type}</div>
                            <div className='text-xs text-zinc-700 line-clamp-1'>'{animal.title}'</div>
                            <div className='text-xs'>
                                <div className='flex justify-between items-center'>
                                    {Number(animal.maleQuantityAvailable > 0) && <div>Male: {animal.maleQuantityAvailable ?? 0} pc</div>}
                                    <div>Female: {animal.femaleQuantityAvailable ?? 0} pc</div>
                                </div>
                                <div className='text-sm font-bold tracking-wide w-full text-right'>{formatCurrency(calculatePricing(animal).price)}</div>
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className='p-4 text-center text-zinc-500'>No leads available</div>
            )}
        </div>
    )
}

export default Animals