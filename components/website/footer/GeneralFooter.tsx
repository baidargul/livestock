'use client'

import React from 'react'
import PhoneFooter from './Phone'
import DesktopFooter from './Desktop'
import useDevice from '@/lib/device'

type Props = {}

const GeneralFooter = (props: Props) => {
    const device = useDevice()
    return device.isPhone ? <PhoneFooter /> : <DesktopFooter />
}

export default GeneralFooter