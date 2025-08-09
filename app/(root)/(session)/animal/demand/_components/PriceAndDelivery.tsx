import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Radiogroup from '@/components/ui/radiogroup'
import Selectbox from '@/components/ui/selectbox'
import Textbox from '@/components/ui/Textbox'
import { formalizeText, formatCurrency } from '@/lib/utils'
import axios from 'axios'
import { Trash2Icon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    deletePost: () => void
    animal: any
}

const PriceAndDelivery = (props: Props) => {
    const [priceUnits, setPriceUnits] = useState<any>([])
    const [selectedUnit, setSelectedUnit] = useState<string>("")
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

    const handlePriceUnit = (val: string) => {
        props.setAnimal((prev: any) => ({
            ...prev,
            priceUnit: val,
        }));
        setSelectedUnit(val)
    }

    const checkQuantity = () => {
        const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)
        return totalQuantity
    }

    useEffect(() => {
        const val = Number(checkQuantity())
        setSelectedUnit(props.animal.priceUnit)
        if (val === 1) {
            setPriceUnits(["per Piece"])
            handlePriceUnit("per Piece")
        } else if (val > 1) {
            setPriceUnits(["per Piece", `per ${formalizeText(props.animal.weightUnit ?? "Kg")}`, "per Set"])
            if (!props.animal.priceUnit) {
                handlePriceUnit(`per ${formalizeText(props.animal.weightUnit ?? "Kg")}`)
            }
        }
    }, [])

    const self = isExists('SELF_PICKUP')
    const seller = isExists('SELLER_DELIVERY')

    return (
        <div className='w-full min-h-[95dvh] flex flex-col items-center gap-4 p-4'>
            <div className='w-full'>
                <div className='text-xl font-semibold tracking-tight text-center'>{`Your budget`}</div>
                <div className='w-full flex flex-col items-start gap-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='relative flex items-center'>
                            <label className='absolute left-0 text-2xl'>Rs </label>
                            <input ref={txtRef} onFocus={handleOnFocus} onChange={(e: any) => handlePriceChange(Number(e.target.value))} value={props.animal.price} placeholder='0/-' type='number' className='text-2xl border-b border-black selection:bg-emerald-100 text-left pl-8 p-2 outline-0 text-emerald-600' />
                        </div>
                        <Selectbox options={priceUnits} value={props.animal.priceUnit} onChange={handlePriceUnit} />
                    </div>
                    {selectedUnit !== "per Set" && selectedUnit !== "per Kg" && <div>
                        <div> {formalizeText(props.animal.breed)} {`${props.animal.type}${checkQuantity() > 1 ? "s" : ""}`} x {checkQuantity()} = <span className='font-semibold text-emerald-700 pb-1 border-b border-emerald-700'>{formatCurrency(Number(props.animal.price ?? 0) * checkQuantity())}</span></div>
                    </div>}
                    {selectedUnit === "per Kg" && <div className='flex flex-col gap-1'>
                        <div className=''>Per piece weight: <span className='tracking-widest mx-2 font-semibold text-emerald-700 border-b border-emerald-700'>{props.animal.averageWeight} {props.animal.weightUnit}</span></div>
                        <div className=''>Price per {props.animal.weightUnit}: <span className='tracking-widest mx-2 font-semibold text-emerald-700 border-b border-emerald-700'>{formatCurrency(Number(props.animal.averageWeight) * Number(props.animal.price ?? 0))}</span></div>
                        <div className=''> {formalizeText(props.animal.breed)} {`${props.animal.type}${checkQuantity() > 1 ? "s" : ""}`} x {checkQuantity()} = <span className='tracking-widest mx-2 font-semibold text-emerald-700 border-b border-emerald-700'>{formatCurrency(Number(props.animal.averageWeight) * Number(props.animal.price ?? 0) * checkQuantity())}</span></div>
                    </div>}
                    <div className='flex flex-col justify-between gap-4 w-full'>
                        <Checkbox label='SELF PICKUP AVAILABLE' value={self ?? false} onChange={(val: boolean) => handleDelivery(val, "SELF_PICKUP")} />
                        <Checkbox label='CARGO AVAILABLE' value={seller ?? false} onChange={(val: boolean) => handleDelivery(val, "SELLER_DELIVERY")} />
                    </div>
                </div>
            </div>
            <div className='mt-auto p-4 w-full'>
                {props.animal && <div className='my-4 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Delete post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                    <Button onClick={props.moveNext} className='w-full' disabled={!props.animal.price || Number(props.animal.price) < 0 || props.animal.deliveryOptions && props.animal.deliveryOptions.length === 0}>{props.animal?.breed && props.animal?.breed !== "" ? `Next` : "Select"}</Button>
                </div >
            </div>
        </div >
    )
}

export default PriceAndDelivery