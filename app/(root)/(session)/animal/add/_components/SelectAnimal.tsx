import Button from '@/components/ui/Button'
import { images } from '@/consts/images'
import { Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    deletePost: () => void
    animal: any
}

const SelectAnimal = (props: Props) => {

    const animals = [
        {
            id: 1,
            name: "Dogs",
            image: images.dogs.images[1],
        },
        {
            id: 2,
            name: "Cats",
            image: images.cats.images[1],
        },
        {
            id: 3,
            name: "Cows",
            image: images.cows.images[1],
        },
        {
            id: 4,
            name: "Goats",
            image: images.goats.images[1],
        },
        {
            id: 5,
            name: "Sheeps",
            image: images.sheeps.images[1],
        },
        {
            id: 6,
            name: "Horses",
            image: images.horses.images[1],
        },
        {
            id: 8,
            name: "Chickens",
            image: images.chickens.images[1],
        },
        {
            id: 9,
            name: "Ducks",
            image: images.ducks.images[1],
        },
        {
            id: 12,
            name: "Rabbits",
            image: images.rabbits.images[1],
        },
    ]

    const handleSelectAnimal = (animal: any) => {
        animal = String(animal.name).toLocaleLowerCase()
        if (props.animal?.type && String(props.animal?.type).toLocaleLowerCase() === String(animal).toLocaleLowerCase()) {
            props.setAnimal((prev: any) => {
                return {
                    ...prev,
                    type: "",
                }
            })

        } else {
            props.setAnimal((prev: any) => {
                return {
                    ...prev,
                    type: animal,
                }
            })
        }
    }


    return (
        <div className='w-full min-h-[95dvh] flex flex-col items-center gap-0 p-4'>
            <div className='flex flex-col gap-4'>
                <div className='text-xl font-semibold tracking-tight text-center'>Select the animal you wish to sell</div>
                <div className='flex flex-wrap items-center justify-center gap-4 w-full h-full max-h-[60vh] overflow-y-auto'>
                    {
                        animals.map((animal: any) => {
                            return (
                                <div
                                    key={animal.id}
                                    className={`relative w-56 sm:w-[400px] h-32 transition-all duration-200 ease-in-out flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-4 cursor-pointer ${props.animal?.type && props.animal?.type === animal.name.toLocaleLowerCase() ? "" : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => handleSelectAnimal(animal)}
                                >
                                    <Image
                                        src={animal.image}
                                        alt={animal.name}
                                        priority
                                        layout="fixed"
                                        width={100}
                                        height={100}
                                        className={`w-full h-full absolute inset-0 z-0 object-cover mb-2 rounded-lg ${props.animal?.type && props.animal?.type === animal.name.toLocaleLowerCase() ? "" : ""
                                            } ${props.animal?.type && props.animal?.type !== animal.name.toLocaleLowerCase() ? "grayscale blur-[1px] opacity-70" : ""
                                            }`}
                                    />
                                    <div
                                        className={`text-lg absolute z-10 bottom-0 left-1/2 -translate-x-1/2 font-semibold transition-all duration-200 ease-in-out ${props.animal?.type && props.animal?.type === animal.name.toLocaleLowerCase()
                                            ? "bg-gradient-to-t from-emerald-700/40 to-transparent h-10"
                                            : "bg-gradient-to-t from-black/50 to-transparent h-14"
                                            } w-full text-white text-center`}
                                    ></div>
                                    <h1
                                        className={`text-lg absolute z-10 bottom-2 left-2 font-semibold transition-all duration-200 ease-in-out w-full text-white`}
                                        style={{ textShadow: "1px 1px 2px black" }}
                                    >
                                        {animal.name}
                                    </h1>
                                </div>
                            );
                        })
                    }

                </div>
            </div>
            <div className='w-full p-4 mt-auto'>
                {props.animal && <div className='my-2 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Delete post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={() => { window.history.back() }} className='w-full' variant='btn-secondary'>Back</Button>
                    <Button onClick={props.moveNext} className='w-full' disabled={props.animal?.type && props.animal?.type !== "" ? false : true}>{props.animal?.type && props.animal?.type !== "" ? `Next` : "Select"}</Button>
                </div>
            </div>
        </div >
    )
}

export default SelectAnimal