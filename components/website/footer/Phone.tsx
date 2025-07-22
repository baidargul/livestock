'use client'
import { CompassIcon, HouseIcon, ShoppingBagIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProfileMenuWrapper from '../profile/_components/ProfileMenuWrapper'
import RoomsWrapper from './_components/RoomsWrapper'
import FetchLastestRooms from '@/components/Fetchers/FetchLastestRooms'
import { useUser } from '@/socket-client/SocketWrapper'

type Props = {}

const PhoneFooter = (props: Props) => {
    const [route, setRoute] = useState('')
    const user = useUser()

    useEffect(() => {
        setRoute(window.location.pathname)
    }, [])



    return (
        <div className='bg-emerald-100 text-emerald-600 z-50 sticky bottom-0 left-0 w-full h-14 flex justify-evenly items-center'>
            <FetchLastestRooms />
            <Link href={'/home'}>
                <div className={`${route.includes("home") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center scale-75 origin-center-left`}>
                    <HouseIcon />
                    <div>
                        Home
                    </div>
                </div>
            </Link>
            <Link href={'/nearby'}>
                <div className={`${route.includes("nearby") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center scale-75 origin-center-left`}>
                    <CompassIcon />
                    <div>
                        Temp
                    </div>
                </div>
            </Link>
            <RoomsWrapper forPhone>
                <div className={`${route.includes("cart") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""} w-fit h-fit flex flex-col text-center justify-center items-center  scale-75 origin-center-left`}>
                    <ShoppingBagIcon />
                    <div>
                        BidRooms
                    </div>
                </div>
            </RoomsWrapper>
            <ProfileMenuWrapper>
                <div className={`${route.includes("profile") ? "bg-emerald-50 border-b-2 border-emerald-200 rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center  scale-75 origin-center-left`}>
                    <UserIcon />
                    <div>
                        {user ? user?.name : "Profile"}
                    </div>
                </div>
            </ProfileMenuWrapper>
        </div>
    )
}

export default PhoneFooter