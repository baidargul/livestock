'use client'
import { XIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
    children: React.ReactNode
    where: any
    setWhere: any
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
            </div>
            <div onClick={() => handleOpen(!open)} className={`cursor-pointer text-zinc-700`}>{props.children}</div>
            <div onClick={() => handleOpen(false)} className={`inset-0 fixed top-0 left-0 z-50 bg-black/50 backdrop-blur-[1px] transition duration-200 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}></div>
        </>
    )
}

export default FilterMenuWrapper