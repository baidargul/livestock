import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import React from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const SignUp = (props: Props) => {
    return (
        <div className='flex flex-col gap-4'>
            <div>
                <h1 className='heading1 text-primary font-bold'>Create a new account</h1>
            </div>
            <div className='flex flex-col gap-1'>
                <Textbox label='Name:' placeholder='Muhammad Usman' />
                <Textbox label='Email:' placeholder='musmanjamil@gmail.com' />
                <Textbox label='Password:' placeholder='1234' type='password' />
            </div>
            <div className='flex justify-between items-center'>
                <label onClick={() => props.setStage("signin")} className='text-primary text-sm border-b border-red-600 cursor-pointer'>Sign In</label>
                <Button>Create</Button>
            </div>
        </div>
    )
}

export default SignUp