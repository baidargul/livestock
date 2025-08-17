'use client'
import { actions } from '@/actions/serverActions/actions'
import { images } from '@/consts/images'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { List, LucideLayoutDashboard, PlusCircleIcon, SquareUserIcon, TrendingUpIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import SiteLogo from '../../logo/SiteLogo'
import DemandRowLite from '../../sections/demands/list/DemandRowLite'
import { useRouter } from 'next/navigation'
import CoinsAvailable from './CoinsAvailable'
import SignInSignOutWrapper from '@/components/wrappers/SignInSignOutWrapper'
import { useUser } from '@/socket-client/SocketWrapper'
import { useRooms } from '@/hooks/useRooms'

type Props = {
    children: React.ReactNode
}

const ProfileMenuWrapper = (props: Props) => {
    const [isToggled, setIsToggled] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const user = useUser()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleToggleMenu = (val: boolean) => {
        if (isMounted) {
            if (user) {
                setIsToggled(val)
            }
        }
    }

    return (
        <div className='select-none'>
            <SignInSignOutWrapper>
                <div onClick={() => handleToggleMenu(true)} className='cursor-pointer'>
                    {props.children}
                </div>
            </SignInSignOutWrapper>
            <MenuWrapper handleToggleMenu={handleToggleMenu} isToggled={isToggled} />
        </div>
    )
}

export default ProfileMenuWrapper

const MenuWrapper = ({ handleToggleMenu, isToggled }: any) => {
    const logoutUser = useSession((state: any) => state.logoutUser);
    const setLoading = useLoader((state: any) => state.setLoading)
    const loading = useLoader((state: any) => state.loading)
    const router = useRouter();
    const clearRooms = useRooms((state: any) => state.clearRooms);
    const user = useUser()

    const handleLoggout = async () => {
        setLoading(true)
        handleToggleMenu(false)
        const response = await actions.client.user.signout({ token: user?.token });
        if (response.status === 200) {
            clearRooms();
            logoutUser();
            // router.push("/");
        } else {
        }
        setLoading(false)
    }

    return (
        <div className={`${loading ? "pointer-events-none opacity-0" : ""} fixed top-0 right-0 w-full h-full bg-white text-black z-20 p-2 transition-all duration-200 ease-in-out ${isToggled ? "translate-x-0" : "translate-x-full"}`}>
            <div>
                <div className='font-bold px-2 tracking-wider text-2xl flex justify-between items-center'>
                    <div>Menu</div>
                    <div>
                        <X onClick={() => handleToggleMenu(false)} className='cursor-pointer' />
                    </div>
                </div>

                {!user && <div>
                    <div className='flex flex-col gap-2 items-center'>
                        <SiteLogo />
                        <div className='leading-5'>Hi there! You need an account to perform actions.</div>
                        <div className='p-2 px-4 tracking-widest bg-zinc-100 rounded-lg '>Go to <Link href={'/signin'} className='text-red-600'>Login</Link></div>
                    </div>
                </div>}

                {user && user.id && <div className='flex flex-col gap-2'>
                    <div className='mt-5 p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                        <Link href={user && user.id ? `/user/profile/${user.id}` : "#"}>
                            <div className='flex gap-4 items-center'>
                                <Image src={user.profileImage && user.profileImage.length > 0 ? user.profileImage[0].image : images.site.placeholders.userProfile} width={40} height={40} layout='fixed' loading='lazy' quality={100} alt='janwarmarkaz' className='rounded-full object-cover w-10 h-10' onClick={() => handleToggleMenu(false)} />
                                <div className=''>
                                    <div className='font-semibold text-xl tracking-wide'>{user?.name}</div>
                                    <div className='text-sm tracking-wide -mt-1 italic text-black/60'>{user?.email}</div>
                                </div>
                            </div>
                        </Link>
                        <CoinsAvailable />
                    </div>
                    <div className='w-full -mb-4'>
                        <DemandRowLite />
                    </div>
                    <div className='grid grid-cols-2 gap-2 mt-5'>
                        <div className='active:scale-90 transition-all duration-200 ease-in-out cursor-pointer p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                            <Link href={'/animal/add'}>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <PlusCircleIcon />
                                    </div>
                                    <div className=''>
                                        <div className='font-semibold tracking-wide'>Add new animal</div>
                                        <div className='text-xs tracking-wide italic text-black/60'>Create a new animal post for sale.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='active:scale-90 transition-all duration-200 ease-in-out cursor-pointer p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                            <Link href={'/home'}>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <List />
                                    </div>
                                    <div className=''>
                                        <div className='font-semibold tracking-wide'>See all animals</div>
                                        <div className='text-xs tracking-wide italic text-black/60'>List of all your animals.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='active:scale-90 transition-all duration-200 ease-in-out cursor-pointer p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                            <Link href={'/animal/demand'}>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <TrendingUpIcon />
                                    </div>
                                    <div className=''>
                                        <div className='font-semibold tracking-wide'>Post demand</div>
                                        <div className='text-xs tracking-wide italic text-black/60'>Create a post for a new demand.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='active:scale-90 transition-all duration-200 ease-in-out cursor-pointer p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                            <Link href={'/demands'}>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <List />
                                    </div>
                                    <div className=''>
                                        <div className='font-semibold tracking-wide'>Demand center</div>
                                        <div className='text-xs tracking-wide italic text-black/60'>All listed demands.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='active:scale-90 transition-all duration-200 ease-in-out cursor-pointer p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                            <Link href={'#'}>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <SquareUserIcon />
                                    </div>
                                    <div className=''>
                                        <div className='font-semibold tracking-wide'>Contacts</div>
                                        <div className='text-xs tracking-wide italic text-black/60'>All your saved connections.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='active:scale-90 transition-all duration-200 ease-in-out cursor-pointer p-4 flex gap-2 justify-between bg-white rounded-xl drop-shadow-sm items-center'>
                            <Link href={'/orders'}>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <LucideLayoutDashboard />
                                    </div>
                                    <div className=''>
                                        <div className='font-semibold tracking-wide'>Orders</div>
                                        <div className='text-xs tracking-wide italic text-black/60'>Your orders dashboard.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div onClick={handleLoggout} className='bg-zinc-100 border border-zinc-200/40 cursor-pointer p-4 rounded-xl mt-5 mx-5 text-center font-semibold tracking-widest'>
                        Logout
                    </div>
                </div>}
            </div>
        </div>
    )
}