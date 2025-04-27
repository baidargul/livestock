import Button from '@/components/ui/Button'
import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const SelectBreed = (props: Props) => {

    const handleSelectAnimal = (animal: any) => {
        animal = String(animal.name).toLocaleLowerCase()
        if (props.animal?.breed && props.animal?.breed === animal) {
            props.setAnimal((prev: any) => {
                return {
                    ...prev,
                    breed: "",
                }
            })

        } else {
            props.setAnimal((prev: any) => {
                return {
                    ...prev,
                    breed: animal,
                }
            })
        }
    }


    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>{`Select ${props.animal.type} breed`}</div>
            <div className='flex flex-wrap items-center justify-center gap-4 w-full h-full max-h-[60vh] overflow-y-auto'>
                {
                    images[props.animal?.type].breeds.map((animal: any) => {
                        return (
                            <div key={animal.id} className={`relative w-32 h-32 transition-all duration-200 ease-in-out flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 cursor-pointer  ${props.animal?.breed && props.animal?.breed === animal.name.toLocaleLowerCase() ? "bg-emerald-700 text-emerald-700" : "hover:bg-gray-100"}`} onClick={() => handleSelectAnimal(animal)}>
                                <Image src={animal.images[0]} alt={animal.name} priority layout='fixed' width={100} height={100} className={`w-full h-full absolute inset-0 z-0 object-cover mb-2 rounded-lg ${props.animal?.breed && props.animal?.breed === animal.name.toLocaleLowerCase() ? "p-2 rounded-xl" : ``} ${props.animal?.breed && props.animal?.breed !== animal.name.toLocaleLowerCase() ? "grayscale blur-[1px] opacity-70" : ``}`} />
                                <h1 className={`text-lg absolute z-10 bottom-0 left-1/2 -translate-x-1/2 font-semibold transition-all duration-200 ease-in-out ${props.animal?.breed && props.animal?.breed === animal.name.toLocaleLowerCase() ? "bg-emerald-700" : "bg-black"}  w-full text-white text-center`}>{animal.name}</h1>
                            </div>
                        )
                    })
                }
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full' disabled={props.animal?.breed && props.animal?.breed !== "" ? false : true}>{props.animal?.breed && props.animal?.breed !== "" ? `Next` : "Select"}</Button>
            </div>
        </div >
    )
}

export default SelectBreed