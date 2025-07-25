'use client'
import { images } from '@/consts/images'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {}

const CoinsAvailable = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const user = useUser();
    const userState: any = useSession((state) => state)
    const fetchBalance = async () => {
        await userState.fetchBalance();
    }

    useEffect(() => {
        if (isMounted) {
            fetchBalance();
        }
    }, [isMounted])

    useEffect(() => {
        if (user) {
            setIsMounted(true);
        }
    }, [user])

    return (
        isMounted && <div className={`${userState?.isFetchingBalance ? "animate-pulse" : ""} flex flex-col items-center justify-center text-center gap-1`}>
            <Image src={images.site.coins.gold.shine} alt='coin-logo' width={100} height={100} className='w-8 h-8 object-contain pointer-events-none select-none' />
            <div className='text-xs text-nowrap '>{userState.balance} coins</div>
        </div>
    )
}

export default CoinsAvailable