import React, { useEffect, useState } from 'react'
import AnimalRow from './selectAnimal/AnimalRow'
import { useRooms } from '@/hooks/useRooms'
import RoomsContainer from './Rooms/RoomsContainer'
import Chatroom from './ChatRoom/Chatroom'
import { bidsReverse } from '../../Bidding/BiddingWrapper'
import { useUser } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import { images } from '@/consts/images'

type Props = {
    animal?: any
    disableAnimalChange?: boolean
}

const SelectAnimal = (props: Props) => {
    const [isCalculatingRooms, setIsCalculatingRooms] = useState(false)
    const [currentRoom, setCurrentRoom] = useState<any>(null)
    const [selectedAnimal, setSelectedAnimal] = useState(null)
    const [animals, setAnimals] = useState<any[]>([])
    const user = useUser()
    const isAuthor = user?.id === props.animal?.userId
    const Rooms = useRooms()

    const extractAnimals = (rooms: any[]) => {
        setIsCalculatingRooms(true)
        let thisRoom = null
        const animalMap = new Map();
        console.log(rooms)
        rooms.forEach((room: any) => {
            const existing = animalMap.get(room.animalId);
            if (existing) {
                existing.roomCount += 1;
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
                if (props.animal) {
                    if (props.animal.id === room.animalId) {
                        const animal = { ...room.animal, roomCount: 1, rooms: subRooms };
                        setSelectedAnimal(animal)
                        if (!isAuthor) {
                            setCurrentRoom(room)
                        }
                    }
                }
                animalMap.set(room.animalId, { ...room.animal, roomCount: 1, rooms: subRooms });
            }
        });
        const raw = Array.from(animalMap.values());
        setAnimals(raw)
        if (thisRoom) {
            setCurrentRoom(thisRoom)
        }
        setIsCalculatingRooms(false)
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
                // (animals.length === 0) && !isCalculatingRooms && !props.animal && <div>No Bargaining is started with any animal yet.</div>
            }
            {
                (animals.length === 0) && !isCalculatingRooms && props.animal && isAuthor && <div>
                    <Image src={images.site.ui.tiredFarmer} className='w-full' layout='fixed' quality={100} alt='tiredFarmer' width={100} height={100} />
                    <div className='tracking-tight p-1 bg-amber-50 rounded-md'>
                        No one has started bargaining with this {String(props.animal.type).slice(0, props.animal.type.length - 1)}...
                    </div>
                </div>
            }
            {
                (animals.length === 0) && !isCalculatingRooms && props.animal && !isAuthor && <div>
                    <Image src={images.site.ui.tiredFarmer} className='w-full' layout='fixed' quality={100} alt='tiredFarmer' width={100} height={100} />
                    <div className='tracking-tight p-1 bg-amber-50 rounded-md'>
                        Author has not started bargaining with this {String(props.animal.type).slice(0, props.animal.type.length - 1)}...
                    </div>
                </div>
            }
            {
                !selectedAnimal && !currentRoom && animals.map((animal: any, index: number) => {
                    return (
                        !selectedAnimal && <AnimalRow handleSelectAnimal={handleSelectAnimal} key={`${animal.id}-${index + 1}`} animal={animal} />
                    )
                })
            }
            {
                selectedAnimal && !currentRoom && <RoomsContainer disableAnimalChange={props.disableAnimalChange} handleSelectCurrentRoom={handleSelectCurrentRoom} handleSelectAnimal={handleSelectAnimal} animal={selectedAnimal} />
            }
            {
                selectedAnimal && currentRoom && <Chatroom refresh={refresh} handleSelectCurrentRoom={handleSelectCurrentRoom} animal={selectedAnimal} currentRoom={currentRoom} />
            }
        </div>
    )
}

export default SelectAnimal