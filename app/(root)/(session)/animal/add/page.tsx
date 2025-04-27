'use client'
import { Animal } from '@prisma/client'
import React, { useState } from 'react'
import SelectAnimal from './_components/SelectAnimal'

type Props = {}

const page = (props: Props) => {
    const [animal, setAnimal] = useState<Animal | null>(null)
    const [currentScreen, setCurrentScreen] = useState(1)

    const handleMoveNext = () => {
        setCurrentScreen((prev) => prev + 1)
    }

    const handleMoveBack = () => {
        setCurrentScreen((prev) => prev - 1)
    }


    const screens: any = {
        1: <SelectAnimal moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal} />,
        2: <div>2</div>,
    }


    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center justify-center'>
            {screens[currentScreen]}
        </div>
    )
}

export default page