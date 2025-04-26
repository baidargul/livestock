import { CompassIcon, HouseIcon, ShoppingBagIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const PhoneFooter = (props: Props) => {
    return (
        <div className='bg-emerald-100 text-emerald-600 sticky bottom-0 left-0 w-full h-14 flex justify-evenly items-center'>
            <Link href={'/home'}>
                <HouseIcon />
            </Link>
            <Link href={'/nearby'}>
                <CompassIcon />
            </Link>
            <ShoppingBagIcon />
            <UserIcon />
        </div>
    )
}

export default PhoneFooter