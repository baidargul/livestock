import { PhoneCallIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    contact: any
    onClick?: () => void
}

const ContactRow = (props: Props) => {
    return (
        <div className='w-full p-1 pb-2 border-b border-zinc-300'>
            <div className='flex justify-between items-center'>
                <div onClick={props.onClick} className='cursor-pointer text-lg font-semibold'>{props.contact.user.name}</div>
                <div onClick={props.onClick} className='cursor-pointer italic text-sm'>{props.contact.remarks}</div>
            </div>
            <div onClick={props.onClick} className='cursor-pointer text-xs'>{new Date(props.contact.createdAt).toDateString()} - {new Date(props.contact.createdAt).toLocaleTimeString()}</div>
            <div className='w-full flex justify-end items-center text-end'>
                <Link href={`tel:${props.contact.user.phone}`} className='p-2 rounded bg-emerald-200'>
                    <div className='flex gap-1 items-center'> <PhoneCallIcon size={14} className='' /> {props.contact.user.phone}</div>
                </Link>
            </div>
        </div>
    )
}

export default ContactRow