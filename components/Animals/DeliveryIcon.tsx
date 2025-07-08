import React from 'react'
import { PiHandshakeDuotone } from "react-icons/pi";
import { PiFireTruckDuotone } from "react-icons/pi";
type Props = {
    icon: "SELF_PICKUP" | "SELLER_DELIVERY"
    size?: number
}

const DeliveryIcon = (props: Props) => {

    if (props.icon === "SELF_PICKUP") {

        return (
            <PiHandshakeDuotone size={props.size ?? 20} title='Self Pickup' />
        )
    } else if (props.icon === "SELLER_DELIVERY") {

        return (
            <PiFireTruckDuotone size={props.size ?? 20} title='Seller Delivery' />
        )
    }

    return (
        null
    )
}

export default DeliveryIcon