'use client'
import { useDialog } from '@/hooks/useDialog'
import React, { useEffect } from 'react'
import Button from './Button'

type Props = {
    children: React.ReactNode
}

const Dialog = (props: Props) => {
    const dialog = useDialog((state) => state)

    return (
        <>
            {
                dialog.isVisible && <div className='fixed flex inset-0 w-full h-full bg-red-200/80 pointer-events-none justify-center items-center cursor-not-allowed' style={{ zIndex: 999 }} >
                    <div className='mx-4 font-bold tracking-wide bg-white' style={{ boxShadow: "0px 3px 4px 0px #71141987" }}>
                        <div className='bg-zinc-700 p-2 px-4 text-white w-full'>
                            {dialog.title}
                        </div>
                        {dialog.content && <div className='py-4 pointer-events-auto'>
                            {dialog.content}
                        </div>}
                        {!dialog.content && <div className='p-4 flex flex-col gap-1 pointer-events-auto'>
                            <div className='text-black font-normal'>
                                {dialog.message}
                            </div>
                            <Button onClick={() => dialog.closeDialog()} variant='btn-primary' className='w-full'>Ok</Button>
                        </div>}
                    </div>
                </div>
            }
            <div className={`${dialog.isVisible ? "pointer-events-none" : "pointer-events-auto"} transition-all duration-200 ease-in-out`}>
                {props.children}
            </div>
        </>
    )
}

export default Dialog