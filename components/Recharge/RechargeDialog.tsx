import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import Button from '../ui/Button'
import { useDialog } from '@/hooks/useDialog'

type Props = {}

const RechargeDialog = (props: Props) => {
    const dialog = useDialog()

    const handleClose = () => {
        dialog.closeDialog()
    }

    return (
        <div className='p-4 pb-2 flex flex-col gap-2'>
            <div className='grid grid-cols-3 gap-2 w-full'>
                <section className='bg-amber-50 p-2 flex flex-col text-center items-center gap-2 rounded border border-amber-200'>
                    <div className='text-center flex flex-col items-center'>
                        <Image src={images.site.coins.gold.basic} alt='coin-logo' width={100} height={100} quality={50} className='w-10 h-10' layout='fixed' />
                        <div className='tracking-wide text-sm text-amber-700'>1000 Coins</div>
                    </div>
                    <Button className='w-full text-nowrap mt-4'>Rs 500</Button>
                </section>
                <section className='bg-amber-50 p-2 flex flex-col text-center items-center gap-2 rounded border border-amber-200'>
                    <div className='text-center flex flex-col items-center'>
                        <Image src={images.site.coins.gold.basic} alt='coin-logo' width={100} height={100} quality={50} className='w-10 h-10' layout='fixed' />
                        <div className='tracking-wide text-sm text-amber-700'>2500 Coins</div>
                    </div>
                    <Button className='w-full text-nowrap mt-4'>Rs 1000</Button>
                </section>
                <section className='bg-amber-50 p-2 flex flex-col text-center items-center gap-2 rounded border border-amber-200'>
                    <div className='text-center flex flex-col items-center'>
                        <Image src={images.site.coins.gold.basic} alt='coin-logo' width={100} height={100} quality={50} className='w-10 h-10' layout='fixed' />
                        <div className='tracking-wide text-sm text-amber-700'>4000 Coins</div>
                    </div>
                    <Button className='w-full text-nowrap mt-4'>Rs 2000</Button>
                </section>
            </div>
            <Button onClick={handleClose} className='w-full' variant='btn-secondary'>Close</Button>
        </div>
    )
}

export default RechargeDialog