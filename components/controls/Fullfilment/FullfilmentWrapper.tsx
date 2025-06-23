'use client'
import React, { useState } from 'react'

type Props = {
    children?: React.ReactNode;
}

const FullfilmentWrapper = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleLeaveRoom = async (force?: boolean) => {
        if (force) {
            setIsOpen(false);
            return;
        }
        setIsOpen(!isOpen);
    }

    return (
        <>
            <div className={`fixed bottom-14 h-[80%]  select-none flex flex-col justify-between gap-0 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 left-0 rounded-t-xl bg-white z-20 p-4`}>
                <div className='w-full h-[400px] '></div>
            </div>
            <div onClick={() => setIsOpen(true)} className='w-full'>{props.children}</div>
            <div onClick={() => handleLeaveRoom(true)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default FullfilmentWrapper