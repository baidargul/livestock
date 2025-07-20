'use client'

import React, { useEffect, useState } from 'react'
import useDevice from '@/lib/device'
import PhoneHeaderHome from './home/Phone'
import PhoneHeader from './PhoneHeader'
import DesktopHeader from './DesktopHeader'
import DesktopHeaderHome from './home/DesktopHeaderHome'

type Props = {}

const GeneralHeader = (props: Props) => {
    const [route, setRoute] = useState('')

    useEffect(() => {
        setRoute(window.location.pathname)
    }, [])

    const device = useDevice()
    return route.length > 0 && device.isPhone ? route.includes("home") === true ? <PhoneHeaderHome /> : <PhoneHeader /> : device.isDesktop || device.isLaptop || device.isTablet ? route.includes("home") === true ? <DesktopHeaderHome /> : <DesktopHeader /> : null
}

export default GeneralHeader