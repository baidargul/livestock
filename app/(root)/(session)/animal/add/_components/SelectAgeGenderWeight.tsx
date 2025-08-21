import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Groupbox from '@/components/ui/Groupbox'
import Radiogroup from '@/components/ui/radiogroup'
import Selectbox from '@/components/ui/selectbox'
import Textbox from '@/components/ui/Textbox'
import { images } from '@/consts/images'
import { useDialog } from '@/hooks/useDialog'
import { formalizeText } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    deletePost: () => void
    animal: Animal
}

const SelectAgeGenderWeight = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isDisabledForward, setIsDisabledForward] = useState(true)
    const dialog = useDialog()

    useEffect(() => {
        if (!props.animal.averageWeight) {
            props.setAnimal((prev: any) => ({ ...prev, averageWeight: '' }))
        }
        if (!props.animal.averageAge) {
            props.setAnimal((prev: any) => ({ ...prev, averageAge: '' }))
        }

        const validated = validate()
        setIsDisabledForward(validated)
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const validated = validate()
            setIsDisabledForward(validated)
        }
    }, [props.animal])

    const validate = () => {
        let disableForward = true
        if (Number(Number(props.animal.maleQuantityAvailable ?? 0) + Number(props.animal.femaleQuantityAvailable ?? 0)) > 0) {
            disableForward = false
        }
        if (props.animal.averageAge && Number(props.animal.averageAge) > 0) {
            if (props.animal.ageUnit && String(props.animal.ageUnit).length > 0) {
                disableForward = false
            } else {
                disableForward = true
            }
        }
        if (props.animal.averageWeight && Number(props.animal.averageWeight) > 0) {
            if (String(props.animal.weightUnit).length > 0) {
                disableForward = false
            } else {
                disableForward = true
            }
        }

        return disableForward
    }

    const handleWeightChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, averageWeight: String(val).length > 0 ? Number(val) : null }))
    }
    const handleAgeChange = (val: string | number) => {
        props.setAnimal((prev: any) => ({ ...prev, averageAge: String(val).length > 0 ? Number(val) : null }))
    }

    const handleQuantityChange = (val: string | number, key: string) => {
        props.setAnimal((prev: any) => ({ ...prev, [key]: String(val).length > 0 ? Number(val) : null }))
    }

    const handleAgeUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, ageUnit: val }))
    }

    const handleWeightUnitChange = (val: string) => {
        props.setAnimal((prev: any) => ({ ...prev, weightUnit: val }))
    }

    const handleMoveNext = () => {
        let isValid = true
        const totalAvailable = Number(props.animal.maleQuantityAvailable ?? 0) + Number(props.animal.femaleQuantityAvailable ?? 0)
        if (Number(totalAvailable) > 0) {
        } else {
            isValid = false
            dialog.showDialog('Please add at least one animal', null, 'Animal')
        }

        if (Number(props.animal.averageAge ?? 0) > 0) {
            if (String(props.animal.ageUnit ?? '').length === 0) {
                isValid = false
                dialog.showDialog('Age', null, 'Please select age unit')
            }
        }

        if (Number(props.animal.averageWeight ?? 0) > 0) {
            if (String(props.animal.weightUnit ?? '').length === 0) {
                isValid = false
                dialog.showDialog('Weight', null, 'Please select weight unit')
            }
        }

        if (isValid) {
            props.moveNext()
        }
    }



    return (
        <div className='w-full min-h-[95dvh] flex flex-col items-center gap-4 p-4'>
            <div className='flex flex-col gap-4'>
                <div className='text-xl font-semibold tracking-tight text-center'>{`More about ${formalizeText(props.animal.breed)} ${props.animal.type}`}</div>
                <div className='flex flex-col gap-4 w-full '>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-4'>
                            <Textbox label='Male quantity' type='number' labelClassName='text-nowrap' value={props.animal.maleQuantityAvailable ?? ''} onChange={(val: string | number) => handleQuantityChange(val, 'maleQuantityAvailable')} />
                            <Textbox label='Female quantity' type='number' labelClassName='text-nowrap' value={props.animal.femaleQuantityAvailable ?? ''} onChange={(val: string | number) => handleQuantityChange(val, 'femaleQuantityAvailable')} />
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                        <Textbox label='Average age' type='number' value={props.animal.averageAge ?? ''} onChange={handleAgeChange} />
                        <Selectbox label='Unit' options={["Days", "Months", "Years"]} value={props.animal.ageUnit ?? ""} className={Number(props.animal.averageAge ?? 0) > 0 ? '' : 'opacity-50 grayscale-100'} onChange={handleAgeUnitChange} />
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                        <Textbox label={`Average weight`} type='number' value={props.animal.averageWeight ?? ''} onChange={handleWeightChange} />
                        <Selectbox label='Unit' options={["Kg", "Grams"]} value={props.animal.weightUnit ?? ""} className={Number(props.animal.averageWeight ?? 0) > 0 ? '' : 'opacity-50 grayscale-100'} onChange={handleWeightUnitChange} />
                    </div>
                </div>
                <div className='w-full'>
                    <Image src={images.site.media.skulls} alt='skulls' layout='fixed' width={100} height={100} className='w-full h-auto' />
                </div>
            </div>
            <div className='w-full p-4 mt-auto'>
                {props.animal && <div className='my-4 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Clear Post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                    <Button onClick={handleMoveNext} disabled={isDisabledForward} className='w-full'>Next</Button>
                </div>
            </div>
        </div>
    )
}

export default SelectAgeGenderWeight