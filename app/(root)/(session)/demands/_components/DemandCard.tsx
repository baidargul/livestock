import { images } from '@/consts/images'
import { formalizeText } from '@/lib/utils'
import { Demands } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    demand: any
    user: any
}

const DemandCard = (props: Props) => {
    const demand = props.demand
    const image = images[demand.type.toLowerCase()]?.images[1]
    const totalQuantity = Number(demand.maleQuantityAvailable || 0) + Number(demand.femaleQuantityAvailable || 0)
    return (
        <Link href={`/demands/${demand.id}`}>
            <div className={`cursor-pointer select-none p-2 bg-white rounded shadow-sm ${demand.user.id === props.user?.id ? "bg-gradient-to-t from-emerald-50 to-transparent" : ""}`}>
                <Image src={image} alt={`${demand.type} - ${demand.breed}`} width={50} height={50} className={`object-cover w-full h-24`} />
                <div className='p-1'>
                    <div className='flex gap-1 items-center'>
                        <div>
                            {totalQuantity}
                        </div>
                        <div>
                            x
                        </div>
                        <div className='font-semibold flex gap-1  items-center'>
                            <span>
                                {formalizeText(demand.breed)}
                            </span>
                            <span>
                                {formalizeText(demand.type)}
                            </span>
                        </div>
                    </div>
                    <div className='text-xs text-zinc-600 flex justify-between items-center'>
                        <div>
                            {new Date(demand.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            {demand.city}, {demand.province}
                        </div>
                    </div>
                    <div className={`${demand.user.id === props.user?.id ? "text-emerald-700 font-semibold" : ""}`}>
                        {demand.user.name}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default DemandCard