import { formalizeText } from '@/lib/utils'
import { ChevronLeftIcon, Clipboard, CopyIcon, PhoneIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    contact: any
}

const TheContact = (props: Props) => {
    const contact = props.contact
    return (
        <div className='w-full h-full flex flex-col gap-2'>
            <div className='flex gap-1 items-center font-semibold text-lg'> <ChevronLeftIcon size={24} className='w-8 h-8' /> {contact?.user?.name}</div>
            <div className='px-4'>
                <div className='text-xs -mt-2 flex justify-end items-center'>
                    <div>{formalizeText(contact?.user?.city)}, {formalizeText(contact?.user?.province)}</div>
                </div>
                <div className='w-full flex justify-between items-center'>
                    <Link href={`tel:${contact?.user?.phone}`}>
                        <div className='flex gap-4 items-center active:scale-90 transition duration-300 ease-in-out group'>
                            <PhoneIcon className='group-active:text-emerald-700' />
                            <div>
                                <div className='tracking-wide font-semibold'>{contact?.user?.phone}</div>
                                <p className='tracking-tight text-sm -mt-1 '>Phone</p>
                            </div>
                        </div>
                    </Link>
                    <div className='flex flex-col items-center scale-75 active:scale-[.8] transition duration-300 ease-in-out origin-top-left my-auto mt-3 cursor-pointer group'>
                        <CopyIcon className='w-5 h-5 group-active:text-emerald-700' />
                        <p className='text-xs group-active:text-emerald-700'>Copy</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TheContact