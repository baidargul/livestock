import React, { useState } from 'react'
import AnimalRow from './selectAnimal/AnimalRow'
import { useRooms } from '@/hooks/useRooms'

type Props = {
    animal?: any
}

const SelectAnimal = (props: Props) => {
    const Rooms = useRooms()

    if ([...Rooms.rooms.myRooms, ...Rooms.rooms.otherRooms].length === 0) {
        return (
            <div>No Bargaining is started with any animal yet.</div>
        )
    }

    return (
        <div className='flex flex-col gap-2 bg-zinc-200 p-2'>
            {
                Rooms.rooms.otherRooms.map((room: any, index: number) => {
                    return (
                        <AnimalRow key={`${room.id}-${index + 1}`} room={room} />
                    )
                })
            }
        </div>
    )
}

export default SelectAnimal