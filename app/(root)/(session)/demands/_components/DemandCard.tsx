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
        <Link href={`/demands/${demand.id}`} className=''>
            <div className={`w-full mb-4 break-inside-avoid cursor-pointer select-none p-2 bg-white border border-zinc-300 ${demand.user.id === props.user?.id ? "bg-gradient-to-t from-emerald-50 to-transparent" : ""}`}>
                <Image src={image} alt={`${demand.type} - ${demand.breed}`} width={50} height={50} className={`object-cover w-full h-24`} />
                <div className='p-1'>
                    <div className='flex gap-1 items-center'>
                        <div>
                            {totalQuantity}
                        </div>
                        <div>
                            x
                        </div>
                        <div className='truncate '>
                            {formalizeText(demand.breed)} {" "}
                            {formalizeText(demand.type)}
                        </div>
                    </div>
                    <div className='text-xs text-zinc-600 flex justify-between items-start'>
                        <div>
                            {new Date(demand.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <div>
                                {demand.city}, {demand.province}
                            </div>
                            {demand.activeRooms > 0 && <div>
                                {demand.activeRooms} bidders
                            </div>}
                        </div>
                    </div>
                    <div className={`${demand.user.id === props.user?.id ? "text-emerald-700 line-clamp-1 font-semibold" : ""}`}>
                        {demand.user.name}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default DemandCard