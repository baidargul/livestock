'use client'
import React, { useState } from 'react'
import Onboarding from './Onboarding'
import SignIn from './SignIn'
import SignUp from './SignUp'

type Props = {}
const Client = (props: Props) => {
    const [stage, setStage] = useState<signInStages>("onboarding")

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