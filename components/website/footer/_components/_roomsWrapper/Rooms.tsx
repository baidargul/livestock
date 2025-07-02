'use client'
import React, { useState } from 'react'
import Room from './Room'
import { ChevronDown, ChevronLeftIcon } from 'lucide-react'

type Props = {
    rooms: any
    user: any
}

const Rooms = (props: Props) => {
    const [currentSection, setCurrentSection] = useState<"" | "myRooms" | "otherRooms">("")

    const handleSelectSection = (section: "" | "myRooms" | "otherRooms") => {
        if (currentSection === section) {
            console.log(`section is ''`)
            setCurrentSection("")
        } else {
            console.log(`section is ${section}`)
            setCurrentSection(section)
        }
    }

    return (
        <div className='w-full h-full'>
            <div onClick={() => handleSelectSection("myRooms")} className='flex p-2 justify-between items-center bg-zinc-100'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>My Listings</div>
                <ChevronLeftIcon size={20} className={`transition-all duration-300 ease-in-out ${currentSection === "myRooms" ? "-rotate-90" : ""}`} />
            </div>
            <section style={{ height: currentSection === "myRooms" ? "90%" : currentSection === "otherRooms" ? "0px" : "50%" }} className='p-2 cursor-pointer border-b border-zinc-400 mb-2 bg-gradient-to-b from-zinc-100 to-transparent transition-all duration-300 ease-in-out flex flex-col gap-1 w-full'>
                {props.rooms && props.rooms.myRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2'>
                        {
                            props.rooms.myRooms.map((room: any, index: number) => {
                                return (
                                    <Room room={room} key={`${room.key}-${index}`} user={props.user} />
                                )
                            })
                        }
                    </div>
                }
            </section>
            <div onClick={() => handleSelectSection("otherRooms")} className='flex p-2 justify-between items-center bg-zinc-100'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>Other deals</div>
                <ChevronLeftIcon size={20} className={`transition-all duration-300 ease-in-out ${currentSection === "otherRooms" ? "-rotate-90" : ""}`} />
            </div>
            <section style={{ height: currentSection === "otherRooms" ? "85%" : currentSection === "myRooms" ? "0px" : "50%" }} className='p-2 border-b border-zinc-400 bg-gradient-to-b from-zinc-100 to-transparent cursor-pointer transition-all duration-300 ease-in-out flex flex-col gap-1 w-full'>
                {props.rooms && props.rooms.otherRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-full overflow-y-auto pr-2'>
                        {[...props.rooms.otherRooms, ...props.rooms.otherRooms, ...props.rooms.otherRooms].map((room: any, index: number) => {
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