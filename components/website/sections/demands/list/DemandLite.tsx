import { formalizeText } from '@/lib/utils'
import { Demands } from '@prisma/client'
import React from 'react'

type Props = {
    demand: Demands
}

const DemandLite = (props: Props) => {

    const { demand } = props

    const totalQuantity = Number(demand.maleQuantityAvailable || 0) + Number(demand.femaleQuantityAvailable || 0)

    return (
        <div className='p-1 scale-75 origin-top-left select-none cursor-pointer px-2 bg-white rounded drop-shadow-sm'>
            <div className='font-semibold'>{totalQuantity} {formalizeText(demand.breed)} {demand.type}.</div>
            <div className='text-zinc-400 text-xs'>{demand.city}, {demand.province}</div>
        </div>
    )
}

export default DemandLite