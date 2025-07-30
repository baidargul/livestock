import FetchLastestRooms from '@/components/Fetchers/FetchLastestRooms'
import React from 'react'
import SiteLogo from '../logo/SiteLogo'
import Textbox from '@/components/ui/Textbox'
import RoomsWrapper from '../footer/_components/RoomsWrapper'
import { ChartCandlestickIcon } from 'lucide-react'
import ProfileMenu from './home/_components/ProfileMenu'

type Props = {}

const DesktopHeader = (props: Props) => {
    return (
        <div className='w-full p-4 pr-6 bg-zinc-100 border-b border-zinc-200 flex justify-between gap-4 mb-10'>
            <FetchLastestRooms />
            <div className='flex gap-1 items-center w-full'>
                <SiteLogo size='lg' />
                <div>
                    <div className='text-2xl font-semibold tracking-tight'>Janwar Markaz</div>
                    <div className='text-zinc-500 text-sm'>Your trusted animal marketplace</div>
                </div>
            </div>
            <div className='h-full my-auto w-full'>
                <Textbox className='bg-white' placeholder='Search' />
            </div>
            <div className='h-full my-auto flex justify-end items-center gap-2 w-full'>
                <div className='menu-item'>
                    Market
                </div>
                <div className='menu-item'>
                    Demands
                </div>
                <div className='menu-item'>
                    <RoomsWrapper>
                        <ChartCandlestickIcon />
                    </RoomsWrapper>
                </div>
                <div className='menu-item'>
                    <ProfileMenu />
                </div>
            </div>
        </div>
    )
}

export default DesktopHeader