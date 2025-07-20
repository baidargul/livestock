'use client'
import { actions } from '@/actions/serverActions/actions'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    demand: any
}

const FulFilmentUserProtection = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const user = useUser()
    const [validatingPreviousState, setValidatingPreviousState] = useState(false)
    const [hasPlacedOffer, setHasPlacedOffer] = useState(false)
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            if (user && user.id !== props.demand.userId) {
                setValidatingPreviousState(true)
                const hasPlacedOffer = async () => {
                    const response = await actions.client.demand.hasUserPostedOffer(props.demand.userId, props.demand.id)
                    if (response.status === 200) {
                        setHasPlacedOffer(response.data)
                    } else {
                        setHasPlacedOffer(false)
                    }
                    setValidatingPreviousState(false)
                }

                hasPlacedOffer()
            }
        }
    }, [isMounted, user])

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
                    <div className='w-full animate-pulse cursor-not-allowed select-none grayscale-25'>
                        <div className='w-full pointer-events-none '>
                            {props.children}
                        </div>
                    </div>
                )
            } else {
                if (hasPlacedOffer) {
                    return (
                        <div className='w-full'>
                            <div className='mx-auto w-fit p-1 sm:p-2 sm:border sm:border-emerald-100 sm:not-italic bg-emerald-50 rounded italic tracking-tight text-center'>Your offer has been placed, <br />please check your bidding inbox.</div>
                        </div>
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