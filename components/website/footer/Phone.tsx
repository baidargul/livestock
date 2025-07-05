'use client'
import { CompassIcon, HouseIcon, ShoppingBagIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProfileMenuWrapper from '../profile/_components/ProfileMenuWrapper'
import RoomsWrapper from './_components/RoomsWrapper'
import FetchLastestRooms from '@/components/Fetchers/FetchLastestRooms'

type Props = {}

const PhoneFooter = (props: Props) => {
    const [route, setRoute] = useState('')

    useEffect(() => {
        setRoute(window.location.pathname)
    }, [])



    return (
        <div className='bg-emerald-100 text-emerald-600 z-50 sticky bottom-0 left-0 w-full h-14 flex justify-evenly items-center'>
            <FetchLastestRooms />
            <Link href={'/home'}>
                <div className={route.includes("home") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""}>
                    <HouseIcon />
                </div>
            </Link>
            <Link href={'/nearby'}>
                <div className={route.includes("nearby") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""}>
                    <CompassIcon />
                </div>
            </Link>
            <RoomsWrapper>
                <div className={route.includes("cart") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""}>
                    <ShoppingBagIcon />
                </div>
            </RoomsWrapper>
            <ProfileMenuWrapper>
                <div className={route.includes("profile") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""}>
                    <UserIcon />
                </div>
            </ProfileMenuWrapper>
        </div>
    )
}

export default PhoneFooter