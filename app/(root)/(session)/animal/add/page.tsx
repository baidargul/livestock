'use client'
import { Animal } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import SelectAnimal from './_components/SelectAnimal'
import SelectBreed from './_components/SelectBreed'
import SelectAgeGenderWeight from './_components/SelectAgeGenderWeight'
import AddMedia from './_components/AddMedia'
import TitleAndDescription from './_components/TitleAndDescription'
import PriceAndDelivery from './_components/PriceAndDelivery'
import PostPreview from './_components/PostPreview'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import { useLoader } from '@/hooks/useLoader'

type Props = {}

const page = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [animal, setAnimal] = useState<Animal | any | null>()
    const [currentScreen, setCurrentScreen] = useState(1)
    const [user, setUser] = useState<any>(null)
    const getuser = useSession((state: any) => state.getUser)
    const setLoading = useLoader((state: any) => state.setLoading)

    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)

        return () => {
            setAnimal(null)
            setCurrentScreen(1)
            setUser(null)
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            setLoading(true)
            const prevPost = localStorage.getItem('post')
            if (prevPost) {
                const parsedPost = JSON.parse(prevPost)
                setAnimal(parsedPost)
            }
            setLoading(false)
        }
    }, [isMounted])

    useEffect(() => {
        if (isMounted) {

            setLoading(true)
            const rawUser = getuser()
            if (rawUser) {
                setUser(rawUser)
            } else {
                setUser(null)
            }
            if (!rawUser) {
                router.push('/home')
            }
            setLoading(false)
            const rawPost = JSON.stringify(animal)
            localStorage.setItem('post', rawPost)
        }
    }, [currentScreen, animal])

    const deletePost = () => {
        setLoading(true)
        localStorage.removeItem('post')
        setAnimal(null)
        setCurrentScreen(1)
        router.push('/home')
        setLoading(false)
    }

    const autoFill = () => {
        if (user) {
            let autoDetails = { province: user?.province, city: user?.city, }
            if (!animal.province && !animal.city) {
                setAnimal({ ...animal, ...autoDetails, })
            } else {
                setAnimal({ ...autoDetails, ...animal, })
            }
        }
    }

    const handleMoveNext = () => {
        autoFill()
        setCurrentScreen((prev) => prev + 1)
    }

    const handleMoveBack = () => {
        autoFill()
        setCurrentScreen((prev) => prev - 1)
    }

    const screens: any = {
        1: <SelectAnimal deletePost={deletePost} moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal} />,
        2: <SelectBreed deletePost={deletePost} moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal} />,
        3: <TitleAndDescription deletePost={deletePost} moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        4: <SelectAgeGenderWeight deletePost={deletePost} moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        5: <AddMedia deletePost={deletePost} moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        6: <PriceAndDelivery deletePost={deletePost} moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} />,
        7: <PostPreview moveBack={handleMoveBack} moveNext={handleMoveNext} setAnimal={setAnimal} animal={animal as any} user={user} />,
    }


    return (
        <div className='w-full min-h-[100dvh] flex flex-col items-center justify-center'>
            {screens[currentScreen]}
        </div>
    )
}

export default page