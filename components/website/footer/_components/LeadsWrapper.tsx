'use client'
import { ChevronDown, ChevronDownIcon, ChevronLeft, ChevronLeftIcon, MoveRightIcon, PanelLeftIcon, RefreshCcwIcon, SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Animals from './_LeadsWrapper/Animals'
import SelectedAnimal from './_LeadsWrapper/SelectedAnimal'
import CoinsAvailable from '../../profile/_components/CoinsAvailable'
import { useDialog } from '@/hooks/useDialog'
import { formalizeText } from '@/lib/utils'

type Props = {
    children: React.ReactNode
    defaultAnimalId?: string
}

const LeadsWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [mode, setMode] = useState<"buying" | "selling">("buying")
    const [selectedAnimal, setSelectedAnimal] = useState<any>(null)
    const dialog = useDialog()
    const layer = dialog.layer ?? ""

    useEffect(() => {
        setIsMounted(true)
        setSelectedAnimal(null)
    }, [])

    useEffect(() => {
    }, [isMounted])


    const handleOpen = (val: boolean) => {
        dialog.setLayer(val ? "footer-leadswrapper" : "")
        if (val) {
            if (props.defaultAnimalId && !isFetching && String(props.defaultAnimalId).length > 0) {
                setMode("selling")
            } else {
                setMode("buying")
            }
        }
    }

    const handleSelectAnimal = (animal: any) => {
        setSelectedAnimal(animal)
    }

    const handleChangeMode = (mode: "buying" | "selling") => {
        setMode(mode)
    }

    return (
        isMounted && <>
            <div className={`fixed top-0 left-0 inset-0 ${layer === "footer-leadswrapper" ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"} transition-all duration-300 ease-in-out w-full h-full text-black bg-white z-50`}>
                <div className='flex justify-between items-center py-2'>
                    <div className='flex gap-5 items-center w-full p-2'>
                        <div onClick={() => handleOpen(false)} className='cursor-pointer'>
                            <ChevronLeftIcon />
                        </div>
                        <div className='leading-3'>
                            <div className='text-lg font-bold'>Requests</div>
                            <div className='leading-1'>
                                <div className='text-zinc-600 text-sm'>All requests, including the animals you intend to buy or sell, are displayed here.</div>
                            </div>
                            <Mode mode={mode} handleChangeMode={handleChangeMode} />
                        </div>
                    </div>
                    <div className='pr-4'>
                        <CoinsAvailable />
                    </div>
                </div>
                <div className='text-zinc-500 font-bold p-1 px-4 border-y border-zinc-500 flex items-center gap-2'>
                    {isFetching && <RefreshCcwIcon size={16} className='animate-spin' />}
                    <div className='line-clamp-1'>
                        {mode === "buying" ? "Animals you requested to buy are listed below" : "Your animals you are selling and their requests"}
                    </div>
                </div>
                <div className='w-full h-full grid grid-cols-[35%_1fr] bg-zinc-100'>
                    <section className='p-1 h-[calc(100vh-170px)] overflow-y-auto bg-white'>
                        {layer === "footer-leadswrapper" && <Animals mode={mode} selectAnimal={handleSelectAnimal} selectedAnimal={selectedAnimal} setIsFetching={setIsFetching} defaultAnimalId={props.defaultAnimalId} />}
                    </section>
                    <section className='p-2 h-[calc(100vh-170px)] overflow-y-auto bg-zinc-400'>
                        <SelectedAnimal selectedAnimal={selectedAnimal} setIsFetching={setIsFetching} mode={mode} />
                    </section>
                </div>
            </div>
            <div onClick={() => handleOpen(true)}>{props.children}</div>
        </>
    )
}

export default LeadsWrapper


const Mode = (props: { mode: "buying" | "selling", handleChangeMode: (mode: "buying" | "selling") => void }) => {

    return (
        <div onClick={() => props.handleChangeMode(props.mode === "buying" ? "selling" : "buying")} className={`mt-2 group cursor-pointer flex items-center gap-2`}>
            <ChevronDownIcon className='mt-1 group-active:-rotate-90 transition duration-200 ease-in-out' size={16} />
            {`I'm ${formalizeText(props.mode)}`}
        </div>
    )

}