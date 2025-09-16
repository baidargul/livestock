import React, { useEffect, useState } from 'react'
import AnimalRow from './selectAnimal/AnimalRow'
import { useRooms } from '@/hooks/useRooms'
import RoomsContainer from './Rooms/RoomsContainer'
import Chatroom from './ChatRoom/Chatroom'
import { bidsReverse } from '../../Bidding/BiddingWrapper'

type Props = {
    animal?: any
}

const SelectAnimal = (props: Props) => {
    const [currentRoom, setCurrentRoom] = useState<any>(null)
    const [selectedAnimal, setSelectedAnimal] = useState(null)
    const [animals, setAnimals] = useState<any[]>([])
    const Rooms = useRooms()

    const extractAnimals = (rooms: any[]) => {
        let thisRoom = null
        // Map fresh every time
        const animalMap = new Map();

        rooms.forEach((room: any) => {
            const existing = animalMap.get(room.animalId);

            if (existing) {
                existing.rooms += 1;
            } else {
                const subRooms = rooms.filter((r: any) => {
                    if (currentRoom) {
                        if (currentRoom.id === r.id) {
                            thisRoom = r
                            thisRoom.bids = r.bids
                        }
                    }
                    return r.animalId === room.animalId
                });
                animalMap.set(room.animalId, { ...room.animal, roomCount: 1, rooms: subRooms });
            }
        });
        const raw = Array.from(animalMap.values());
        setAnimals(raw)
        if (thisRoom) {
            setCurrentRoom(thisRoom)
        }
        return raw
    }

    const refresh = () => {
        const rooms = [...Rooms.rooms.myRooms, ...Rooms.rooms.otherRooms];
        extractAnimals(rooms)
    }


    useEffect(() => {
        refresh()
    }, [Rooms.rooms.myRooms, Rooms.rooms.otherRooms]);

    const handleSelectAnimal = (animal: any) => {
        setSelectedAnimal(animal)
    }

    const handleSelectCurrentRoom = (room: any) => {
        setCurrentRoom(room)
    }

    return (
        <div className='flex flex-col gap-2 bg-zinc-200 p-2'>
            {
                (animals.length === 0) && <div>No Bargaining is started with any animal yet.</div>
            }
            {
                !selectedAnimal && !currentRoom && animals.map((animal: any, index: number) => {
                    return (
                        !selectedAnimal && <AnimalRow handleSelectAnimal={handleSelectAnimal} key={`${animal.id}-${index + 1}`} animal={animal} />
                    )
                })
            }
            {
                selectedAnimal && !currentRoom && <RoomsContainer handleSelectCurrentRoom={handleSelectCurrentRoom} handleSelectAnimal={handleSelectAnimal} animal={selectedAnimal} />
            }
            {
                selectedAnimal && currentRoom && <Chatroom refresh={refresh} handleSelectCurrentRoom={handleSelectCurrentRoom} animal={selectedAnimal} currentRoom={currentRoom} />
            }
        </div>
    )
}

export default SelectAnimal