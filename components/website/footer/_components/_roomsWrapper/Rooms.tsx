'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Room from './Room'
import { ChevronLeftIcon } from 'lucide-react'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { images } from '@/consts/images'
import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'

type Props = {
    rooms: any
    user: any
}

const Rooms = ({ rooms, user }: Props) => {
    const [currentSection, setCurrentSection] = useState<"" | "myRooms" | "otherRooms">("")
    const [isMounted, setIsMounted] = useState(false)

    // Memoize grouped rooms calculation
    const { myRooms, otherRooms } = useMemo(() => {
        const groupByAnimal = (rooms: any) => {
            if (!rooms || !rooms.length) return []

            const grouped = rooms.reduce((acc: any, room: any) => {
                if (!acc[room.animalId]) {
                    acc[room.animalId] = { rooms: [], animal: room.animal }
                }
                acc[room.animalId].rooms.push(room)
                return acc
            }, {})

            return Object.values(grouped).sort((a: any, b: any) =>
                b.rooms[0].createdAt - a.rooms[0].createdAt
            )
        }

        return {
            myRooms: rooms?.myRooms?.length ? groupByAnimal(rooms.myRooms) : [],
            otherRooms: rooms?.otherRooms?.length ? groupByAnimal(rooms.otherRooms) : []
        }
    }, [rooms])

    // Determine initial section state
    useEffect(() => {
        if (myRooms.length > 0 && otherRooms.length > 0) {
            setCurrentSection("")
        } else if (myRooms.length > 0) {
            setCurrentSection("myRooms")
        } else if (otherRooms.length > 0) {
            setCurrentSection("otherRooms")
        }
        setIsMounted(true)
    }, [myRooms, otherRooms])

    const handleSelectSection = useCallback((e: React.MouseEvent, section: "" | "myRooms" | "otherRooms") => {
        e.stopPropagation()
        setCurrentSection(prev => prev === section ? "" : section)
    }, [])

    const renderRoomGroup = useCallback((group: any, type: 'seller' | 'buyer') => {
        const animal = group.animal
        const totalQuantity = (animal?.maleQuantityAvailable || 0) + (animal?.femaleQuantityAvailable || 0)
        const animalType = totalQuantity > 1 ? animal.type : animal.type.slice(0, -1)
        const priceText = totalQuantity > 1 ?
            `${formatCurrency(animal.price)} each ${animal.priceUnit}.` :
            `${formatCurrency(animal.price)}.`

        return (
            <div key={`group-${animal.id}`} className="flex flex-col gap-2 bg-white p-2">
                <div className="flex gap-2 items-start w-full h-full">
                    <div className="w-[40%] h-full relative aspect-square">
                        <BiddingWrapper animal={animal} staticStyle>
                            <Image
                                src={animal.images?.length ? animal.images[0].image : images.chickens.images[1]}
                                alt={animal.breed}
                                fill
                                className="rounded-md h-full object-cover"
                            />
                        </BiddingWrapper>
                    </div>
                    <div className="w-full overflow-y-auto max-h-[200px]">
                        <BiddingWrapper animal={animal} staticStyle>
                            <div className="sticky top-0 pb-2 bg-white z-[1]">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="font-semibold tracking-wide">
                                        {formalizeText(animal.breed)} {animalType}
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        {formatCurrency(calculatePricing(animal).price)}
                                    </div>
                                </div>
                                <div className="text-xs">
                                    {totalQuantity} {animalType}, {priceText}
                                </div>
                            </div>
                        </BiddingWrapper>
                        <div className="flex flex-col gap-8 pt-8">
                            {group.rooms.map((room: any) => (
                                <Room
                                    key={`room-${room.id}`}
                                    room={room}
                                    user={user}
                                    type={type}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [user])

    if (!isMounted) return null

    return (
        <div className="w-full h-full text-zinc-700">
            {/* Selling Rooms Section */}
            <div
                onClick={(e) => handleSelectSection(e, "myRooms")}
                className={`flex p-2 justify-between items-center ${currentSection === "myRooms" ? "bg-emerald-200" : "bg-zinc-100"}  cursor-pointer`}
            >
                <div className="font-semibold text-lg tracking-tight">
                    Selling Rooms
                </div>
                <ChevronLeftIcon
                    size={20}
                    className={`transition-transform duration-300 ${currentSection === "myRooms" ? "-rotate-90" : ""
                        }`}
                />
            </div>
            <section
                style={{
                    height: currentSection === "myRooms" ? "85%" :
                        currentSection === "otherRooms" ? "0" : "50%"
                }}
                className="p-2 bg-gradient-to-b from-zinc-100 to-transparent transition-all duration-300 overflow-hidden"
            >
                {myRooms.length > 0 && (
                    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2">
                        {myRooms.map((group: any) => renderRoomGroup(group, 'seller'))}
                    </div>
                )}
            </section>

            {/* Buying Rooms Section */}
            <div
                onClick={(e) => handleSelectSection(e, "otherRooms")}
                className={`flex p-2 justify-between items-center ${currentSection === "otherRooms" ? "bg-emerald-200" : "bg-zinc-100"} cursor-pointer`}
            >
                <div className="font-semibold text-lg tracking-tight">
                    Buying Rooms
                </div>
                <ChevronLeftIcon
                    size={20}
                    className={`transition-transform duration-300 ${currentSection === "otherRooms" ? "-rotate-90" : ""
                        }`}
                />
            </div>
            <section
                style={{
                    height: currentSection === "otherRooms" ? "85%" :
                        currentSection === "myRooms" ? "0" : "50%"
                }}
                className="p-2 bg-gradient-to-b from-zinc-100 to-transparent transition-all duration-300 overflow-hidden"
            >
                {otherRooms.length > 0 && (
                    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2">
                        {otherRooms.map((group: any) => renderRoomGroup(group, 'buyer'))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Rooms