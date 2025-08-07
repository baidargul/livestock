'use client'
import { elapsedTime } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type Props = {
    date: string
    className?: string
}

const ElapsedTimeControl = (props: Props) => {
    const [elapsedString, setElapsedString] = useState('')

    useEffect(() => {

        const interval = setInterval(() => {
            if (props.date && props.date?.length > 0) {
                setElapsedString(elapsedTime(props.date))
            } else {
                setElapsedString('')
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [props.date])

    return (
        elapsedString.length > 0 && <div className={`text-xs ${props.className}`}>{elapsedString}</div>
    )
}

export default ElapsedTimeControl