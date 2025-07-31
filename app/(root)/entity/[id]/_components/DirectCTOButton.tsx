'use client'
import { actions } from '@/actions/serverActions/actions'
import CoinTransactionAnimationWrapper from '@/components/animation-wrappers/CoinTransactionAnimationWrapper'
import RechargeDialog from '@/components/Recharge/RechargeDialog'
import Button from '@/components/ui/Button'
import { useContacts } from '@/hooks/useContacts'
import { useDialog } from '@/hooks/useDialog'
import { useSession } from '@/hooks/useSession'
import { useUser } from '@/socket-client/SocketWrapper'
import { BanknoteArrowDownIcon, PhoneIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    animal: any
}

const DirectCTOButton = (props: Props) => {
    const dialog = useDialog()
    const currentUser = useUser()
    const Contact = useContacts()
    const [isFetching, setIsFetching] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [costString, setCostString] = useState('')
    const fetchBalance = useSession((state: any) => state.fetchBalance)

    useEffect(() => {
        const contact = Contact.find(props.animal.userId)
        if (contact) {
            setUser(contact.user)
        } else {
            setUser(null)
        }
    }, [Contact.contacts])


    const handleClick = async () => {
        if (!isFetching && currentUser) {
            setIsFetching(true)
            const response = await actions.client.posts.GetCustomerContact(props.animal.id, currentUser.id)
            if (response.status === 200) {
                Contact.addToContact(response.data)
                setCostString(`-${response.data.cost} coins`)
                fetchBalance()
            } else if (response.status === 302) {
                dialog.showDialog(`Insufficient balance`, <LowBalanceDialog dialog={dialog} />)
            }
            else {
                dialog.showDialog(`Unable to get user information`, null, `Error: ${response.message}`)
            }
            setIsFetching(false)
        }
    }

    return (
        <>
            {!currentUser && <div title='Please login to continue' className={`w-full cursor-not-allowed ${isFetching ? 'opacity-50 pointer-events-none grayscale-100' : ''}`}>
                <div className='w-full'>{props.children}</div>
            </div>}
            {currentUser && !user && <div className={`w-full ${isFetching ? 'opacity-50 pointer-events-none grayscale-100' : ''}`}>
                <div onClick={handleClick} className='w-full'>{props.children}</div>
            </div>}
            {user && currentUser &&
                <CoinTransactionAnimationWrapper text={costString} type='warning' className='w-full'>
                    <Link href={`tel: ${user.phone}`} className='w-full flex gap-1 justify-center items-center border-2 text-lg cursor-pointer text-center border-dashed border-zinc-600 p-2 text-emerald-700 bg-zinc-50'>
                        <PhoneIcon className="text-emerald-700 animate-pulse duration-300" /> {user.phone}
                    </Link>
                </CoinTransactionAnimationWrapper>
            }
        </>
    )
}

export default DirectCTOButton

const LowBalanceDialog = (props: { dialog: any }) => {

    const handleClose = () => {
        props.dialog.closeDialog()
    }

    const handleRecharge = () => {
        props.dialog.showDialog('Quick Recharge', <RechargeDialog />)
    }

    return (
        <div className='p-2 px-6 flex flex-col items-center gap-2'>
            <div>
                <div className='text-lg font-semibold'>You're low on balance</div>
                <div className='flex font-normal gap-1 items-center -mt-1'>  Please recharge your account.</div>
            </div>
            <div className='flex gap-2 items-center'>
                <Button onClick={handleRecharge} className='w-full flex gap-2 items-center'><BanknoteArrowDownIcon /> Recharge</Button>
                <Button onClick={handleClose} className='w-full' variant='btn-secondary'>Close</Button>
            </div>
        </div>
    )
}