'use client'
import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    setStage: (val: signInStages) => void
    closeMenu: () => void
}

const SignIn = (props: Props) => {
    const [isWorking, setIsWorking] = useState(false)
    const setLoading = useLoader((state: any) => state.setLoading)
    const dialog = useDialog((state) => state)
    const router = useRouter();
    const setUser = useSession((state: any) => state.setUser)
    const user = useUser()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleEmailChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, email: `${val}` }))
    }

    const handlePasswordChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, password: `${val}` }))
    }

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            dialog.showDialog("Error", null, "Please fill in all fields")
            return
        }
        setLoading(true)
        setIsWorking(true)
        const response = await actions.client.user.signin(form.email, form.password)
        if (response?.status === 200) {
            setUser(response.data)
            props.closeMenu()
        } else {
            dialog.showDialog("Error", null, response?.message || "An error occurred while signing in")
            setIsWorking(false)
        }
        setIsWorking(false)
        setLoading(false)
    }

    return (
        <div className='flex flex-col gap-4 pt-5'>
            <div>
                <h1 className='heading1 text-primary font-bold'>Login to your account</h1>
            </div>
            <div className='flex flex-col gap-1'>
                <Textbox label='Email:' placeholder='musmanjamil@gmail.com' onChange={handleEmailChange} value={form.email} />
                <Textbox label='Password:' placeholder='1234' type='password' onChange={handlePasswordChange} value={form.password} />
            </div>
            <div className='grid grid-cols-2 w-full place-items-center'>
                <div onClick={() => props.setStage("signup")} className='cursor-pointer'>Create a new account.</div>
                <Button disabled={isWorking} onClick={handleSubmit} className='w-full'>Sign in</Button>
            </div>
        </div>
    )
}

export default SignIn