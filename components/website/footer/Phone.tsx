'use client'
import { CompassIcon, HouseIcon, PlusCircleIcon, ShoppingBagIcon, SquareUserIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProfileMenuWrapper from '../profile/_components/ProfileMenuWrapper'
import RoomsWrapper from './_components/RoomsWrapper'
import FetchLastestRooms from '@/components/Fetchers/FetchLastestRooms'
import { useUser } from '@/socket-client/SocketWrapper'
import ContactsWrapper from './_components/ContactsWrapper'
import Image from 'next/image'
import { images } from '@/consts/images'
import NewContactAnimationWrapper from '@/components/animation-wrappers/NewContactAnimationWrapper'

type Props = {}

const PhoneFooter = (props: Props) => {
    const [route, setRoute] = useState('')
    const user = useUser()

    useEffect(() => {
        setRoute(window.location.pathname)
    }, [])



    return (
        <div className='mt-10 bg-zinc-100 border-t border-zinc-200 text-zinc-600 select-none z-40 sticky bottom-0 left-0 w-full h-14 flex justify-evenly items-center'>
            <FetchLastestRooms />
            <Link href={'/home'}>
                <div className={`${route.includes("home") ? "bg-white border-b-2 border-zinc-200 text-black rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center scale-75 origin-center-left`}>
                    <HouseIcon />
                    <div>
                        Home
                    </div>
                </div>
            </Link>

            {/* <Link href={'/nearby'}>
                <div className={`${route.includes("nearby") ? "bg-white border-b-2 border-zinc-200 rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center scale-75 origin-center-left`}>
                    <CompassIcon />
                    <div>
                        Temp
                    </div>
                </div>
            </Link> */}
            {user && <RoomsWrapper forPhone>
                <div className={`${route.includes("cart") ? "bg-white border-b-2 border-zinc-200 text-black rounded p-1 px-2" : ""} w-fit h-fit flex flex-col text-center justify-center items-center  scale-75 origin-center-left`}>
                    <ShoppingBagIcon />
                    <div>
                        Bargains
                    </div>
                </div>
            </RoomsWrapper>}
            {user && <Link href={'/animal/add'} className='mb-5 group bg-zinc-100 rounded-full border-t border-t-zinc-200'>
                <div className={`${route.includes("animal/add") ? "bg-white border-b-2 border-zinc-200 text-black rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center scale-75 origin-center-left`}>
                    <PlusCircleIcon size={50} className='group-hover:text-emerald-700 transition duration-300 ease-in-out' />
                    <div className=''>
                        Sell
                    </div>
                </div>
            </Link>}
            {user && <ContactsWrapper>
                <div className={`${route.includes("contacts") ? "bg-white border-b-2 border-zinc-200 text-black rounded p-1 px-2" : ""} w-fit h-fit cursor-pointer flex flex-col text-center justify-center items-center  scale-75 origin-center-left`}>
                    <SquareUserIcon />
                    <div>
                        Contacts
                    </div>
                </div>
            </ContactsWrapper>}
            <ProfileMenuWrapper>
                <div className={`${route.includes("profile") ? "bg-white border-b-2 border-zinc-200 text-black rounded p-1 px-2" : ""} flex flex-col text-center justify-center items-center  scale-75 origin-center-left`}>
                    <UserIcon />
                    <div className='line-clamp-1 max-w-20'>
                        {user ? user?.name : "Login"}
                    </div>
                </div>
            </ProfileMenuWrapper>
        </div>
    )
}

export default PhoneFooter