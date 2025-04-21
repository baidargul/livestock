import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import React from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const SignIn = (props: Props) => {
    return (
        <div className='flex flex-col gap-4 pt-14'>
            <div>
                <h1 className='heading1 text-primary font-bold'>Login to your account</h1>
            </div>
            <div className='flex flex-col gap-1'>
                <Textbox label='Email:' placeholder='musmanjamil@gmail.com' />
                <Textbox label='Password:' placeholder='1234' type='password' />
            </div>
            <div className='flex justify-between items-center'>
                <label onClick={() => props.setStage("signup")} className='text-primary text-sm border-b border-red-600 cursor-pointer'>Create account</label>
                <Button>Sign in</Button>
            </div>
        </div>
    )
}

export default SignIn