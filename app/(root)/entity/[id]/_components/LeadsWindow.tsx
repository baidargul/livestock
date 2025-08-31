'use client'
import { actions } from '@/actions/serverActions/actions'
import LeadsWrapper from '@/components/website/footer/_components/LeadsWrapper'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { RefreshCcwIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
}

const LeadsWindow = (props: Props) => {
    const [leads, setLeads] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const user = useUser()

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        if (!props.animal || !user) return
        if (user.id === props?.animal?.userId) {
            setIsFetching(true)
            const response = await actions.client.leads.forAnimal(props.animal.id)
            if (response.status === 200) {
                setLeads(response.data)
            } else {
                setLeads([])
            }
            setIsFetching(false)
        }
    }

    return (
        user && user.id === props.animal.userId && leads.length > 0 && <div className='px-4 cursor-pointer'>
            <LeadsWrapper defaultAnimalId={props.animal.id}>
                <div className='text-xs flex gap-1 items-center'> {isFetching && <RefreshCcwIcon className='text-zinc-700 animate-spin' size={16} />} Requests: {leads.length}</div>
                <div className='relative'>
                    {leads.length > 3 && <div className='absolute -bottom-4 left-1/2 translate-x-[-50%] cursor-pointer text-black z-[2] w-full text-xs text-center'>Click here to see more...</div>}
                    {leads.length > 3 && <div className='absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-white to-transparent z-[1]'></div>}
                    <table className='w-full text-xs my-2'>
                        <thead>
                            <tr>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Status</td>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Deliver to</td>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Male</td>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Female</td>
                                <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l border-r'>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leads && leads?.map((lead: any, index: number) => {
                                    return (
                                        <tr key={`${lead}-${index + 1}`} className={`${String(lead.status).toLocaleLowerCase() === "cancelled" ? "line-trough opacity-50 " : lead.status === "dispatched" ? "text-emerald-700" : "text-yellow-700 bg-yellow-50"}`}>
                                            <td className={`p-1 border-zinc-200 border-b border-l `}>{formalizeText(lead.status ?? "")}</td>
                                            <td className="p-1 border-zinc-200 border-b border-l">{lead.deliveryOptions.includes("SELF_PICKUP") ? "Self Pickup" : String(lead.city ?? '').length > 0 ? `${lead.city}, ${lead.province}` : `${lead.user.city}, ${lead.user.province}`}</td>
                                            <td className="p-1 border-zinc-200 border-b border-l">{lead.maleQuantityAvailable ?? 0} pc</td>
                                            <td className="p-1 border-zinc-200 border-b border-l">{lead.femaleQuantityAvailable ?? 0} pc</td>
                                            <td className="p-1 border-zinc-200 border-b border-l border-r">{formatCurrency(calculatePricing({ ...lead.animal, ...lead, price: lead.amount }).price)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </LeadsWrapper>
        </div>
    )
}

export default LeadsWindow