import React, { useEffect, useState } from 'react'
import AnimalRow from './selectAnimal/AnimalRow'
import { useRooms } from '@/hooks/useRooms'
import RoomsContainer from './Rooms/RoomsContainer'

type Props = {
    animal?: any
}

const SelectAnimal = (props: Props) => {
    const [selectedAnimal, setSelectedAnimal] = useState(null)
    const [animals, setAnimals] = useState<any[]>([])
    const Rooms = useRooms()


    useEffect(() => {
        const rooms = [...Rooms.rooms.myRooms, ...Rooms.rooms.otherRooms];

        // Map fresh every time
        const animalMap = new Map();

        rooms.forEach((room: any) => {
            const existing = animalMap.get(room.animalId);

            if (existing) {
                existing.rooms += 1;
            } else {
                const subRooms = rooms.filter((r: any) => r.animalId === room.animalId);
                animalMap.set(room.animalId, { ...room.animal, roomCount: 1, rooms: subRooms });
            }
        });

        setAnimals(Array.from(animalMap.values()));
    }, [Rooms.rooms.myRooms, Rooms.rooms.otherRooms]);

    const handleSelectAnimal = (animal: any) => {
        setSelectedAnimal(animal)
    }




    return (
        <div className='flex flex-col gap-2 bg-zinc-200 p-2'>
            {
                (animals.length === 0) && <div>No Bargaining is started with any animal yet.</div>
            }
            {
                !selectedAnimal && animals.map((animal: any, index: number) => {
                    return (
                        !selectedAnimal && <AnimalRow handleSelectAnimal={handleSelectAnimal} key={`${animal.id}-${index + 1}`} animal={animal} />
                    )
                })
            }
            {
                selectedAnimal && <RoomsContainer animal={selectedAnimal} />
            }
        </div>
    )
}

export default SelectAnimal