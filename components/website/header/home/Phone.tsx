import React from 'react'
import SiteLogo from '../../logo/SiteLogo'
import UserProfileIcon from '../../profile/Icon'
import ProductSearchBar from '../../searchbar/ProductSearchBar'
import Username from './_components/Username'

type Props = {}

const PhoneHeaderHome = (props: Props) => {

    return (
        <div className='sticky top-0 left-0 z-40 w-full bg-white'>
            <div className='flex justify-between items-center w-full  pr-2'>
                <div className='flex items-center gap-2'>
                    <SiteLogo />
                    <div className=''>
                        <div className='heading2'><span className='tracking-tight'>Hello,</span> <Username /></div>
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

export default PhoneHeaderHome