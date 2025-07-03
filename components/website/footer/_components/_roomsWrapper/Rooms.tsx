'use client'
import React, { useEffect, useState } from 'react'
import Room from './Room'
import { ChevronDown, ChevronLeftIcon } from 'lucide-react'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'

type Props = {
    rooms: any
    user: any
}

const Rooms = (props: Props) => {
    const [currentSection, setCurrentSection] = useState<"" | "myRooms" | "otherRooms">("")

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
        autoSize()
    }, [props.rooms])

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
        return Object.values(groupedRooms);
    }
    return (
        <div className='w-full h-full'>
            <div onClick={() => handleSelectSection("myRooms")} className='flex p-2 justify-between items-center bg-zinc-100'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>Selling</div>
                <ChevronLeftIcon size={20} className={`transition-all duration-300 ease-in-out ${currentSection === "myRooms" ? "-rotate-90" : ""}`} />
            </div>
            <section style={{ height: currentSection === "myRooms" ? "90%" : currentSection === "otherRooms" ? "0px" : "50%" }} className='p-2 cursor-pointer border-b border-zinc-400 mb-2 bg-gradient-to-b from-zinc-100 to-transparent transition-all duration-300 ease-in-out flex flex-col gap-1 w-full'>
                {props.rooms && props.rooms.myRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2'>
                        {
                            groupByAnimal(props.rooms.myRooms).map((group: any, index: number) => {
                                return (
                                    <div key={`group-${index}`} className={`flex flex-col gap-2 bg-white p-2`}>
                                        <div className='flex justify-between items-center'>
                                            <div className='text-xl font-semibold tracking-wide'>{formalizeText(group.animal.breed)} {group.animal.type.slice(0, group.animal.type.length - 1)}</div>
                                            <div className='text-xl'>{formatCurrency(calculatePricing(group.animal).price)}</div>
                                        </div>
                                        <div>
                                            {
                                                group.rooms.map((room: any, index: number) => {
                                                    return (
                                                        <Room room={room} key={`${room.key}-${index}`} user={props.user} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </section>
            <div onClick={() => handleSelectSection("otherRooms")} className='flex p-2 justify-between items-center bg-zinc-100'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>Buying</div>
                <ChevronLeftIcon size={20} className={`transition-all duration-300 ease-in-out ${currentSection === "otherRooms" ? "-rotate-90" : ""}`} />
            </div>
            <section style={{ height: currentSection === "otherRooms" ? "85%" : currentSection === "myRooms" ? "0px" : "50%" }} className='p-2 border-b border-zinc-400 bg-gradient-to-b from-zinc-100 to-transparent cursor-pointer transition-all duration-300 ease-in-out flex flex-col gap-1 w-full'>
                {props.rooms && props.rooms.otherRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2'>
                        {props.rooms.otherRooms.map((room: any, index: number) => {
                            return (
                                <Room room={room} key={`${room.key}-${index}`} user={props.user} />
                            )
                        })}
                    </div>
                }
            </section>
        </div>
    )
}

export default Rooms