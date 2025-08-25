'use client'
import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import Button from '@/components/ui/Button'
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

    useEffect(() => {
        setNewStatus('')
    }, [isOpen])

    const handleOpen = (val: boolean) => {
        setIsOpen(val)
    }

    const handleChangeStatus = async (val: string) => {
        setNewStatus(val)
        const response = await actions.client.leads.changeStatus(props.lead.id, val)
        if (response.status === 200) {
            props.fetchLeads && props.fetchLeads()
        }
        setNewStatus('')

    }

    return (
        <>
            <div className={`${isOpen ? "scale-[1] opacity-100 pointer-events-auto" : "scale-[.2] opacity-0 pointer-events-none"} transition ease-in-out duration-300 inset-0 fixed top-0 left-0 z-[3] flex justify-center items-center`}>
                <section className='p-2 bg-white shadow-sm rounded-md'>
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
                                <td className="p-1 border-zinc-200 border-b border-l border-r">{formatCurrency(calculatePricing({ ...props.lead.animal, ...props.lead }).price)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='text-xs'>{Number(props.lead.maleQuantityAvailable ?? 0) + Number(props.lead.femaleQuantityAvailable ?? 0)} {props.lead.animal.breed} {props.lead.animal.type}</div>
                    <div className='flex flex-col items-end justify-end'>
                        <ElapsedTimeControl date={props.lead.createdAt} />
                    </div>
                    <div className='my-2'>
                        <div className='font-bold mb-2'>Order Status</div>
                        <div className='grid grid-cols-3 gap-2'>
                            <Button disabled={newStatus.length > 0} onClick={() => handleChangeStatus('pending')} variant={props.lead.status === 'pending' ? "btn-primary" : "btn-secondary"}>Pending</Button>
                            <Button disabled={newStatus.length > 0} onClick={() => handleChangeStatus('dispatched')} variant={props.lead.status === 'dispatched' ? "btn-primary" : "btn-secondary"}>Dispatched</Button>
                            <Button disabled={newStatus.length > 0} onClick={() => handleChangeStatus('cancelled')} variant={props.lead.status === 'cancelled' ? "btn-primary" : "btn-secondary"}>Cancelled</Button>
                        </div>
                    </div>
                    <Button onClick={() => handleOpen(false)} className='w-full'>Close</Button>
                </section>
            </div>
            <div onClick={() => handleOpen(true)}>
                {props.children}
            </div>
            {isOpen && <div onClick={() => handleOpen(false)} className='inset-0 fixed top-0 left-0 z-[2]'></div>}
            {isOpen && <div className='fixed top-0 left-0 bg-black/40 blur-[1px] inset-0 z-[1]'></div>}
        </>
    )
}

export default StatusWindow