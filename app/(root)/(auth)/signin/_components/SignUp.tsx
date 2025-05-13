import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { LoaderState } from '@/types/useLoader'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const SignUp = (props: Props) => {
    const setLoading = useLoader((state: LoaderState) => state.setLoading)
    const setUser = useSession((state: any) => state.setUser)
    const router = useRouter();
    const form = {
        name: "",
        email: "",
        password: ""
    }

    const handleSignUp = async () => {
        if (!form.name || !form.email || !form.password) return
        setLoading(true)
        const response = await actions.client.user.signup(form.name, form.email, form.password)
        if (response?.status === 200) {
            setUser(response.data)
            props.setStage("signin")
            router.push("/home")

        }
        setLoading(false)
    }


    return (
        <div className='flex flex-col gap-4'>
            <div>
                <h1 className='heading1 text-primary font-bold'>Create a new account</h1>
            </div>
            <div className='flex flex-col gap-1'>
                <Textbox label='Name:' value={form.name} onChange={(val: string) => form.name = val} placeholder='Muhammad Usman' />
                <Textbox label='Email:' value={form.email} onChange={(val: string) => form.email = val} placeholder='musmanjamil@gmail.com' />
                <Textbox label='Password:' value={form.password} onChange={(val: string) => form.password = val} placeholder='1234' type='password' />
            </div>
            <div className='flex justify-between items-center'>
                <label onClick={() => props.setStage("signin")} className='text-primary text-sm border-b border-red-600 cursor-pointer'>Sign In</label>
                <Button onClick={handleSignUp}>Create</Button>
            </div>
        </div>
    )
}

export default SignUp