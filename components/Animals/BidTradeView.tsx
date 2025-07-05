'use client'
import { useRooms } from '@/hooks/useRooms'
import React, { useEffect, useState } from 'react'
import ApexCharts from 'apexcharts'
import BidTradeViewChart from './BidTradeView/Chart'
import { actions } from '@/actions/serverActions/actions'
import { calculatePricing } from '@/lib/utils'
import { useSession } from '@/hooks/useSession'
type Props = {
    animalId: string,
}

const BidTradeView = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [userId, setUserId] = useState(null)
    const [initialAmount, setInitialAmount] = useState(0)
    const [bids, setBids] = useState<any>([])
    const getUser = useSession((state: any) => state.getUser)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser()
            setUserId(rawUser?.id)
        }
    }, [isMounted])

    useEffect(() => {
        if (userId) {
            const fetchBids = async () => {
                if (userId) {
                    const response = await actions.client.bidRoom.bidding.onAnimal(props.animalId ?? "")
                    if (response.status === 200) {
                        setInitialAmount(calculatePricing(response.data).price)
                        let animal = { ...response.data, price: initialAmount }
                        let newBids = []
                        let seenInitial = false;
                        const initialBidId = animal.bids[animal.bids.length - 1].id
                        newBids = animal.bids.filter((bid: any, index: number) => {
                            // 1) rename your own bids
                            if (bid.userId === userId) {
                                bid.user.name = "You";
                            }

                            // 2) include the very first initial bid, then skip any further ones
                            if (bid.intial /* or `bid.initial` if spelled correctly */) {
                                if (!seenInitial && bid.id === initialBidId) {
                                    seenInitial = true;
                                    return true;          // keep this one
                                }
                                return false;           // drop any other initial bids
                            }

                            // 3) for all non‑initial bids, always keep
                            return true;
                        });
                        animal = null
                        setBids(newBids)
                    }
                }
            }

            const interval = setInterval(fetchBids, 5000)
            return () => {
                setIsMounted(false)
                clearInterval(interval)
            }
        }
    }, [userId])

    if (bids.length === 0) return null

    return (
        <BidTradeViewChart initialAmount={initialAmount} bids={bids} byUser />
    )
}

export default BidTradeView