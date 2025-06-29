'use client'
import { actions } from '@/actions/serverActions/actions'
import { useSession } from '@/hooks/useSession'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    demand: any
}

const FulFilmentUserProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [validatingPreviousState, setValidatingPreviousState] = useState(false)
    const [hasPlacedOffer, setHasPlacedOffer] = useState(false)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawuser = getUser()

            if (rawuser && rawuser.id !== props.demand.userId) {
                setValidatingPreviousState(true)
                const hasPlacedOffer = async () => {
                    const response = await actions.client.demand.hasUserPostedOffer(props.demand.userId, props.demand.id)
                    console.log(response)
                    if (response.status === 200) {
                        setHasPlacedOffer(response.data)
                    } else {
                        setHasPlacedOffer(false)
                    }
                    setValidatingPreviousState(false)
                }

                hasPlacedOffer()
            }
            setUser(rawuser)
        }
    }, [isMounted])

    console.log(props.demand)

    if (user && user.id === props.demand.userId && isMounted) {
        return (
            <div className='pointer-events-none select-none w-full flex flex-col items-center justify-center'>
                <div className='w-full grayscale pointer-events-none select-none line-through'>
                    {props.children}
                </div>
                <label className='tracking-tight p-1 italic text-zinc-700'>You cannot fulfill your own demand</label>
            </div>
        )
    }

    if (isMounted) {
        if (user && user.id !== props.demand.userId) {
            if (validatingPreviousState) {
                return (
                    <div className='w-full pointer-events-none cursor-not-allowed select-none grayscale-25'>{props.children}</div>
                )
            } else {
                if (hasPlacedOffer) {
                    return (
                        <div className='w-full'>Your offer has been placed, please check your bidding inbox.</div>
                    )
                } else {
                    return (
                        <div className='w-full'>{props.children}</div>
                    )
                }
            }
        }
    }
}

export default FulFilmentUserProtection