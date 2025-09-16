'use client'
import { useDialog } from '@/hooks/useDialog'
import React, { useEffect, useState } from 'react'
import SelectAnimal from './windows/SelectAnimal'

type Props = {
    children: React.ReactNode
    animal: any
}

const BargainChatWrapper = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const dialog = useDialog()
    const layer = dialog.layer


    const handleToggleChatWindow = (val: boolean) => {
        setIsOpen(val)
        if (val) {
            dialog.setLayer("bargain-chat")
        } else {
            dialog.setLayer("")
        }
    }

    return (
        <>
            {isOpen && <div onClick={() => handleToggleChatWindow(false)} className='fixed inset-0 top-0 left-0 backdrop-blur-[1px] bg-black/30 z-30' />}
            {<div className={`fixed ${layer === "bargain-chat" ? `z-50 transition duration-300 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}` : "z-0"} bottom-0 right-1/2 translate-x-1/2 p-2 w-[90%] bg-white rounded-t shadow-sm`}>
                {isOpen && <div className='bg-white p-1'>
                    <SelectAnimal animal={props.animal} />
                </div>}
            </div>}
            <div onClick={() => handleToggleChatWindow(!isOpen)} className='w-full'>
                {props.children}
            </div>
        </>
    )
}

export default BargainChatWrapper