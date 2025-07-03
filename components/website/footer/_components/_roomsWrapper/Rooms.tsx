'use client'
import React, { useEffect, useState } from 'react'
import Room from './Room'
import { ChevronDown, ChevronLeftIcon } from 'lucide-react'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { images } from '@/consts/images'

type Props = {
    rooms: any
    user: any
}

const Rooms = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [currentSection, setCurrentSection] = useState<"" | "myRooms" | "otherRooms">("")
    const [myRooms, setMyRooms] = useState([])
    const [otherRooms, setOtherRooms] = useState([])

    const autoSize = () => {
        if (props.rooms.myRooms.length > 0 && props.rooms.otherRooms.length > 0) {
            setCurrentSection("")
        } else if (props.rooms.myRooms.length > 0 && props.rooms.otherRooms.length === 0) {
            setCurrentSection("myRooms")
        } else if (props.rooms.myRooms.length === 0 && props.rooms.otherRooms.length > 0) {
            setCurrentSection("otherRooms")
        } else {
            setCurrentSection("")
        }
    }

    useEffect(() => {
        if (props.rooms) {
            if (props.rooms.myRooms.length > 0) {
                setMyRooms(groupByAnimal(props.rooms.myRooms))
            }
            if (props.rooms.otherRooms.length > 0) {
                setOtherRooms(groupByAnimal(props.rooms.otherRooms))
            }
            setIsReady(true)
        }
    }, [props.rooms])

    useEffect(() => {
        if (isReady) {
            autoSize()
            setIsMounted(true)
        }
    }, [isReady])

    const handleSelectSection = (section: "" | "myRooms" | "otherRooms") => {
        if (currentSection === section) {
            setCurrentSection("")
        } else {
            setCurrentSection(section)
        }
    }

    const groupByAnimal = (rooms: any) => {
        const groupedRooms = rooms.reduce((acc: any, room: any) => {
            acc[room.animalId] = acc[room.animalId] || { rooms: [], animal: null };
            acc[room.animalId].animal = room.animal;
            acc[room.animalId].rooms.push(room);
            return acc;
        }, {});
        return Object.values(groupedRooms) as any;
    }

    return (
        isMounted && <div className='w-full h-full text-zinc-700'>
            <div onClick={() => handleSelectSection("myRooms")} className='flex p-2 justify-between items-center bg-zinc-100'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>Selling Rooms</div>
                <ChevronLeftIcon size={20} className={`transition-all duration-300 ease-in-out ${currentSection === "myRooms" ? "-rotate-90" : ""}`} />
            </div>
            <section style={{ height: currentSection === "myRooms" ? "90%" : currentSection === "otherRooms" ? "0px" : "50%" }} className='p-2 cursor-pointer border-b border-zinc-400 mb-2 bg-gradient-to-b from-zinc-100 to-transparent transition-all duration-300 ease-in-out flex flex-col gap-1 w-full'>
                {myRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2 relative'>
                        {
                            myRooms.map((group: any, index: number) => {
                                const totalQuantity = Number(group.animal?.maleQuantityAvailable ?? 0) + Number(group.animal?.femaleQuantityAvailable ?? 0)
                                return (
                                    <div key={`group-${index}`} className={`flex flex-col gap-2 bg-white p-2`}>
                                        <div className='flex gap-2 items-start w-full'>
                                            <Image src={group.animal.images.length > 0 ? group.animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-[30%] h-full group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-cover' />
                                            <div className='w-full overflow-y-auto h-[200px]'>
                                                <div className='w-full z-[1] sticky top-0 pb-2 bg-white'>
                                                    <div className='flex flex-col items-start sm:flex-row justify-between sm:items-center  w-full'>
                                                        <div className=' text-xl font-semibold tracking-wide'>{formalizeText(group.animal.breed)} {group.animal.type.slice(0, group.animal.type.length - 1)}</div>
                                                        <div className=' text-xl'>{formatCurrency(calculatePricing(group.animal).price)}</div>
                                                    </div>
                                                    <div className='-mt-1 sm:-mt-1'>
                                                        <div>{totalQuantity} {totalQuantity > 1 ? group.animal.type : group.animal.type.slice(0, group.animal.type.length - 1)}, {totalQuantity > 1 ? `${formatCurrency(group.animal.price)} each.` : `${formatCurrency(group.animal.price)}.`}</div>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-1'>
                                                    {
                                                        group.rooms.map((room: any, index: number) => {
                                                            return (
                                                                <Room room={room} key={`${room.key}-${index}`} user={props.user} type='seller' />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </section>
            <div onClick={() => handleSelectSection("otherRooms")} className='flex p-2 justify-between items-center bg-zinc-100'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>Buying Rooms</div>
                <ChevronLeftIcon size={20} className={`transition-all duration-300 ease-in-out ${currentSection === "otherRooms" ? "-rotate-90" : ""}`} />
            </div>
            <section style={{ height: currentSection === "otherRooms" ? "85%" : currentSection === "myRooms" ? "0px" : "50%" }} className='p-2 border-b border-zinc-400 bg-gradient-to-b from-zinc-100 to-transparent cursor-pointer transition-all duration-300 ease-in-out flex flex-col gap-1 w-full'>
                {otherRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2 relative'>
                        {
                            otherRooms.map((group: any, index: number) => {
                                const totalQuantity = Number(group.animal?.maleQuantityAvailable ?? 0) + Number(group.animal?.femaleQuantityAvailable ?? 0)
                                return (
                                    <div key={`group-${index}`} className={`flex flex-col gap-2 bg-white p-2`}>
                                        <div className='flex gap-2 items-start w-full'>
                                            <Image src={group.animal.images.length > 0 ? group.animal.images[0].image : images.chickens.images[1]} loading='lazy' layout='fixed' alt='Product List Row' width={1000} height={1000} draggable={false} className='w-[30%] h-full group-hover:scale-105 transition-all duration-300 ease-in-out bg-black select-none object-cover' />
                                            <div className='w-full overflow-y-auto h-[200px]'>
                                                <div className='w-full z-[1] sticky top-0 pb-2 bg-white'>
                                                    <div className='flex flex-col items-start sm:flex-row justify-between sm:items-center  w-full'>
                                                        <div className=' text-xl font-semibold tracking-wide'>{formalizeText(group.animal.breed)} {group.animal.type.slice(0, group.animal.type.length - 1)}</div>
                                                        <div className=' text-xl'>{formatCurrency(calculatePricing(group.animal).price)}</div>
                                                    </div>
                                                    <div className='-mt-1 sm:-mt-1'>
                                                        <div>{totalQuantity} {totalQuantity > 1 ? group.animal.type : group.animal.type.slice(0, group.animal.type.length - 1)}, {totalQuantity > 1 ? `${formatCurrency(group.animal.price)} each.` : `${formatCurrency(group.animal.price)}.`}</div>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-1'>
                                                    {
                                                        group.rooms.map((room: any, index: number) => {
                                                            return (
                                                                <Room room={room} key={`${room.key}-${index}`} user={props.user} type='buyer' />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </section>
        </div>
    )
}

export default Rooms