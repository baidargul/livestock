import { CompassIcon, HouseIcon, ShoppingBagIcon, UserIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const PhoneFooter = (props: Props) => {
    return (
        <div className='bg-emerald-100 text-emerald-600 sticky bottom-0 left-0 w-full h-14 flex justify-evenly items-center'>
            <HouseIcon />
            <CompassIcon />
            <ShoppingBagIcon />
            <UserIcon />
        </div>
    )
}

export default PhoneFooter