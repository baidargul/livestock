'use client'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {
    children: React.ReactNode
    where: any
    setWhere: any
    handleSelectAnimal: any
    animals: any
}

const FilterMenuWrapper = (props: Props) => {
    const [open, setOpen] = useState(false)

    const handleOpen = (val: boolean) => {
        setOpen(val)
    }

    return (
        <>
            <div className={`fixed top-0 right-0 bg-white w-[90%] h-full z-[52] ${!open && "translate-x-full"} transition-all duration-200 ease-in-out p-4`}>
                <div className='flex gap-1 justify-between items-center'>
                    <div className='text-xl font-semibold'>Filters</div>
                    <div onClick={() => handleOpen(false)} className='cursor-pointer'>
                        <XIcon className='text-base text-zinc-700' />
                    </div>
                </div>
                <section className='w-full flex flex-col gap-1 mt-2'>
                    <div className='flex flex-wrap items-start justify-start gap-4 w-full h-full max-h-[60vh] overflow-y-auto'>
                        {
                            props.animals.map((animal: any) => {
                                return (
                                    <div
                                        key={animal.id}
                                        className={`relative w-20 sm:w-[400px] h-20 transition-all duration-200 ease-in-out flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 cursor-pointer ${props.where?.type && props.where?.type === animal.name.toLocaleLowerCase() ? "" : "hover:bg-gray-100"
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
                </section>
            </div>
            <div onClick={() => handleOpen(!open)} className={`cursor-pointer text-zinc-700`}>{props.children}</div>
            <div onClick={() => handleOpen(false)} className={`inset-0 fixed top-0 left-0 z-50 bg-black/50 backdrop-blur-[1px] transition duration-200 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}></div>
        </>
    )
}

export default FilterMenuWrapper