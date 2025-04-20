import Button from '@/components/ui/Button'
import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'

type Props = {
    setStage: (val: signInStages) => void
}

const Onboarding = (props: Props) => {
    return (
        <>
            <div className='heading1 text-primary text-center'>
                <Image src={images.site.logo.desktopIcon} draggable={false} width={500} height={500} quality={4} alt='livestock' className='select-none pointer-events-none mx-auto -mt-5 w-32 h-32 object-contain' />
                Welcome to Livestock
                <div className='subheading1 text-center'>Apka apni livestock ka sab se behtareen digital partner!</div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 w-full'>
                <Button >Create an account</Button>
                <Button variant='btn-secondary' >Already have an account?</Button>
            </div>
        </>
    )
}

export default Onboarding