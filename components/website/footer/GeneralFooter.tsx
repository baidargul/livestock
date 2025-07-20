'use client'

import React, { useEffect, useState } from 'react'
import PhoneFooter from './Phone'
import DesktopFooter from './Desktop'
import useDevice from '@/lib/device'

type Props = {}

const GeneralFooter = (props: Props) => {
    const [route, setRoute] = useState('')

    useEffect(() => {
        setRoute(window.location.pathname)
    }, [])

    const device = useDevice()
    return route.length > 0 && device.isPhone ? route.includes("home") === true ? <PhoneFooter /> : <PhoneFooter /> : device.isDesktop || device.isLaptop || device.isTablet ? route.includes("home") === true ? <DesktopFooter /> : <DesktopFooter /> : null
}

export default GeneralFooter