'use client'
import { images } from '@/consts/images'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import { CandlestickChartIcon, LocateIcon, LocationEditIcon, MapPinIcon, SquareUserIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import CTOButton from './_components/CTOButton'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import SoldOverlay from '@/components/ui/SoldOverlay'
import { deserialize } from 'bson'

type Props = {
    animal: Animal | any
}

const SectionProductListRow = (props: Props) => {
    const [animal, setAnimal] = useState<Animal | any>(null)
    const user = useUser()
    const socket = useSocket()

    useEffect(() => {
        if (socket) {
            socket.on("sold", (binaryData) => {
                const { animalId } = deserialize(binaryData);
                if (animalId === animal.id) {
                    setAnimal({ ...animal, sold: true })
                }
            })

            return () => {
                socket.off("sold")
            }
        }
    }, [socket, user])

    useEffect(() => {
        setAnimal(props.animal)
    }, [props.animal])

    const totalQuantity = Number(animal?.maleQuantityAvailable || 0) + Number(animal?.femaleQuantityAvailable || 0)

    const sellerCargo = animal?.deliveryOptions.includes("SELLER_DELIVERY")
    const selfPickup = animal?.deliveryOptions.includes("SELF_PICKUP")
    return (
        animal && <SoldOverlay animal={animal}>
            <Link href={`/entity/${animal?.id}`} prefetch={true} className={`break-inside-avoid-column w-full shadow-sm p-2 z-0 ${user?.id === animal.userId ? "bg-white" : "bg-white"}  hover:outline-2 hover:outline-zinc-300 group h-full flex flex-col justify-between`}>
                <div className="flex flex-col items-center gap-0">
                    <div className='relative w-full bg-black border-l border-y border-zinc-200/40 overflow-hidden'>
                        {(animal?.deliveryOptions.length > 0 || animal?.allowBidding) &&
                            <div className='absolute bottom-2  z-[1] right-2 bg-white rounded p-1 flex gap-1 items-center text-zinc-700 border border-zinc-500 drop-shadow-sm'>
                                {sellerCargo && <div title='SELLER CARGO'>
                                    <TruckIcon size={20} />
                                </div>}
                                {selfPickup && <div title='SELF PICKUP'>
                                    <SquareUserIcon size={20} />
                                </div>}
                                {
                                    animal.allowBidding && <div title='ALLOW BIDDING'>
                                        <CandlestickChartIcon size={20} className='text-emerald-700 animate-pulse' />
                                    </div>
                                }
                            </div>}
                        <div className='bg-gradient-to-t from-black/50 to-transparent w-full h-[40%] absolute bottom-0 left-0'></div>
                        <Image src={animal.images.length > 0 ? animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-full h-[150px] group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-contain' />
                    </div>
                    <div className='w-full pt-4'>
                        <div className='transition-all duration-200 ease-in-out w-[90%] sm:w-auto text-xl font-semibold line-clamp-1 text-balance'>{formalizeText(animal?.title)}</div>
                        <div className='-mt-1 text-zinc-700 tracking-tight'>
                            <span className=''>
                                <span className=''>{totalQuantity}</span> <span className=''>{`${animal?.breed} ${String(animal?.type).slice(0, animal?.type.length - 1)}`}</span>
                            </span>
                        </div>
                        {animal?.user?.name && animal?.user?.name.length > 0 && <div className='flex flex-col gap-1'>
                            {animal?.city && animal?.province && animal?.city.length > 0 && animal?.province.length > 0 && <div className='text-xs text-zinc-700 tracking-tight mb-2 flex gap-1 items-center'> <MapPinIcon size={14} /> {formalizeText(animal?.city)}, {formalizeText(animal?.province)}</div>}
                        </div>}
                    </div>
                </div>
                <CTOButton animal={animal} />
            </Link >
        </SoldOverlay>
    )
}

export default SectionProductListRow