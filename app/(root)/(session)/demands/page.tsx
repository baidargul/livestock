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
import { FilterIcon } from 'lucide-react'
import FilterMenuWrapper from './_components/FilterMenuWrapper'

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
        <div className='flex flex-col justify-between w-full min-h-[100dvh]'>
            <div>
                <GeneralHeader />
                <div className='flex justify-between items-center px-4'>
                    <h1 className='text-2xl font-semibold tracking-tight '>Demand Center</h1>
                    <div className='flex items-center gap-2'>
                        <span className='text-zinc-700'>
                            {demands && demands.length > 0 && <p>{`(${demands.length}) -`}</p>}
                        </span>
                        <span>
                            <FilterMenuWrapper where={where} setWhere={setWhere} handleSelectAnimal={handleSelectAnimal} animals={animals}>
                                <FilterIcon />
                            </FilterMenuWrapper>
                        </span>
                    </div>
                </div>
            </div>
            <section className='p-2 h-auto px-4'>
                {/* <DemandRowLite title='Latest demands' /> */}
                <div className='flex flex-col gap-4'>


                    <div className='flex flex-wrap items-start justify-start gap-4 py-10'>
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
            <GeneralFooter />
        </div >
    )
}

export default page