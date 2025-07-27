import { images } from '@/consts/images'
import Image from 'next/image'
import { useState } from 'react'
import Button from '../ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { useUser } from '@/socket-client/SocketWrapper'
import { actions } from '@/actions/serverActions/actions'
import { useSession } from '@/hooks/useSession'

type Props = {}

const RechargeDialog = (props: Props) => {
    const [isWorking, setIsWorking] = useState('')
    const dialog = useDialog()
    const user = useUser()
    const fetchBalance = useSession((state: any) => state.fetchBalance)

    const handleClose = () => {
        dialog.closeDialog()
    }

    const handleRecharge = async (amount: number) => {
        if (user) {
            setIsWorking(amount.toString())
            const response = await actions.client.user.account.recharge(user.id, amount)
            if (response.status === 200) {
                dialog.closeDialog()
                fetchBalance()
                dialog.showDialog('Recharge Successful', null, `Your account has been recharged with ${amount} coins.`)
            } else {
                dialog.showDialog('Recharge Failed', null, `Error: ${response.message}`)
            }
        }
        setIsWorking('')
    }

    return (
        <div className='p-4 pb-2 flex flex-col gap-2'>
            <div className='grid grid-cols-3 gap-2 w-full'>
                <section className='bg-amber-50 p-2 flex flex-col text-center items-center gap-2 rounded border border-amber-200'>
                    <div className='text-center flex flex-col items-center'>
                        <Image src={images.site.coins.gold.basic} alt='coin-logo' width={100} height={100} quality={50} className='w-10 h-10' layout='fixed' />
                        <div className='tracking-wide text-sm text-amber-700'>1000 Coins</div>
                    </div>
                    <Button onClick={() => handleRecharge(1000)} disabled={isWorking.length > 0} className='w-full text-nowrap mt-4'>{isWorking === '1000' ? `...` : `Rs 500`}</Button>
                </section>
                <section className='bg-amber-50 p-2 flex flex-col text-center items-center gap-2 rounded border border-amber-200'>
                    <div className='text-center flex flex-col items-center'>
                        <Image src={images.site.coins.gold.basic} alt='coin-logo' width={100} height={100} quality={50} className='w-10 h-10' layout='fixed' />
                        <div className='tracking-wide text-sm text-amber-700'>2500 Coins</div>
                    </div>
                    <Button onClick={() => handleRecharge(2500)} disabled={isWorking.length > 0} className='w-full text-nowrap mt-4'>{isWorking === '2500' ? `...` : `Rs 1000`}</Button>
                </section>
                <section className='bg-amber-50 p-2 flex flex-col text-center items-center gap-2 rounded border border-amber-200'>
                    <div className='text-center flex flex-col items-center'>
                        <Image src={images.site.coins.gold.basic} alt='coin-logo' width={100} height={100} quality={50} className='w-10 h-10' layout='fixed' />
                        <div className='tracking-wide text-sm text-amber-700'>4000 Coins</div>
                    </div>
                    <Button onClick={() => handleRecharge(4000)} disabled={isWorking.length > 0} className='w-full text-nowrap mt-4'>{isWorking === '4000' ? `...` : `Rs 2000`}</Button>
                </section>
            </div>
            <Button onClick={handleClose} className='w-full' variant='btn-secondary'>Close</Button>
        </div>
    )
}

export default RechargeDialog