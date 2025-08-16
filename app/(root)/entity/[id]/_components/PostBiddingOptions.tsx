'use client'
import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { images } from '@/consts/images'
import { useDialog } from '@/hooks/useDialog'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, formatCurrency } from '@/lib/utils'
import { useSocket } from '@/socket-client/SocketWrapper'
import { serialize } from 'bson'
import Image from 'next/image'
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
    directCTO?: boolean
    directCTOAction?: () => void
}

const PostBiddingOptions = (props: Props) => {
    const [isOpen, setisOpen] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [sellerOffer, setSellerOffer] = useState(0)
    const socket = useSocket()
    const dialog = useDialog()

    useEffect(() => {
        props.setPostBiddingOptions((prev) => ({ ...prev, maleQuantityAvailable: Number(props.animal.maleQuantityAvailable) ?? 0, femaleQuantityAvailable: Number(props.animal.femaleQuantityAvailable) ?? 0, deliveryOptions: props.animal.deliveryOptions.length === 1 ? props.animal.deliveryOptions : props.postBiddingOptions.deliveryOptions }))
    }, [props.animal])

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
        let amount = calculatePricing({ ...props.animal }).price
        setSellerOffer(Number(Number(amount).toFixed(0)) ?? 0)
        const totalQuantity = Number(props.postBiddingOptions.femaleQuantityAvailable) + Number(props.postBiddingOptions.maleQuantityAvailable)
        amount = Number(Number(calculatePricing({ ...props.animal, maleQuantityAvailable: props.postBiddingOptions.maleQuantityAvailable, femaleQuantityAvailable: props.postBiddingOptions.femaleQuantityAvailable }).price).toFixed(0))
        if (props.directCTO) {
            props.setPostBiddingOptions((prev) => ({ ...prev, amount: Number(Number(amount / totalQuantity).toFixed(0)) }))
        }
    }, [props.postBiddingOptions.femaleQuantityAvailable, props.postBiddingOptions.maleQuantityAvailable])

    const handlePostOffer = () => {
        if (Number(props.postBiddingOptions.amount) < 1) return
        setIsWorking(true)
        if (props.directCTO) {
            if (props.directCTOAction) {
                props.directCTOAction()
                handleClose(true)
            }
        } else {
            if (socket && props.user) {
                const room = {
                    animalId: props.animal.id,
                    authorId: props.animal.userId,
                    userId: props.user.id,
                    key: `${props.animal.id}-${props.animal.userId}-${props.user.id}`,
                    offer: props.postBiddingOptions.amount * (Number(props.postBiddingOptions.maleQuantityAvailable) + Number(props.postBiddingOptions.femaleQuantityAvailable)),
                    deliveryOptions: props.postBiddingOptions.deliveryOptions,
                    maleQuantityAvailable: Number(props.postBiddingOptions.maleQuantityAvailable) ?? 0,
                    femaleQuantityAvailable: Number(props.postBiddingOptions.femaleQuantityAvailable) ?? 0
                }


                const againstValue = Number(calculatePricing({ ...props.animal, ...props.postBiddingOptions }).price)
                if (Number(props.postBiddingOptions.amount) === againstValue) {
                    dialog.showDialog('Equal trade', <MakeSureBox message='Are you sure you want to post an amount equal to the animal’s cost?' onYes={() => { socket.emit("join-bidroom", serialize({ room, userId: props.user.id })); dialog.closeDialog(); handleClose(true) }} onNo={() => { dialog.closeDialog(); }} />)
                } else if (Number(props.postBiddingOptions.amount) > againstValue) {
                    dialog.showDialog('Equal trade', <MakeSureBox message='Are you sure you want to post an amount greater then animal’s cost?' onYes={() => { socket.emit("join-bidroom", serialize({ room, userId: props.user.id })); dialog.closeDialog(); handleClose(true) }} onNo={() => { dialog.closeDialog() }} />)
                } else {
                    socket.emit("join-bidroom", serialize({ room, userId: props.user.id }))
                }
            }
        }
        setIsWorking(false)
    }

    const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)


    return (
        <>
            <div className={`fixed ${props.staticStyle ? 'bottom-0 h-[95%]' : 'bottom-14 h-[80%]'}  select-none flex flex-col justify-between gap-0 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 left-0 rounded-t-xl bg-white z-20 p-4`}>
                <div className='w-full h-full'>
                    <div className='-mt-2 flex flex-col gap-2 w-full h-full'>
                        <div className='w-full h-full'>
                            <div className='text-emerald-700 font-semibold text-xl tracking-wide'>{props.directCTO ? `Flat Rate Purchase | No Bargain` : `Customize your offer`}</div>
                            <div className='flex flex-col gap-2'>
                                <div className='font-semibold'>Delivery Options</div>
                                <div className='grid grid-cols-2 gap-2 w-full'>
                                    {props.animal.deliveryOptions.includes("SELF_PICKUP") && <Button onClick={() => addDeliveryOption("SELF_PICKUP")} className='w-full flex items-center gap-2 justify-center' variant={props.postBiddingOptions?.deliveryOptions?.includes("SELF_PICKUP") ? "btn-primary" : "btn-secondary"}> <DeliveryIcon icon='SELF_PICKUP' /> I'll Pickup</Button>}
                                    {props.animal.deliveryOptions.includes("SELLER_DELIVERY") && <Button onClick={() => addDeliveryOption("SELLER_DELIVERY")} className='w-full flex items-center gap-2 justify-center' variant={props.postBiddingOptions?.deliveryOptions?.includes("SELLER_DELIVERY") ? "btn-primary" : "btn-secondary"} ><DeliveryIcon icon='SELLER_DELIVERY' /> Cargo</Button>}
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 mt-4'>
                                <div className='font-semibold'>Gender Quantity</div>
                                <div className='grid grid-cols-2 gap-2 w-full -mt-2'>
                                    <Textbox disabled={props.directCTO ? true : Number(props.animal.maleQuantityAvailable) < 1} label='Male' type='number' onChange={(e: any) => handleChangeValue("maleQuantityAvailable", Number(e) > props.animal.maleQuantityAvailable || Number(e) < 0 ? props.animal.maleQuantityAvailable : e)} value={props.postBiddingOptions.maleQuantityAvailable} className='w-full' />
                                    <Textbox disabled={props.directCTO ? true : Number(props.animal.femaleQuantityAvailable) < 1} label='Female' type='number' onChange={(e: any) => handleChangeValue("femaleQuantityAvailable", Number(e) > props.animal.femaleQuantityAvailable || Number(e) < 0 ? props.animal.femaleQuantityAvailable : e)} value={props.postBiddingOptions.femaleQuantityAvailable} className='w-full' />
                                </div>
                            </div>
                            <div className={`${"flex gap-2 mt-4 justify-between items-center"}`}>
                                {props.directCTO && <Image src={images.site.ui.flatrate} width={100} height={100} layout='fixed' loading='lazy' quality={50} alt='janwarmarkaz' className='w-[100px] h-[100px] object-contain' />}
                                {!props.directCTO && <Textbox disabled label={`Seller offer`} value={`${Number(Number(sellerOffer / totalQuantity).toFixed(0))} per animal.`} />}
                                <div className='relative flex items-center group'>
                                    {!props.directCTO && <div className='absolute top-1/2 right-2 text-zinc-500 pointer-events-none group-hover:opacity-0 transition duration-600 ease-in-out'>per animal</div>}
                                    <Textbox disabled={props.directCTO} label={`${props.directCTO ? 'Total amount' : 'Your offer'}`} type='number' value={props.postBiddingOptions.amount} onChange={(e: any) => handleChangeValue("amount", e)} />
                                </div>
                            </div>
                            {!props.directCTO && <div className='flex justify-center items-center text-center mt-8'>
                                <div className='relative flex justify-center items-center'>
                                    <div className='border-b-4 border-zinc-700 p-2 bg-amber-50 px-4'>{formatCurrency(props.postBiddingOptions.amount * (Number(props.postBiddingOptions.maleQuantityAvailable) + Number(props.postBiddingOptions.femaleQuantityAvailable)))}</div>
                                    <div className='absolute -bottom-5 text-xs text-nowrap'>Your offer</div>
                                </div>
                                <div className='relative flex justify-center items-center'>
                                    <div className='p-2 bg-zinc-100 border-b line-clamp-1'>{formatCurrency(Number(Number(calculatePricing({ ...props.animal, maleQuantityAvailable: props.postBiddingOptions.maleQuantityAvailable, femaleQuantityAvailable: props.postBiddingOptions.femaleQuantityAvailable }).price).toFixed(0)))}</div>
                                    <div className='absolute -bottom-5 text-zinc-600 text-xs text-nowrap'>Seller offer</div>
                                </div>
                            </div>}
                            {props.directCTO && !props.animal.allowBidding && <div className='text-sm mt-4 p-2 text-amber-700 bg-yellow-50'>The seller has set a flat rate, meaning the price is final and not open to bargaining. Kindly confirm only your preferred mode of delivery.</div>}
                            {props.directCTO && props.animal.allowBidding && <div className='text-sm mt-4 p-2 text-amber-700 bg-yellow-50'>The price is fixed and non-negotiable. Please confirm your preferred delivery method so we can create the order, after which we’ll share the seller’s phone number with you to complete the transaction.</div>}

                        </div>
                        <div className={`mt-auto grid grid-cols-2 gap-2 w-full transition-all duration-300 ease-in-out ${isWorking && "pointer-events-none opacity-20 grayscale-100"}`}>
                            <Button onClick={() => handleClose()} className='w-full' variant='btn-secondary' >Cancel</Button>
                            <Button disabled={props.postBiddingOptions.deliveryOptions.length === 0 || (props.postBiddingOptions.maleQuantityAvailable + props.postBiddingOptions.femaleQuantityAvailable) === 0 || Number(props.postBiddingOptions.amount) < 1} onClick={handlePostOffer} className='w-full'>Purchase</Button>
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


const MakeSureBox = (props: { message: string, onYes: () => void, onNo: () => void }) => {

    return (
        <div className='p-2 pb-0 -mb-2 w-full flex flex-col gap-6'>
            <div>{props.message}</div>
            <div className='grid grid-cols-2 gap-2 w-full'>
                <Button onClick={props.onYes}>Yes</Button>
                <Button onClick={props.onNo}>No</Button>
            </div>
        </div>
    )
}