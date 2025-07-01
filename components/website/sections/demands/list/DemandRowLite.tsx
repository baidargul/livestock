'use client'
import { actions } from '@/actions/serverActions/actions'
import React, { useEffect, useState } from 'react'
import DemandLite from './DemandLite'
import Reels from '@/components/animation-wrappers/Reels'
import { TrendingUpIcon } from 'lucide-react'
import { useSession } from '@/hooks/useSession'

type Props = {}

const DemandRowLite = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [demands, setDemands] = useState<any>([])
    const [user, setUser] = useState<any>(null)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        setIsMounted(true)

        return () => {
            setIsMounted(false)
            setDemands([])
            setUser(null)
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUser(rawUser)
            fetchDemands(rawUser)
        }
    }, [isMounted])

    const fetchDemands = async (user: any) => {
        const response = await actions.client.demand.listAll()
        if (response.status === 200) {
            const raw = []
            for (const demand of response.data) {
                raw.push(<DemandLite key={demand.id} demand={demand} user={user} />)
            }
            setDemands(raw)
        } else {
            setDemands([])
        }
    }

    return (
        isMounted && demands && demands.length > 0 &&
        <div className="w-full mb-2">
            <div className='mb-2 font-semibold tracking-tight flex gap-1 items-center'>Demands <TrendingUpIcon size={16} className='mt-1' /></div>
            <div className='w-full relative pt-2'>
                <div className='w-[20%] h-full absolute top-0 right-0 pointer-events-none bg-gradient-to-l z-10 from-white to-transparent'></div>
                <div className='w-[20%] h-full absolute top-0 left-0 pointer-events-none bg-gradient-to-r z-10 from-white to-transparent'></div>
                <Reels direction='horizontal' fps={60} gap={0} images={demands} directObject />
            </div>
        </div>
    )
}

export default DemandRowLite