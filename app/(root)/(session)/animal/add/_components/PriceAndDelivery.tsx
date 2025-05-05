import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Radiogroup from '@/components/ui/radiogroup'
import Textbox from '@/components/ui/Textbox'
import axios from 'axios'
import React, { useRef, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const PriceAndDelivery = (props: Props) => {
    const txtRef: any = useRef(null)
    const handleDelivery = (val: boolean, key: string) => {
        let currentOptions = Array.isArray(props.animal.deliveryOptions)
            ? [...props.animal.deliveryOptions]
            : [];

        if (currentOptions.includes(key)) {
            currentOptions = currentOptions.filter((option) => option !== key); // Remove the key
        } else {
            currentOptions.push(key); // Add the key
        }

        props.setAnimal((prev: any) => ({
            ...prev,
            deliveryOptions: currentOptions,
        }));
    };

    const handleOnFocus = () => {
        if (txtRef.current) {
            txtRef.current.select()
        }
    }

    const isExists = (key: string) => {
        for (const i in props.animal?.deliveryOptions) {
            if (props.animal?.deliveryOptions[i] === key) {
                return true
            }
        }
        return false
    }

    const handlePriceChange = (val: number) => {
        props.setAnimal((prev: any) => ({
            ...prev,
            price: Number(val),
        }));
    }

    const self = isExists('SELF_PICKUP')
    const seller = isExists('SELLER_DELIVERY')

    const handleHitApi = async () => {
        const data = {
            ...props.animal,
        }
        const response = await axios.post(`/api/post`, data)
        console.log(response)
    }


    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`Commericial Information`}</div>
            <div>
                <input ref={txtRef} onFocus={handleOnFocus} value={props.animal.price ?? 0} onChange={(e: any) => handlePriceChange(Number(e.target.value))} placeholder='Rs ' type='number' className='text-2xl p-4 outline-none ring-0 bg-emerald-50 border-y border-emerald-300 text-emerald-700 font-semibold selection:bg-emerald-200 tracking-wide focus-within:tracking-wide w-fit appearance-none text-center ' />
                <div className='flex items-center justify-between gap-4 w-full p-4'>
                    <Checkbox label='SELF PICKUP AVAILABLE' value={self ?? false} onChange={(val: boolean) => handleDelivery(val, "SELF_PICKUP")} />
                    <Checkbox label='CARGO AVAILABLE' value={seller ?? false} onChange={(val: boolean) => handleDelivery(val, "SELLER_DELIVERY")} />
                </div>
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={handleHitApi} className='w-full' disabled={props.animal?.breed && props.animal?.breed !== "" ? false : true}>{props.animal?.breed && props.animal?.breed !== "" ? `Next` : "Select"}</Button>
            </div>
        </div>
    )
}

export default PriceAndDelivery