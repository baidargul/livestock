'use client'
import { elapsedTime } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type Props = {
    date: string
    className?: string
}

const ElapsedTimeControl = (props: Props) => {
    const [isWorking, setIsWorking] = useState(true)
    const [elapsedString, setElapsedString] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.date && props.date?.length > 0) {
                setElapsedString(elapsedTime(props.date))
                setIsWorking(false)
            } else {
                setElapsedString('')
                setIsWorking(false)
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [props.date])

    return (
        <>
            {!isWorking && elapsedString.length > 0 && <div className={`text-xs ${props.className}`}>{elapsedString}</div>}
            {isWorking && <div className={`w-full min-w-[60px] h-4 bg-zinc-200 rounded animate-pulse p-2`}></div>}
        </>
    )
}

export default ElapsedTimeControl