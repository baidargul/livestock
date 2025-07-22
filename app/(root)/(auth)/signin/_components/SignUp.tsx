import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { LoaderState } from '@/types/useLoader'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const SignUp = (props: Props) => {
    const setLoading = useLoader((state: LoaderState) => state.setLoading)
    const setUser = useSession((state: any) => state.setUser)
    const getUser = useSession((state: any) => state.getUser)
    const router = useRouter();
    const dialog = useDialog((state) => state)
    const [isWorking, setIsWorking] = useState(false)
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        province: "",
        city: "",
        phone: "",
    })

    useEffect(() => {
        const rawUser = getUser()
        if (rawUser) {
            setUser(rawUser)
            router.push("/home")
        }
    }, [])

    const handleSignUp = async () => {
        if (!form.name || !form.email || !form.password) {
            dialog.showDialog("Error", null, "Name, Email and Password are required fields.")
            return
        }
        setLoading(true)
        setIsWorking(true)
        const response = await actions.client.user.signup(form.name, form.email, form.password, form.province, form.city, form.phone)
        if (response?.status === 200) {
            setUser(response.data)
            props.setStage("signin")
            router.push("/home")

        } else if (response?.status === 402) {
            dialog.showDialog("Error", null, "User with this email already exists.")
            setIsWorking(false)
            props.setStage("signin")
        } else {
            dialog.showDialog("Error", null, response?.message || "An error occurred while signing up.")
            setIsWorking(false)
        }
        setLoading(false)
    }

    const handleNameChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, name: `${val}` }))
    }

    const handleEmailChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, email: `${val}` }))
    }

    const handlePasswordChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, password: `${val}` }))
    }

    const handleProvinceChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, province: `${val}` }))
    }

    const handleCityChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, city: `${val}` }))
    }

    const handlePhoneChange = (val: string | number) => {
        setForm((prev) => ({ ...prev, phone: `${val}` }))
    }

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <h1 className='heading1 text-primary font-bold'>Create a new account</h1>
            </div>
            <div className='grid grid-cols-2 w-full gap-2'>
                <Textbox label='Name:' value={form.name} onChange={handleNameChange} placeholder='Your name' />
                <Textbox label='Phone:' value={form.phone} onChange={handlePhoneChange} placeholder='03' type='text' />
                <Textbox label='Email:' value={form.email} onChange={handleEmailChange} placeholder='youremail@domain.com' />
                <Textbox label='Password:' value={form.password} onChange={handlePasswordChange} placeholder='1234' type='password' />
                <Textbox label='Province:' value={form.province} onChange={handleProvinceChange} placeholder='Your Province' type='text' />
                <Textbox label='City:' value={form.city} onChange={handleCityChange} placeholder='Your City' type='text' />
            </div>
            <div className='flex justify-between gap-2 items-center'>
                <Button onClick={() => props.setStage("signin")} variant='btn-secondary' className='w-full'>Sign In</Button>
                <Button disabled={isWorking} onClick={handleSignUp} className='w-full'>Create</Button>
            </div>
        </div>
    )
}

export default SignUp