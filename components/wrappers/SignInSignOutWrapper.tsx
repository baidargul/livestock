'use client'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useState } from 'react'
import SignIn from './SignInSignOutWrapper/SignIn'
import SignUp from './SignInSignOutWrapper/SignUp'

type Props = {
    children: React.ReactNode
}

const SignInSignOutWrapper = (props: Props) => {
    const user = useUser()
    const [toggled, setToggled] = useState(false)
    const [stage, setStage] = useState<signInStages>("signin")

    const handleToggleMenu = (val: boolean) => {
        if (!user) {
            setToggled(val)
        }
    }

    const handleChangeStage = (s: signInStages) => {
        setStage(s)
    }

    return (
        <>
            <section className={`${toggled ? "translate-y-0 opacity-100 pointer-events-auto z-[2] " : "translate-y-full pointer-events-none opacity-0 z-0"} min-w-[90%] min-h-[40%] fixed bottom-14 ${stage === "signup" ? "right-0" : "right-2"} duration-300 ease-in-out bg-white p-2`}>
                <div className='flex gap-0 items-center'>
                    <div onClick={() => handleChangeStage("signin")} className={`${stage === "signin" ? "bg-emerald-600" : "bg-emerald-700"} p-1 px-4 rounded-tl-md cursor-pointer  text-white`}>Sign in</div>
                    <div onClick={() => handleChangeStage("signup")} className={`${stage === "signup" ? "bg-emerald-600" : "bg-emerald-700"} p-1 px-4 rounded-tr-md cursor-pointer text-white border-l border-emerald-600`}>Sign up</div>
                </div>
                <div className='mt-2'>
                    {stage === "signin" && <SignIn setStage={handleChangeStage} closeMenu={() => setToggled(false)} />}
                    {stage === "signup" && <SignUp setStage={handleChangeStage} closeMenu={() => setToggled(false)} />}
                </div>
            </section>
            <div onClick={() => handleToggleMenu(!toggled)}>{props.children}</div>
            {toggled && <div className='inset-0 fixed top-0 left-0 w-full min-h-[100dvh] bg-black/10 z-[1]'></div>}
        </>
    )
}

export default SignInSignOutWrapper