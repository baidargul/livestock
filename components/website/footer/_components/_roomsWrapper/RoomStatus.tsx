import { ChartCandlestickIcon, HandshakeIcon } from 'lucide-react'
import React from 'react'

type Props = {
    room: any
}

const RoomStatus = (props: Props) => {
    return props.room.userOfferAccepted ? <HandshakeIcon size={16} className="text-emerald-700 animate-pulse" /> : <ChartCandlestickIcon className="text-amber-700" size={16} />

}

export default RoomStatus