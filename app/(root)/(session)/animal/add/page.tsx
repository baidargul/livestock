'use client'
import { Animal } from '@prisma/client'
import React, { useState } from 'react'
import SelectAnimal from './_components/SelectAnimal'
import SelectBreed from './_components/SelectBreed'
import SelectAgeGenderWeight from './_components/SelectAgeGenderWeight'
import AddMedia from './_components/AddMedia'
import TitleAndDescription from './_components/TitleAndDescription'
import PriceAndDelivery from './_components/PriceAndDelivery'
import PostPreview from './_components/PostPreview'

type Props = {}

const page = (props: Props) => {
    const [animal, setAnimal] = useState<Animal | null>()
    const [currentScreen, setCurrentScreen] = useState(1)

    const handleMoveNext = () => {
        setCurrentScreen((prev) => prev + 1)
    }

    const handleMoveBack = () => {
        setCurrentScreen((prev) => prev - 1)
    }

    console.log(animal)


    const screens: any = {
        1: <SelectAnimal moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal} />,
        2: <SelectBreed moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal} />,
        3: <TitleAndDescription moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        4: <SelectAgeGenderWeight moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        5: <AddMedia moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        6: <PriceAndDelivery moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        7: <PostPreview moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
    }


    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center justify-center'>
            {screens[currentScreen]}
        </div>
    )
}

export default page