'use client'
import { useContacts } from '@/hooks/useContacts'
import { calculatePricing, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { Animal } from '@prisma/client'
import { PhoneIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: Animal | any
}

const CTOButton = (props: Props) => {
    const user = useUser()
    const [contact, setContact] = useState<any>(null)
    const contacts = useContacts((state: any) => state.contacts)
    const find = useContacts((state: any) => state.find)

    useEffect(() => {
        setContact(find(props.animal?.userId, props.animal?.id))
    }, [contacts])

    if (contact && user) {
        return (
            <div className='flex gap-1 justify-center items-center p-1 w-full bg-emerald-700 rounded scale-90 origin-center text-white'>
                <PhoneIcon size={20} />
                <div>{formatCurrency(calculatePricing(props.animal).price)}</div>
            </div>
        )
    } else {
        return (
            <div className='text-2xl sm:text-xl md:text-lg text-nowrap text-left text-emerald-600 tracking-wide font-bold'>
                {formatCurrency(calculatePricing(props.animal).price)}
            </div>
        )
    }

}

export default CTOButton