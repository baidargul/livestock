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
            <div className='flex gap-4 items-center'>
                <PiHandshakeDuotone size={props.size ?? 20} title='Self Pickup' />
                {props.description && <div>
                    {description === "Buyer" && <div>You're welcome to visit and pick it up yourself.</div>}
                    {description === "Seller" && <div>Buyer can visit and pick it up.</div>}
                </div>}
            </div>
        )
    } else if (props.icon === "SELLER_DELIVERY") {

        return (
            <div className='flex gap-4 items-center'>
                <PiFireTruckDuotone size={props.size ?? 20} title='Seller Delivery' />
                {props.description && <div>
                    {description === "Buyer" && <div>Seller can deliver it inside the city or cargo to you.</div>}
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