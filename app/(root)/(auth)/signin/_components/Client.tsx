'use client'
import React, { useEffect, useState } from 'react'
import Onboarding from './Onboarding'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'

type Props = {}
const Client = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [stage, setStage] = useState<signInStages>("onboarding")
    const setUser = useSession((state: any) => state.setUser)
    const getUser = useSession((state: any) => state.getUser)
    const router = useRouter();

    useEffect(() => {
        const rawUser = getUser()
        if (rawUser) {
            setUser(rawUser)
            router.push("/home")
        }

        setIsMounted(true)
    }, [])

    const handleStageChange = (val: signInStages) => {
        setStage(val)
    }

    const CurrentStage = {
        "onboarding": <Onboarding setStage={handleStageChange} />,
        "signin": <SignIn setStage={handleStageChange} />,
        "signup": <SignUp setStage={handleStageChange} />
    }

    return (
        isMounted && <div className='flex flex-col gap-10'>
            {CurrentStage[stage]}
        </div>
    )
}

export default Client