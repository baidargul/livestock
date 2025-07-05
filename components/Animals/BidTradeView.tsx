'use client'
import React, { useEffect, useState } from 'react'

type Props = {}

const BidTradeView = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)


    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div>BidTradeView</div>
    )
}

export default BidTradeView