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
import { FilterIcon, XIcon } from 'lucide-react'
import FilterMenuWrapper from './_components/FilterMenuWrapper'
import { formalizeText } from '@/lib/utils'
import { useLoader } from '@/hooks/useLoader'

type Props = {}

const page = (props: Props) => {
    const [demands, setDemands] = useState([])
    const [user, setUser] = useState(null)
    const getUser = useSession((state: any) => state.getUser)
    const [where, setWhere] = useState<any>({})
    const setLoading = useLoader((state: any) => state.setLoading)

    const fetchDemands = async (forcedWhere?: any) => {
        setLoading(true)
        const res = await actions.client.demand.listAll(forcedWhere ? forcedWhere : where)
        setDemands(res.data)
        setLoading(false)
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

    const handleSelectBreed = (breed: any) => {
        if (breed.name.toLocaleLowerCase() === where?.breed) {
            const raw = { ...where }
            delete raw.breed
            setWhere(raw)
        } else {
            setWhere({ ...where, breed: breed.name.toLocaleLowerCase() })
        }
    }

    return (
        <div className='flex flex-col justify-between w-full min-h-[100dvh] select-none'>
            <div>
                <GeneralHeader />
                <div className='flex justify-between items-center px-4'>
                    <h1 className='text-2xl font-semibold tracking-tight '>Demand Center</h1>
                    <div className='flex items-center gap-2'>
                        <span className='text-zinc-700'>
                            {demands && demands.length > 0 && <p>{`(${demands.length}) -`}</p>}
                        </span>
                        <span>
                            <FilterMenuWrapper where={where} setWhere={setWhere} handleSelectAnimal={handleSelectAnimal} animals={animals} handleSelectBreed={handleSelectBreed} fetchDemands={fetchDemands}>
                                <FilterIcon className={`${where?.type || where?.breed || where?.city || where?.province ? "fill-emerald-100" : "text-zinc-700"}`} />
                            </FilterMenuWrapper>
                        </span>
                    </div>
                </div>
                {(where?.type || where?.breed || where?.city || where?.province) && <div className='px-4'>
                    <div className='scale-75 origin-top-left w-fit flex items-center gap-1 p-1 text-emerald-700 rounded bg-emerald-50 border border-emerald-100'>
                        {where?.breed && <div onClick={() => { const raw = { ...where }; delete raw.breed; setWhere(() => raw); fetchDemands(raw) }} className='flex items-center gap-1 cursor-pointer'>{formalizeText(where?.breed ?? "")} <XIcon className='text-xs' /></div>}
                        {where?.type && <div onClick={() => { const raw = { ...where }; delete raw.type; setWhere(() => raw); fetchDemands(raw) }} className='flex items-center gap-1 cursor-pointer'>{`${formalizeText(where?.type ?? "")}`} <XIcon className='text-xs' /></div>}
                        {where?.city && <div onClick={() => { const raw = { ...where }; delete raw.city; setWhere(() => raw); fetchDemands(raw) }} className='flex items-center gap-1 cursor-pointer'>{`${formalizeText(where?.city ?? "")}`} <XIcon className='text-xs' /></div>}
                        {where?.province && <div onClick={() => { const raw = { ...where }; delete raw.province; setWhere(() => raw); fetchDemands(raw) }} className='flex items-center gap-1 cursor-pointer'>{`${formalizeText(where?.province ?? "")}`} <XIcon className='text-xs' /></div>}
                    </div>
                </div>}
            </div>
            <section className='p-2 h-auto px-4'>
                {/* <DemandRowLite title='Latest demands' /> */}
                <div className='flex flex-col gap-4'>


                    <div className='space-y-4 columns-2 sm:columns-3 md:columns-4 lg:columns-5'>
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