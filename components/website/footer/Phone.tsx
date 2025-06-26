import { CompassIcon, HouseIcon, ShoppingBagIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProfileMenuWrapper from '../profile/_components/ProfileMenuWrapper'
import RoomsWrapper from './_components/RoomsWrapper'
import FetchLastestRooms from '@/components/Fetchers/FetchLastestRooms'

type Props = {}

const PhoneFooter = (props: Props) => {
    return (
        <div className='bg-emerald-100 text-emerald-600 z-50 sticky bottom-0 left-0 w-full h-14 flex justify-evenly items-center'>
            <FetchLastestRooms />
            <Link href={'/home'}>
                <HouseIcon />
            </Link>
            <Link href={'/nearby'}>
                <CompassIcon />
            </Link>
            <RoomsWrapper>
                <ShoppingBagIcon />
            </RoomsWrapper>
            <ProfileMenuWrapper>
                <UserIcon />
            </ProfileMenuWrapper>
        </div>
    )
}

export default PhoneFooter