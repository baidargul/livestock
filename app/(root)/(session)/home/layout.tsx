import DesktopFooter from '@/components/website/footer/Desktop'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import PhoneFooter from '@/components/website/footer/Phone'
import GeneralHeader from '@/components/website/header/GeneralHeader'
import PhoneHeaderHome from '@/components/website/header/home/Phone'
import device from '@/lib/device'
import React from 'react'

type Props = {
    children: any
}

const layout = (props: Props) => {
    return (
        <div className='w-full select-none min-h-[100dvh] flex flex-col justify-between'>
            <GeneralHeader />
            {props.children}
            <GeneralFooter />
        </div>
    )
}

export default layout