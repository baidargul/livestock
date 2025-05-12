'use client'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

type Props = {
    children: React.ReactNode
    animal: any
}

const BiddingWrapper = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [offerValue, setOfferValue] = useState(0)

    const handleOpen = (val: boolean) => {
        setIsOpen(val)
    }

    const checkQuantity = () => {
        const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)
        return totalQuantity
    }

    const handleOfferChange = (val: string) => {
        const offer = Number(val)
        setOfferValue(offer)
    }

    return (
        <>
            <div className=''>
                <div className={`fixed top-40 flex flex-col justify-between gap-2 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 h-[80%] left-0 rounded-xl bg-white z-20 p-4`}>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <div className='text-xl font-semibold'>
                                {props.animal.title}
                            </div>
                            <div>
                                {props.animal.description}
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {
                                props.animal.images && props.animal.images.length > 0 && props.animal.images.map((image: any, index: number) => {
                                    return (
                                        <Image src={image.image} width={100} height={100} layout='fixed' priority key={index} className='rounded-md border border-emerald-800/10 drop-shadow-[2px]' alt={`${props.animal.title}, ${props.animal.type} - ${props.animal.breed}`} />
                                    )
                                })
                            }
                        </div>
                        <div>
                            {props.animal.priceUnit !== "per Set" && props.animal.priceUnit !== "per Kg" && <div>
                                <div> {formalizeText(props.animal.breed)} {`${props.animal.type}${checkQuantity() > 1 ? "s" : ""}`} x {checkQuantity()} = <span className='font-semibold text-emerald-700 pb-1 border-b border-emerald-700'>{formatCurrency(Number(props.animal.price ?? 0) * checkQuantity())}</span></div>
                            </div>}
                            {props.animal.priceUnit === "per Kg" && <div className='flex flex-col gap-1'>
                                <div className=''>Per piece weight: <span className='tracking-widest mx-2 font-semibold text-emerald-700 border-b border-emerald-700'>{props.animal.averageWeight} {props.animal.weightUnit}</span></div>
                                <div className=''>Price per {props.animal.weightUnit}: <span className='tracking-widest mx-2 font-semibold text-emerald-700 border-b border-emerald-700'>{formatCurrency(Number(props.animal.averageWeight) * Number(props.animal.price ?? 0))}</span></div>
                                <div className=''> {formalizeText(props.animal.breed)} {`${props.animal.type}${checkQuantity() > 1 ? "s" : ""}`} x {checkQuantity()} = <span className='tracking-widest mx-2 font-semibold text-emerald-700 border-b border-emerald-700'>{formatCurrency(Number(props.animal.averageWeight) * Number(props.animal.price ?? 0) * checkQuantity())}</span></div>
                            </div>}
                        </div>
                        <div className='my-4'>
                            <Textbox label='Offer Price' onChange={handleOfferChange} value={offerValue} className='text-center' />
                        </div>
                    </div>
                    <div className='w-full gap-2 mb-2 flex items-center'>
                        <Button onClick={() => handleOpen(false)} className='w-full' variant='btn-secondary'>Cancel</Button>
                        <Button className='w-full'>Place Offer</Button>
                    </div>
                </div>
                <div onClick={() => handleOpen(true)}>
                    {props.children}
                </div>
            </div>
            <div onClick={() => handleOpen(false)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default BiddingWrapper