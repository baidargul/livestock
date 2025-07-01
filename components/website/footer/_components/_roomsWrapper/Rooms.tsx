import React from 'react'
import Room from './Room'

type Props = {
    rooms: any
    user: any
}

const Rooms = (props: Props) => {


    return (
        <div className='flex flex-col gap-2 text-black'>
            <section className='p-2 rounded-t-md flex flex-col gap-1 w-full bg-gradient-to-b from-zinc-100 to-transparent border-b border-zinc-300'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>My Listings</div>
                {props.rooms && props.rooms.myRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-[200px] overflow-y-auto pr-2'>
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
            <section className='p-2 rounded-t-md flex flex-col gap-1 w-full bg-gradient-to-b from-zinc-100 to-transparent border-b border-zinc-300'>
                <div className='text-zinc-700 font-semibold text-lg tracking-tight'>Other deals</div>
                {props.rooms && props.rooms.otherRooms.length > 0 &&
                    <div className='flex flex-col gap-4 h-[200px] overflow-y-auto pr-2'>
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