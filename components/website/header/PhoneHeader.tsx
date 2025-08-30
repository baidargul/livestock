'use client'
import React from 'react'
import SiteLogo from '../logo/SiteLogo'
import Username from './home/_components/Username'
import UserProfileIcon from '../profile/Icon'
import ProductSearchBar from '../searchbar/ProductSearchBar'
import { useDialog } from '@/hooks/useDialog'

type Props = {}

const PhoneHeader = (props: Props) => {
    const dialog = useDialog()
    return (
        <div className={`sticky top-0 left-0 ${dialog.layer === "" ? "z-50" : "z-20"}  w-full bg-white pb-1 shadow-sm`}>
            <div className='flex justify-between items-center w-full  pr-2'>
                <div className='flex items-center gap-2'>
                    <SiteLogo />
                    <div className=''>
                        <div className='heading2'><span className='tracking-tight'></span> <Username /></div>
                        <div className='subheading1 -mt-1'>Search for a new animal</div>
                    </div>
                </div>
                <div>
                    <UserProfileIcon />
                </div>
            </div>
            <div>
                <ProductSearchBar />
            </div>
        </div>
    )
}

export default PhoneHeader