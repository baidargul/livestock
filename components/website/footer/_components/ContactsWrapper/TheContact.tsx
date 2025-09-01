'use client'
import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import Button from '@/components/ui/Button'
import { useContacts } from '@/hooks/useContacts'
import { useDialog } from '@/hooks/useDialog'
import { formalizeText } from '@/lib/utils'
import { ChevronLeftIcon, Clipboard, CopyIcon, PhoneIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    contact: any
    goBack: () => void
    fetchContacts: () => void
}

const TheContact = (props: Props) => {
    const contact = props.contact
    const dialog = useDialog()

    const handleDeleteButton = () => {
        dialog.showDialog('Delete Contact', <DeleteConfirmationBox closeDialog={() => dialog.closeDialog()} contact={props.contact} goBack={props.goBack} fetchContacts={props.fetchContacts} />)
    }

    const handleCopyPhone = () => {
        navigator.clipboard.writeText(contact?.user?.phone)
    }

    return (
        <div className='w-full h-full flex flex-col gap-2'>
            <div className='flex gap-1 items-center font-semibold text-lg'> <ChevronLeftIcon onClick={props.goBack} size={24} className='w-8 h-8 cursor-pointer' /> {contact?.user?.name}</div>
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
            <Button onClick={handleDeleteButton} className='w-full' variant='btn-secondary'>Delete Contact</Button>
            <div className='bg-white p-1'>
                <div className='font-bold'>Last transactions</div>
                <div className='flex flex-col gap-2 mt-2'>
                    {
                        contact.boughtPosts.length > 0 && contact.boughtPosts.map((post: any, index: number) => {

                            const totalQuantity = Number(post.animal.maleQuantityAvailable || 0) + Number(post.animal.femaleQuantityAvailable || 0)

                            return (
                                <Link href={`/entity/${post.animal.id}`} key={`${post.id}-${index}`} className='bg-white p-1 border-b border-zinc-300 hover:bg-emerald-50'>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-black text-lg'>{post.animal.title}</div>
                                        <ElapsedTimeControl date={post.createdAt} />
                                    </div>
                                    <div className='text-zinc-700'>{post.animal.description}</div>
                                    <div className='flex gap-1 items-center tracking-tight'>
                                        <div>{formalizeText(post.animal.breed)}</div>
                                        <div>{post.animal.type}</div>
                                        <div>x {totalQuantity}.</div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default TheContact

const DeleteConfirmationBox = (props: { closeDialog: () => void, contact: any, goBack: () => void, fetchContacts: () => void }) => {
    const [isWorking, setIsWorking] = useState(false)
    const contacts = useContacts()

    const handleDeleteContact = async () => {
        setIsWorking(true)
        const response = await actions.client.user.contacts.deleteContact(props.contact.id)
        if (response.status === 200) {
            props.closeDialog()
            props.goBack()
            contacts.removeContact(props.contact.userId)
            props.fetchContacts()
        }
        setIsWorking(false)
    }

    return (
        <div className='flex flex-col gap-2 px-2 -mb-2'>
            <div className='text-lg'>Are you sure to delete this contact?</div>
            <div className='flex justify-evenly gap-2 items-center w-full'>
                <Button disabled={isWorking} onClick={handleDeleteContact} className='w-full'>Yes</Button>
                <Button disabled={isWorking} variant='btn-secondary' className='w-full' onClick={props.closeDialog}>No</Button>
            </div>
        </div>
    )
}