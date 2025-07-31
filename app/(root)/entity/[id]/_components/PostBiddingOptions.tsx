'use client'
import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, formatCurrency } from '@/lib/utils'
import { useSocket } from '@/socket-client/SocketWrapper'
import { serialize } from 'bson'
import React, { use, useEffect, useState } from 'react'

type Props = {
    animal: any
    postBiddingOptions: {
        deliveryOptions: string[],
        maleQuantityAvailable: number,
        femaleQuantityAvailable: number,
        amount: number,
        posted: boolean
    },
    setPostBiddingOptions: React.Dispatch<React.SetStateAction<{ deliveryOptions: string[], maleQuantityAvailable: number, femaleQuantityAvailable: number, amount: number, posted: boolean }>>
    children: React.ReactNode
    staticStyle?: boolean
    user: any
}

const PostBiddingOptions = (props: Props) => {
    const [isOpen, setisOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const getUser = useSession((state: any) => state.getUser)
    const socket = useSocket()

    const handleOpen = () => {
        setisOpen(!isOpen)
    }

    const handleClose = (force?: boolean) => {
        if (force) {
            setisOpen(false)
            return
        }
        setisOpen(!isOpen)
    }

    const addDeliveryOption = (option: string) => {
        if (props.postBiddingOptions.deliveryOptions.includes(option)) {
            props.setPostBiddingOptions((prev) => ({ ...prev, deliveryOptions: prev.deliveryOptions.filter((opt: string) => opt !== option) }))
        } else {
            props.setPostBiddingOptions((prev) => ({ ...prev, deliveryOptions: [...prev.deliveryOptions, option] }))
        }
    }

    const handleChangeValue = (key: string, value: any) => {
        props.setPostBiddingOptions((prev) => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        props.setPostBiddingOptions((prev) => ({ ...prev, amount: calculatePricing({ ...props.animal, ...props.postBiddingOptions }).price }))
    }, [props.postBiddingOptions.femaleQuantityAvailable, props.postBiddingOptions.maleQuantityAvailable])

    const handlePostOffer = () => {
        if (socket && props.user) {
            const room = {
                animalId: props.animal.id,
                authorId: props.animal.userId,
                userId: props.user.id,
                key: `${props.animal.id}-${props.animal.userId}-${props.user.id}`,
                offer: Number(props.postBiddingOptions.amount),
                deliveryOptions: props.postBiddingOptions.deliveryOptions,
                maleQuantityAvailable: Number(props.postBiddingOptions.maleQuantityAvailable) ?? 0,
                femaleQuantityAvailable: Number(props.postBiddingOptions.femaleQuantityAvailable) ?? 0
            }
            socket.emit("join-bidroom", serialize({ room, userId: props.user.id }));
        }
    }


    return (
        <>
            <div className={`fixed ${props.staticStyle ? 'bottom-0 h-[95%]' : 'bottom-14 h-[80%]'}  select-none flex flex-col justify-between gap-0 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 left-0 rounded-t-xl bg-white z-20 p-4`}>
                <div>
                    {/* <div className='opacity-40 hover:opacity-100 transition-all duration-200 ease-in-out'>
                        <CalculatedDescription animal={props.animal} />
                    </div> */}
                    <div className='-mt-2 flex flex-col gap-2 w-full'>
                        <div className='text-emerald-700 font-semibold text-xl tracking-wide'>Customize your offer</div>
                        <div className='flex flex-col gap-2'>
                            <div className='font-semibold'>Delivery Options</div>
                            <div className='grid grid-cols-2 gap-2 w-full'>
                                <Button onClick={() => addDeliveryOption("SELF_PICKUP")} className='w-full' variant={props.postBiddingOptions?.deliveryOptions?.includes("SELF_PICKUP") ? "btn-primary" : "btn-secondary"}>Self Pickup</Button>
                                <Button onClick={() => addDeliveryOption("SELLER_DELIVERY")} className='w-full' variant={props.postBiddingOptions?.deliveryOptions?.includes("SELLER_DELIVERY") ? "btn-primary" : "btn-secondary"} >Cargo</Button>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='font-semibold'>Gender Quantity</div>
                            <div className='grid grid-cols-2 gap-2 w-full -mt-2'>
                                <Textbox disabled={props.animal.maleQuantityAvailable < 1} label='Male' type='number' onChange={(e: any) => handleChangeValue("maleQuantityAvailable", Number(e) > props.animal.maleQuantityAvailable || Number(e) < 0 ? props.animal.maleQuantityAvailable : e)} value={props.postBiddingOptions.maleQuantityAvailable} className='w-full' />
                                <Textbox disabled={props.animal.femaleQuantityAvailable < 1} label='Female' type='number' onChange={(e: any) => handleChangeValue("femaleQuantityAvailable", Number(e) > props.animal.femaleQuantityAvailable || Number(e) < 0 ? props.animal.femaleQuantityAvailable : e)} value={props.postBiddingOptions.femaleQuantityAvailable} className='w-full' />
                            </div>
                        </div>
                        <div>
                            <Textbox label='Your offer' value={props.postBiddingOptions.amount} onChange={(e: any) => handleChangeValue("amount", e)} />
                        </div>
                        <div className='mt-10 grid grid-cols-2 gap-2 w-full'>
                            <Button onClick={() => handleClose()} className='w-full' variant='btn-secondary' >Cancel</Button>
                            <Button disabled={props.postBiddingOptions.deliveryOptions.length === 0 || (props.postBiddingOptions.maleQuantityAvailable + props.postBiddingOptions.femaleQuantityAvailable) === 0} onClick={handlePostOffer} className='w-full'>Post Offer</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={handleOpen} className='w-full'>{props.children}</div>
            <div onClick={() => handleClose(true)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default PostBiddingOptions