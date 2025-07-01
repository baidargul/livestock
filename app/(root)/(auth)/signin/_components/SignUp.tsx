import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { LoaderState } from '@/types/useLoader'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const SignUp = (props: Props) => {
    const setLoading = useLoader((state: LoaderState) => state.setLoading)
    const setUser = useSession((state: any) => state.setUser)
    const getUser = useSession((state: any) => state.getUser)
    const router = useRouter();
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
        if (!form.name || !form.email || !form.password) return
        setLoading(true)
        const response = await actions.client.user.signup(form.name, form.email, form.password, form.province, form.city, form.phone)
        if (response?.status === 200) {
            setUser(response.data)
            props.setStage("signin")
            router.push("/home")

        } else if (response?.status === 402) {
            alert("User with this email already exists")
            props.setStage("signin")
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
            <div className='flex flex-col gap-1'>
                <Textbox label='Name:' value={form.name} onChange={handleNameChange} placeholder='Muhammad Usman' />
                <Textbox label='Email:' value={form.email} onChange={handleEmailChange} placeholder='musmanjamil@gmail.com' />
                <Textbox label='Phone:' value={form.phone} onChange={handlePhoneChange} placeholder='03' type='text' />
                <Textbox label='Province:' value={form.province} onChange={handleProvinceChange} placeholder='Punjab' type='text' />
                <Textbox label='City:' value={form.city} onChange={handleCityChange} placeholder='Multan' type='text' />
                <Textbox label='Password:' value={form.password} onChange={handlePasswordChange} placeholder='1234' type='password' />
            </div>
            <div className='flex justify-between items-center'>
                <label onClick={() => props.setStage("signin")} className='text-primary text-sm border-b border-red-600 cursor-pointer'>Sign In</label>
                <Button onClick={handleSignUp}>Create</Button>
            </div>
        </div>
    )
}

export default SignUp