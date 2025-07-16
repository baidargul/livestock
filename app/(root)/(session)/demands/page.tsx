'use client'
import { actions } from '@/actions/serverActions/actions'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import DemandRowLite from '@/components/website/sections/demands/list/DemandRowLite'
import { images } from '@/consts/images'
import { Demands } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import DemandCard from './_components/DemandCard'
import { useSession } from '@/hooks/useSession'

type Props = {}

const page = (props: Props) => {
    const [demands, setDemands] = useState([])
    const [user, setUser] = useState(null)
    const getUser = useSession((state: any) => state.getUser)
    const [where, setWhere] = useState<any>({

    })

    const fetchDemands = async () => {
        const res = await actions.client.demand.listAll(where)
        setDemands(res.data)
    }

    useEffect(() => {
        const rawUser = getUser()
        setUser(rawUser)
        fetchDemands()
    }, [])

    const animals = [
        {
            id: 1,
            name: "Dogs",
            image: images.dogs.images[1],
        },
        {
            id: 2,
            name: "Cats",
            image: images.cats.images[1],
        },
        {
            id: 3,
            name: "Cows",
            image: images.cows.images[1],
        },
        {
            id: 4,
            name: "Goats",
            image: images.goats.images[1],
        },
        {
            id: 5,
            name: "Sheeps",
            image: images.sheeps.images[1],
        },
        {
            id: 6,
            name: "Horses",
            image: images.horses.images[1],
        },
        {
            id: 8,
            name: "Chickens",
            image: images.chickens.images[1],
        },
        {
            id: 9,
            name: "Ducks",
            image: images.ducks.images[1],
        },
        {
            id: 12,
            name: "Rabbits",
            image: images.rabbits.images[1],
        },
    ]

    const handleSelectAnimal = (animal: any) => {
        if (animal.name.toLocaleLowerCase() === where?.type) {
            setWhere({})
        } else {
            setWhere({ ...where, type: animal.name.toLocaleLowerCase() })
        }
    }

    return (
        <div className='flex flex-col justify-between'>
            <GeneralHeader />
            <section className='p-2'>
                <h1 className='text-2xl font-semibold tracking-tight'>Demand Center</h1>
                {/* <DemandRowLite title='Latest demands' /> */}
                <div className='flex flex-col gap-2'>
                    {/* <div className='flex flex-wrap items-start justify-center gap-4 w-full h-full max-h-[60vh] overflow-y-auto'>
                        {
                            animals.map((animal: any) => {
                                return (
                                    <div
                                        key={animal.id}
                                        className={`relative w-20 sm:w-[400px] h-20 transition-all duration-200 ease-in-out flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 cursor-pointer ${where?.type && where?.type === animal.name.toLocaleLowerCase() ? "" : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => handleSelectAnimal(animal)}
                                    >
                                        <Image
                                            src={animal.image}
                                            alt={animal.name}
                                            priority
                                            layout="fixed"
                                            width={100}
                                            height={100}
                                            className={`w-full h-full absolute inset-0 z-0 object-cover mb-2 rounded-lg ${where?.type && where?.type === animal.name.toLocaleLowerCase() ? "" : ""
                                                } ${where?.type && where?.type !== animal.name.toLocaleLowerCase() ? "grayscale blur-[1px] opacity-70" : ""
                                                }`}
                                        />
                                        <div
                                            className={`text-lg absolute z-10 bottom-0 left-1/2 -translate-x-1/2 font-semibold transition-all duration-200 ease-in-out ${where?.type && where?.type === animal.name.toLocaleLowerCase()
                                                ? "bg-gradient-to-t from-emerald-700/40 to-transparent h-10"
                                                : "bg-gradient-to-t from-black/50 to-transparent h-14"
                                                } w-full text-white text-center`}
                                        ></div>
                                        <h1
                                            className={`text-lg absolute z-10 bottom-2 left-2 font-semibold transition-all duration-200 ease-in-out w-full text-white`}
                                            style={{ textShadow: "1px 1px 2px black" }}
                                        >
                                            {animal.name}
                                        </h1>
                                    </div>
                                );
                            })
                        }

                    </div> */}

                    <div className='flex flex-wrap items-start justify-start gap-2 py-10'>
                        {
                            demands.map((demand: Demands, index: number) => {
                                return (
                                    <DemandCard demand={demand} key={`demand-${index}-${demand.id}`} user={user} />
                                )
                            })
                        }

                    </div>
                </div>
            </section >
            {/* <GeneralFooter /> */}
        </div >
    )
}

export default page