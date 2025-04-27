import Button from '@/components/ui/Button'
import Image from 'next/image'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const SelectAnimal = (props: Props) => {

    const animals = [
        {
            id: 1,
            name: "Dog",
            image: "",
        },
        {
            id: 2,
            name: "Cat",
            image: "",
        },
        {
            id: 3,
            name: "Cow",
            image: "",
        },
        {
            id: 4,
            name: "Goat",
            image: "",
        },
        {
            id: 5,
            name: "Sheep",
            image: "",
        },
        {
            id: 6,
            name: "Horse",
            image: "",
        },
        {
            id: 8,
            name: "Chicken",
            image: "",
        },
        {
            id: 9,
            name: "Duck",
            image: "",
        },
        {
            id: 12,
            name: "Rabbit",
            image: "",
        },
    ]

    const handleSelectAnimal = (animal: any) => {
        animal = String(animal.name).toLocaleLowerCase()
        props.setAnimal((prev: any) => {
            return {
                ...prev,
                type: animal,
            }
        })
    }


    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <div className='text-xl font-semibold tracking-tight text-center'>Select the animal you wish to sell</div>
            <div className='grid grid-cols-3 gap-4 p-4'>
                {
                    animals.map((animal: any) => {
                        return (
                            <div key={animal.id} className={`flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 cursor-pointer  ${props.animal?.type && props.animal?.type === animal.name.toLocaleLowerCase() ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-100"}`} onClick={() => handleSelectAnimal(animal)}>
                                <Image src={animal.image} alt={animal.name} loading="lazy" layout='fixed' width={100} height={100} className='w-full h-16 object-cover mb-2' />
                                <h1 className='text-lg font-semibold'>{animal.name}</h1>
                            </div>
                        )
                    })
                }
            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={() => { window.history.back() }} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={props.moveNext} className='w-full' disabled={props.animal?.type && props.animal?.type !== "" ? false : true}>Next</Button>
            </div>
        </div >
    )
}

export default SelectAnimal