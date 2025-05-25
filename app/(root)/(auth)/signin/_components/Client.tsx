'use client'
import React, { useEffect, useState } from 'react'
import Onboarding from './Onboarding'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/router'

type Props = {}
const Client = (props: Props) => {
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
        <div className='flex flex-col gap-10'>
            {CurrentStage[stage]}
        </div>
    )
}

export default Client