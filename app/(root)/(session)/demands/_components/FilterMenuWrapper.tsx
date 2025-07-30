'use client'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { images } from '@/consts/images'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    where: any
    setWhere: any
    handleSelectAnimal: any
    animals: any
    handleSelectBreed: any
    fetchDemands: () => void
}

const FilterMenuWrapper = (props: Props) => {
    const [prev, setPrev] = useState({})
    const [open, setOpen] = useState(false)

    const handleOpen = (val: boolean) => {
        setOpen(val)
    }

    useEffect(() => {
        if (open) {
            setPrev(props.where)
        }
    }, [open])

    const handleChangeProvince = (val: string) => {
        if (!val || val.length === 0) {
            const raw = { ...props.where }
            delete raw.province
            props.setWhere(raw)
        } else {
            props.setWhere((prev: any) => ({
                ...prev,
                province: val
            }))
        }
    }

    const handleChangeCity = (val: string) => {
        if (!val || val.length === 0) {
            const raw = { ...props.where }
            delete raw.city
            props.setWhere(raw)
        } else {
            props.setWhere((prev: any) => ({
                ...prev,
                city: val
            }))
        }

    }

    return (
        <>
            <div className={`fixed top-0 right-0 bg-white flex flex-col justify-between  w-[90%] h-full z-[52] ${!open && "translate-x-full"} transition-all duration-200 ease-in-out p-4`}>
                <div className='flex gap-1 justify-between items-center mb-2'>
                    <div className='text-xl font-semibold'>Filters</div>
                    <div onClick={() => handleOpen(false)} className='cursor-pointer'>
                        <XIcon className='text-base text-zinc-700' />
                    </div>
                </div>
                <section className='w-full flex flex-col gap-1 h-[90dvh] overflow-y-auto'>
                    <div className='flex flex-wrap w-full h-[60%] max-h-[60vh] overflow-y-auto'>
                        {
                            props.animals.map((animal: any) => {
                                return (
                                    <div
                                        key={animal.id}
                                        className={`relative w-1/3 sm:w-1/5 h-20 sm:h-28 transition-all duration-200 ease-in-out flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 cursor-pointer ${props.where?.type && props.where?.type === animal.name.toLocaleLowerCase() ? "" : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => props.handleSelectAnimal(animal)}
                                    >
                                        <Image
                                            src={animal.image}
                                            alt={animal.name}
                                            priority
                                            layout="fixed"
                                            width={100}
                                            height={100}
                                            className={`w-full h-full absolute inset-0 z-0 object-cover mb-2 rounded-lg ${props.where?.type && props.where?.type === animal.name.toLocaleLowerCase() ? "" : ""
                                                } ${props.where?.type && props.where?.type !== animal.name.toLocaleLowerCase() ? "grayscale blur-[1px] opacity-70" : ""
                                                }`}
                                        />
                                        <div
                                            className={`text-lg absolute z-10 bottom-0 left-1/2 -translate-x-1/2 font-semibold transition-all duration-200 ease-in-out ${props.where?.type && props.where?.type === animal.name.toLocaleLowerCase()
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

                    </div>
                    <div className='h-[25%]'>
                        <div className='font-semibold text-xl my-2'>Breed:</div>
                        <div className='columns-3 sm:columns-5 w-full h-[60%] max-h-[60vh] overflow-y-auto'>
                            {
                                props.where?.type && images[props.where?.type]?.breeds.map((animal: any, index: number) => {
                                    return (
                                        <div key={`${animal.id}-${index}`} className={`w-fit cursor-pointer p-1 rounded transition-all duration-200 ease-in-out  ${props.where?.breed && props.where?.breed === animal.name.toLocaleLowerCase() ? "text-emerald-700 bg-emerald-50" : "hover:bg-gray-100 text-zinc-700"}`} onClick={() => props.handleSelectBreed(animal)}>
                                            <h1 className={`text-sm font-semibold transition-all duration-200 ease-in-out w-full`}>{animal.name}</h1>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='px-2 flex justify-between gap-2 items-center'>
                        <Textbox label='Province' placeholder='Punjab' onChange={(val: string) => handleChangeProvince(val)} value={props.where?.province ?? ""} />
                        <Textbox label='District' placeholder='Lahore' onChange={(val: string) => handleChangeCity(val)} value={props.where?.city ?? ""} />
                    </div>
                </section>
                <div className='flex justify-between items-center gap-2 w-full'>
                    <Button onClick={() => { props.setWhere(prev); handleOpen(false) }} className='w-full' variant='btn-secondary'>Cancel</Button>
                    <Button onClick={() => { props.fetchDemands(); handleOpen(false) }} className='w-full' variant='btn-primary'>Filter</Button>
                </div>
            </div>
            <div onClick={() => handleOpen(!open)} className={`cursor-pointer text-zinc-700`}>{props.children}</div>
            <div onClick={() => { props.setWhere(prev); handleOpen(false) }} className={`inset-0 fixed top-0 left-0 z-50 bg-black/50 backdrop-blur-[1px] transition duration-200 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}></div>
        </>
    )
}

export default FilterMenuWrapper