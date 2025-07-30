'use client'
import React, { useEffect, useState } from 'react'

type Props = {
    criteria: string
    setCriteria: (val: string) => void
}

const SearchResults = (props: Props) => {
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        if (props.criteria && props.criteria.length > 0) {
            fetchCriteria()
        }
    }, [props.criteria])


    const fetchCriteria = async () => {
        setIsFetching(true)

        setIsFetching(false)
    }

    return (
        <div className='w-full flex flex-col gap-2 absolute -bottom-14 left-0 p-2 bg-white border border-zinc-300 rounded shadow-2xl'>
            <div className='font-semibold text-lg'>
                SearchResults
            </div>
            <div>

            </div>
        </div>
    )
}

export default SearchResults