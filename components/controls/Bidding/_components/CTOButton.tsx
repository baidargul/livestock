'use client'
import { actions } from '@/actions/serverActions/actions'
import RechargeDialog from '@/components/Recharge/RechargeDialog'
import Button from '@/components/ui/Button'
import Room from '@/components/website/footer/_components/_roomsWrapper/Room'
import { images } from '@/consts/images'
import { useDialog } from '@/hooks/useDialog'
import { useSession } from '@/hooks/useSession'
import { BanknoteArrowDownIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    activeBidRoomId: string
    user: any
    room: any
}

const CTOButton = (props: Props) => {
    const [isFetching, setIsFetching] = useState(false)
    const dialog = useDialog()
    const [user, setUser] = useState<any>(null)
    const fetchBalance = useSession((state: any) => state.fetchBalance)

    useEffect(() => {
        if (props.room.contact) {
            setUser(props.room.contact.user)
        }
    }, [props.room])

    const handleClick = async () => {
        if (!isFetching) {
            setIsFetching(true)
            const response = await actions.client.bidRoom.GetCustomerContact(props.activeBidRoomId, props.user.id)
            if (response.status === 200) {
                setUser(response.data)
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
            {!user && <div className={`w-full ${isFetching ? 'opacity-50 pointer-events-none grayscale-100' : ''}`}>
                <Button onClick={handleClick} className='w-full flex gap-1 justify-evenly line-clamp-1 items-center' variant='btn-secondary' ><div className=''><Image src={images.site.coins.gold.basic} width={20} height={20} layout='fixed' className='w-6 h-6' alt='coin' /> <div className='font-semibold tracking-wide'>300</div></div> <div className='font-semibold tracking-wide line-clamp-1'>{`Call ${props.room?.user?.name}`}</div> </Button>
            </div>}
            {user && <Link href={`tel: ${user.phone}`} className='w-full border-2 text-lg cursor-pointer text-center border-dashed border-emerald-600 p-4 text-emerald-700 bg-emerald-50 rounded-lg'>
                {user.phone}
            </Link>}
        </>
    )

}

export default CTOButton


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