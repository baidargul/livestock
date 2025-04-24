import PhoneFooter from '@/components/website/footer/Phone'
import PhoneHeaderHome from '@/components/website/header/home/Phone'
import React from 'react'

type Props = {
    children: any
}

const layout = (props: Props) => {
    return (
        <div className='w-full select-none min-h-[100dvh] flex flex-col justify-between'>
            <PhoneHeaderHome />
            {props.children}
            <PhoneFooter />
        </div>
    )
}

export default layout