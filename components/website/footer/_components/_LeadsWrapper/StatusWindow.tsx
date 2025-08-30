'use client'
import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
    lead: any
    fetchLeads?: () => void
}

const StatusWindow = (props: Props) => {
    const [newStatus, setNewStatus] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const dialog = useDialog()

    useEffect(() => {
        setNewStatus('')
    }, [isOpen])

    const handleOpen = (val: boolean) => {
        setIsOpen(val)
    }

    const handleChangeStatus = async (val: string, force?: boolean) => {
        if (val === "dispatched" && !force) {
            dialog.showDialog("Dispatch Confirmation", <FinalClosingConfirmationDialog lead={props.lead} onYes={() => handleChangeStatus(val, true)} />)
            return
        }
        setNewStatus(val)
        const response = await actions.client.leads.changeStatus(props.lead, val)
        if (response.status === 200) {
            props.fetchLeads && props.fetchLeads()
        }
        setNewStatus('')

    }

    return (
        <>
            <div className={`${isOpen ? "scale-[1] opacity-100 pointer-events-auto" : "scale-[.2] opacity-0 pointer-events-none"} transition ease-in-out duration-300 inset-0 fixed top-0 left-0 z-[3] flex justify-center items-center`}>
                <section className='p-4 bg-white shadow-sm rounded-md'>
                    <div className='font-bold flex gap-1 items-center'>{formalizeText(props.lead.user.name)}</div>
                    {String(props.lead.city).length > 0 && String(props.lead.province).length > 0 && <div className='text-zinc-600 text-xs'>Delivery location: <span className='font-bold'>{formalizeText(props.lead.city)}, {formalizeText(props.lead.province)}</span></div>}
                    {String(props.lead.city).length === 0 && String(props.lead.province).length === 0 && <div className='text-zinc-600 text-xs'>{formalizeText(props.lead.user.city)}, {formalizeText(props.lead.user.province)}</div>}
                    <table className='w-full text-xs my-2'>
                        <thead>
                            <tr>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Male</td>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Female</td>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l border-r'>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-1 border-zinc-200 border-b border-l">{props.lead.maleQuantityAvailable ?? 0} pc</td>
                                <td className="p-1 border-zinc-200 border-b border-l">{props.lead.femaleQuantityAvailable ?? 0} pc</td>
                                <td className="p-1 border-zinc-200 border-b border-l border-r">{formatCurrency(calculatePricing({ ...props.lead.animal, ...props.lead, price: props.lead.amount }).price)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='text-xs'>{Number(props.lead.maleQuantityAvailable ?? 0) + Number(props.lead.femaleQuantityAvailable ?? 0)} {props.lead.animal.breed} {props.lead.animal.type}</div>
                    <div className='flex flex-col items-end justify-end'>
                        <ElapsedTimeControl date={props.lead.createdAt} />
                    </div>
                    <div className={`my-2 ${props.lead.status === "dispatched" ? "pointer-events-none opacity-50 grayscale-100" : "pointer-events-auto"}`}>
                        <div className='font-bold mb-2'>Current order status:</div>
                        <div className='grid grid-cols-3 gap-2'>
                            <Button disabled={newStatus.length > 0} onClick={() => handleChangeStatus('pending')} variant={props.lead.status === 'pending' ? "btn-primary" : "btn-secondary"}>Pending</Button>
                            <Button disabled={newStatus.length > 0} onClick={() => handleChangeStatus('dispatched')} variant={props.lead.status === 'dispatched' ? "btn-primary" : "btn-secondary"}>Dispatched</Button>
                            <Button disabled={newStatus.length > 0} onClick={() => handleChangeStatus('cancelled')} variant={props.lead.status === 'cancelled' ? "btn-primary" : "btn-secondary"}>Cancelled</Button>
                        </div>
                    </div>
                    <Button onClick={() => handleOpen(false)} className='w-full mt-4'>Close</Button>
                </section>
            </div>
            <div onClick={() => handleOpen(true)}>
                {props.children}
            </div>
            {isOpen && <div onClick={() => handleOpen(false)} className='inset-0 fixed backdrop-blur-[1px] top-0 left-0 z-[2]'></div>}
            {isOpen && <div onClick={() => handleOpen(false)} className='fixed top-0 left-0 bg-black/40 inset-0 z-[1]'></div>}
        </>
    )
}

export default StatusWindow


const FinalClosingConfirmationDialog = (props: { lead: any, onYes: () => void }) => {
    const dialog = useDialog()
    const [order, setOrder] = useState({
        maleQuantityAvailable: 0,
        femaleQuantityAvailable: 0,
        amount: 0
    })

    useEffect(() => {
        setOrder({
            maleQuantityAvailable: props.lead.maleQuantityAvailable ?? 0,
            femaleQuantityAvailable: props.lead.femaleQuantityAvailable ?? 0,
            amount: calculatePricing({ ...props.lead.animal, ...props.lead, price: props.lead.amount }).price
        })
    }, [])

    const handleMaleQuantityChange = (val: string) => {
        setOrder((prev: any) => ({ ...prev, maleQuantityAvailable: String(val).length > 0 ? Number(val) : null }))
    }

    const handleFemaleQuantityChange = (val: string) => {
        setOrder((prev: any) => ({ ...prev, femaleQuantityAvailable: String(val).length > 0 ? Number(val) : null }))
    }

    const handleTotalAmountChange = (val: string) => {
        setOrder((prev: any) => ({ ...prev, amount: String(val).length > 0 ? Number(val) : null }))
    }
    const totalQuantity = Number(order.maleQuantityAvailable) + Number(order.femaleQuantityAvailable)

    const handleConfirm = async () => {
        if (totalQuantity < 1) return
        const amount = Number(order.amount) / totalQuantity
        const postOrder = {
            type: props.lead.animal.type,
            breed: props.lead.animal.breed,
            averageAge: props.lead.animal.averageAge,
            ageUnit: props.lead.animal.ageUnit,
            averageWeight: props.lead.animal.averageWeight,
            weightUnit: props.lead.animal.weightUnit,
            colorMarkings: props.lead.animal.colorMarkings,
            priceUnit: `per Set`,
            maleQuantityAvailable: Number(order.maleQuantityAvailable),
            femaleQuantityAvailable: Number(order.femaleQuantityAvailable),
            price: Number(amount),
            deliveryOptions: props.lead.deliveryOptions,
            province: String(props.lead.province).length > 0 ? String(props.lead.province) : props.lead.user.province,
            city: String(props.lead.city).length > 0 ? String(props.lead.city) : props.lead.user.city,
            animalId: props.lead.animal.id,
            authorId: props.lead.animal.userId,
            userId: props.lead.userId,
        };

        const [response, lead] = await Promise.all([
            actions.client.leads.changeStatus({ ...props.lead, price: Number(postOrder.price) }, "dispatched"),
            actions.client.orders.create(postOrder)
        ])

        if (response.status === 200) {
            props.onYes()
            dialog.closeDialog()
        } else {
            dialog.showDialog(`Error`, null, response.message)
        }
    }

    return (
        <div className='px-4 flex flex-col gap-2'>
            <div>You're marking this order as complete by putting it in the dispatched state.</div>
            <div className='font-normal'>Please fill the dispatched quantities and total amount of the order.</div>
            <div>
                <Textbox disabled={Number(props.lead.maleQuantityAvailable) < 1} onChange={handleMaleQuantityChange} value={order.maleQuantityAvailable} type='number' label='Male Quantity' />
                <Textbox disabled={Number(props.lead.femaleQuantityAvailable) < 1} onChange={handleFemaleQuantityChange} value={order.femaleQuantityAvailable} type='number' label='Female Quantity' />
                <Textbox onChange={handleTotalAmountChange} value={order.amount} type='number' label='Total Amount' />
            </div>
            <div className='flex justify-end gap-2 items-center'>
                <Button disabled={totalQuantity < 1 || order.amount < 1} onClick={handleConfirm} className='w-full'>Confirm</Button>
                <Button onClick={() => dialog.closeDialog()} className='w-full' variant='btn-secondary'>Cancel</Button>
            </div>
        </div>
    )
}