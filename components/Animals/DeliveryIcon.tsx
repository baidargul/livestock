'use client'
import { useUser } from '@/socket-client/SocketWrapper';
import React, { useEffect, useState } from 'react'
import { PiHandshakeDuotone } from "react-icons/pi";
import { PiFireTruckDuotone } from "react-icons/pi";
type Props = {
    icon: "SELF_PICKUP" | "SELLER_DELIVERY"
    size?: number
    animal?: any
    description?: boolean
    className?: string
}

const DeliveryIcon = (props: Props) => {
    const [description, setDescription] = useState<"Buyer" | "Seller">("Buyer")
    const user = useUser()

    useEffect(() => {
        if (props.description) {
            if (props.animal) {
                if (user) {
                    if (props.animal.userId === user.id) {
                        setDescription("Seller")
                    } else {
                        setDescription("Buyer")
                    }
                }
            }
        }
    }, [props.description])

    if (props.icon === "SELF_PICKUP") {

        return (
            <div className={props.description ? "grid grid-cols-[1fr_auto] gap-4 w-full" : ""}>
                <PiHandshakeDuotone size={props.size ?? 20} title='Self Pickup' />
                {props.description && <div>
                    {description === "Buyer" && <div><span className='font-bold'>Self Pickup</span> - Pick it up yourself from the animal's location.</div>}
                    {description === "Seller" && <div>Buyer can visit and pick it up.</div>}
                </div>}
            </div>
        )
    } else if (props.icon === "SELLER_DELIVERY") {

        return (
            <div className={props.description ? "grid grid-cols-[1fr_auto] gap-4 w-full" : ""}>
                <PiFireTruckDuotone size={props.size ?? 20} title='Seller Delivery' className={props.className} />
                {props.description && <div>
                    {description === "Buyer" && <div><span className='font-bold'>Cargo</span> - For delivering animals to other districts/tehsils through the bus stand/station of that district.</div>}
                    {description === "Seller" && <div>You will deliver it inside the city or cargo.</div>}
                </div>}
            </div>
        )
    }

    return (
        null
    )
}

export default DeliveryIcon