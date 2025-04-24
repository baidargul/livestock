'use client'
import React, { useEffect, useState } from 'react'

type Props = {
    onChange?: (rating: number) => void
    defaultRating?: number
    disabled?: boolean
    readonly?: boolean
}

const RatingBar = (props: Props) => {
    const [ratings, setRatings] = useState<number>(1)

    useEffect(() => {
        setRatings(props.defaultRating || 1)
    }, [props.defaultRating])

    const handleRatingChange = (newRating: number) => {
        if (props.disabled) return
        setRatings(newRating)
        if (props.onChange) {
            props.onChange(newRating)
        }
    }

    return (
        <div className='flex gap-1 items-center'>
            {
                !props.readonly && [1, 2, 3, 4, 5].map((item) => {
                    return (
                        <div onClick={() => handleRatingChange(item)} key={item} className={` ${item <= ratings ? 'text-yellow-500 fill-yellow-500 cursor-pointer' : `text-gray-300 grayscale cursor-pointer ${!props.disabled ? 'hover:grayscale-5' : "cursor-default"}`} text-sm`}>
                            {item <= ratings ? '⭐' : '⭐'}
                        </div>
                    )
                })
            }
            {
                props.readonly &&
                <div className={`flex gap-1 items-center`}>
                    <span className=''>⭐</span><span className='font-medium'>{ratings}</span>
                </div>
            }
        </div>
    )
}

export default RatingBar