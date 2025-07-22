import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const SignIn = (props: Props) => {
    const [isWorking, setIsWorking] = useState(false)
    const setLoading = useLoader((state: any) => state.setLoading)
    const setUser = useSession((state: any) => state.setUser)
    const getUser = useSession((state: any) => state.getUser)
    const dialog = useDialog((state) => state)
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        const rawUser = getUser()
        if (rawUser) {
            setUser(rawUser)
            router.push("/home")
        }
    }, [])

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
            router.push("/home")
        } else {
            dialog.showDialog("Error", null, response?.message || "An error occurred while signing in")
            setIsWorking(false)
        }
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
            <div className='flex justify-between gap-2 items-center'>
                <Button onClick={() => props.setStage("signup")} variant='btn-secondary' className='w-full text-nowrap'>Create account</Button>
                <Button disabled={isWorking} onClick={handleSubmit} className='w-full'>Sign in</Button>
            </div>
        </div>
    )
}

export default SignIn