import React from 'react'
import Rooms from './Rooms'

type Props = {
    isToggled: boolean
    handleToggleMenu: (val: boolean) => void
    rooms: any
    user: any
}

const RoomListContainer = (props: Props) => {
    return (
        <>
            <div onClick={() => props.handleToggleMenu(false)} className={`bg-black/50 backdrop-blur-[1px] inset-0 fixed ${props.isToggled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>
            <div className={`p-2 w-[90%] select-none transition-all duration-200 z-50 ease-out h-full fixed right-0 ${props.isToggled ? "translate-x-0" : " translate-x-full"} top-0 bg-white`}>
                <Rooms rooms={props.rooms} user={props.user} />
            </div>
        </>
    )
}

export default RoomListContainer