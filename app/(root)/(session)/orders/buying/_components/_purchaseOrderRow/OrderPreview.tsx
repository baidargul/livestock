import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import MediaViewer from '@/components/controls/MediaViewer'
import Button from '@/components/ui/Button'
import { images } from '@/consts/images'
import { formalizeText, formatCurrency } from '@/lib/utils'
import { MoveRightIcon, SquareUserIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    order: any
    togglePreview: () => void
}

const OrderPreview = (props: Props) => {

    const totalQuantity = Number(props.order.maleQuantityAvailable || 0) + Number(props.order.femaleQuantityAvailable || 0)

    return (
        <div className={`fixed inset-0 z-50 px-3 flex justify-center items-center`}>
            <div className='bg-white p-2 px-4 pb-4 rounded-md shadow-lg flex flex-col gap-2 border border-zinc-200'>
                <div className='text-lg font-bold text-zinc-700'>Order Preview</div>
                <div>
                    <div className='text-xl font-bold'>{formalizeText(props.order.breed)} {props.order.type} x {totalQuantity}</div>
                    <div className='flex gap-1 items-center -mt-1'> {props.order.maleQuantityAvailable && props.order.maleQuantityAvailable > 0 && <div>{`${props.order.maleQuantityAvailable} Male,`}</div>} {props.order.femaleQuantityAvailable && props.order.femaleQuantityAvailable > 0 && <div>{`${props.order.femaleQuantityAvailable} Female.`}</div>}</div>
                    <div className='pl-4 border-l-4 border-zinc-200'>
                        <div className='text-lg'>{props.order.animal?.title}</div>
                        <div className='text-zinc-600 italic line-clamp-2 -mt-1'>'{props.order.animal?.description}'</div>
                    </div>
                    <div className='flex flex-wrap justify-start items-start gap-2'>
                        {props.order.animal.images.map((item: any, index: number) => {
                            return (
                                <MediaViewer key={`${item.name}-${index}`} image={item.image}>
                                    <Image src={item.image ? item.image : images.chickens.images[1]} alt='hen' width={100} height={100} quality={60} loading='lazy' layout='fixed' className='w-24 h-14 object-cover object-left-center rounded-xl cursor-pointer' />
                                </MediaViewer>
                            )
                        })}
                    </div>
                    <div className='flex flex-col justify-start gap-2 items-start w-full my-2'>{
                        props.order.deliveryOptions.map((option: any, index: number) => {
                            const Icon = String(option).toLocaleLowerCase() === "self_pickup" ? SquareUserIcon : TruckIcon
                            return (
                                // <div key={`${option}-${index}`} className='flex gap-1 items-center'><Icon size={20} className='text-emerald-700' /> {String(option).toLocaleLowerCase() === "self_pickup" ? "Self Pickup" : "Cargo delivery"}</div>
                                <DeliveryIcon icon={option} key={`${option}-${index}`} size={25} animal={props.order.animal} description />
                            )
                        })
                    }</div>
                    <div className='w-full flex flex-wrap items-center gap-2'>
                        <div className='text-emerald-700 text-2xl font-bold'>{formatCurrency(props.order.price)}</div>
                        {totalQuantity > 1 && <div className='text-sm'>{formatCurrency(props.order.price / totalQuantity)} each animal.</div>}
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='scale-[.8] pt-1 origin-top-left'>
                            <div>From:</div>
                            <div>{formalizeText(props.order.animal.city)} {formalizeText(props.order.animal.province)}</div>
                        </div>
                        <MoveRightIcon />
                        <div className='scale-[.8] pt-1 origin-top-left text-emerald-700 font-bold'>
                            <div>To:</div>
                            <div>{formalizeText(props.order.city)} {formalizeText(props.order.province)}</div>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center'>{new Date(props.order.createdAt).toDateString()} <ElapsedTimeControl className='p-1 bg-zinc-100 border border-zinc-200 rounded-md' date={props.order.createdAt} /></div>
                </div>
                <div className='w-full'>
                    <Button onClick={props.togglePreview} className='w-full' variant='btn-secondary'>Close</Button>
                </div>
            </div>
        </div>
    )
}

export default OrderPreview