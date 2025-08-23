'use client'
import { ChevronLeft, ChevronLeftIcon, MoveRightIcon, PanelLeftIcon, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import Animals from './_LeadsWrapper/Animals'
import SelectedAnimal from './_LeadsWrapper/SelectedAnimal'
import CoinsAvailable from '../../profile/_components/CoinsAvailable'

type Props = {
    children: React.ReactNode
}

const LeadsWrapper = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedAnimal, setSelectedAnimal] = useState<any>(null)


    const handleOpen = (val: boolean) => {
        setIsOpen(val)
    }

    const handleSelectAnimal = (animal: any) => {
        setSelectedAnimal(animal)
    }

    return (
        <>
            <div className={`fixed top-0 left-0 inset-0 ${isOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"} transition-all duration-300 ease-in-out w-full h-full text-black bg-white z-50`}>
                <div className='flex justify-between items-center py-2'>
                    <div className='flex gap-5 items-center w-full p-2'>
                        <div onClick={() => handleOpen(false)} className='cursor-pointer'>
                            <ChevronLeftIcon />
                        </div>
                        <div className='leading-3'>
                            <div className='text-lg font-bold'>Leads</div>
                            <div className='leading-1'>
                                <div className='text-zinc-600 text-sm'>Leads are buyers which are interested in buying your animal</div>
                            </div>
                        </div>
                    </div>
                    <div className='pr-4'>
                        <CoinsAvailable />
                    </div>
                </div>
                <div className='text-zinc-500 font-bold p-1 px-4 border-y border-zinc-500'>
                    Your Animals and their leads are listed below
                </div>
                <div className='w-full h-full grid grid-cols-[35%_1fr] bg-zinc-100'>
                    <section className='p-1 h-[calc(100vh-140px)] overflow-y-auto bg-white'>
                        {isOpen && <Animals selectAnimal={handleSelectAnimal} selectedAnimal={selectedAnimal} />}
                    </section>
                    <section className='p-2 h-[calc(100vh-140px)] overflow-y-auto bg-zinc-100'>
                        <SelectedAnimal selectedAnimal={selectedAnimal} />
                    </section>
                </div>
            </div>
            <div onClick={() => handleOpen(true)}>{props.children}</div>
        </>
    )
}

export default LeadsWrapper