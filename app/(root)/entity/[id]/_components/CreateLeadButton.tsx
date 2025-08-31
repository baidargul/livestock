'use client'
import { actions } from '@/actions/serverActions/actions'
import RechargeDialog from '@/components/Recharge/RechargeDialog'
import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { useProtocols } from '@/hooks/useProtocols'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'
import PostBiddingOptions from './PostBiddingOptions'
import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
    animal: any
}

const CreateLeadButton = (props: Props) => {
    const [isChecking, setIsChecking] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [fixedAmount, setFixedAmount] = useState(0)
    const router = useRouter()
    const protocols = useProtocols()
    const [fetchingHandshake, setFetchingHandshake] = useState(false)
    const session: any = useSession()
    const [HandShakeCost, setHandshakeCost] = useState({
        buyer: 0,
        seller: 0
    })
    const [postBiddingOptions, setPostBiddingOptions] = useState<{
        deliveryOptions: string[],
        maleQuantityAvailable: number,
        femaleQuantityAvailable: number,
        amount: number,
        posted: boolean
        city: string,
        province: string
    }>({
        deliveryOptions: [],
        maleQuantityAvailable: 0,
        femaleQuantityAvailable: 0,
        amount: 0,
        posted: false
        , city: '',
        province: ''
    })
    const [leads, setLeads] = useState<any>([])
    const { animal } = props
    const dialog = useDialog()
    const user = useUser()

    useEffect(() => {
        if (protocols.protocols) {
            fetchHandshakes()
        }
    }, [protocols, user])

    const fetchHandshakes = async () => {
        setFetchingHandshake(true)
        const buyer = protocols.get("BuyerDirectHandShakeCost")
        const seller = protocols.get("SellerHandShakeCost")
        const temp = { ...HandShakeCost, buyer: Number(buyer ?? 0), seller: Number(seller ?? 0) }
        setHandshakeCost(temp)
        if (user) {
            hasLead()
        }
        setFetchingHandshake(false)
    }

    const hasLead = async () => {
        if (!user) return;
        setIsChecking(true)
        const response: any = await actions.client.leads.hasLead(animal.id, user.id)
        if (response) {
            if (response.status === 200) {
                setLeads(response.data ?? [])
                for (const lead of response.data) {
                    if (lead.fixed) {
                        if (lead.userId === user.id) {
                            let amount = Number(lead.amount)
                            setFixedAmount(amount)
                            break
                        }
                    } else {
                        setFixedAmount(0)
                    }
                }
            } else {
                setLeads([])
            }
        }
        setIsChecking(false)
    }

    useEffect(() => {
        console.log(fixedAmount)
    }, [fixedAmount])

    const continueLead = async () => {
        dialog.closeDialog()
        setIsCreating(true)
        const response: any = await actions.client.leads.create(animal.id, user.id, postBiddingOptions)
        if (response) {
            if (response.status === 200) {
                const data = response.data
                dialog.closeDialog()
                if (session) {
                    session.fetchBalance()
                }
                setLeads((prev: any) => [...prev, data])
                if (data.user.balance < 1) {
                    dialog.showDialog('Low Balance', null, "Your lead has been created and the author has been notified. However, your balance is low. Please recharge your account so that author can see your contact details when they check their leads and select you.")
                }
                dialog.showDialog("Lead created", null, "Your lead has been created and the author has been notified. Please wait for the seller to accept your lead.")
                router.refresh()
            } else if (response.status === 305) {
                dialog.showDialog('Insufficient balance', <RechargeDialog />)
            }
            else {
                dialog.showDialog('Error', null, response.message)
            }
        }
        setIsCreating(false)
    }

    const handleCreateLead = async () => {
        if (!user) return;
        if (Number(HandShakeCost.buyer) > 0) {
            dialog.showDialog('Creating Lead', <CreateLeadConfirmationDialog onYes={continueLead} text={`You are about to create a lead for this animal. This will cost you ${formatCurrency(HandShakeCost.buyer)}. Do you want to continue?`} />)
        } else {
            console.log(Number(HandShakeCost.buyer))
            continueLead()
        }
    }

    const handleRemoveLead = async (leadId: string) => {
        if (!user || leads.length === 0) return;
        if (!leadId || leadId.length === 0) return
        setIsCreating(true)
        const response: any = await actions.client.leads.remove(leadId)
        if (response) {
            if (response.status === 200) {
                dialog.showDialog('Success', null, "You have removed your lead. The author will no longer see your contact details.")
                hasLead()
            } else {
                dialog.showDialog('Error', null, response.message)
            }
        }
        setIsCreating(false)
    }

    const handleConfirmRemoveLead = (leadId: string) => {
        dialog.showDialog('Remove Lead', <RemoveLeadRequest onYes={() => handleRemoveLead(leadId)} />)
    }

    return (
        user && user?.id !== animal.user.id && <div inert={fetchingHandshake} className={`w-full px-2 ${fetchingHandshake ? "opacity-50 pointer-events-none grayscale-100" : ""}`}>
            {
                Number(HandShakeCost.seller) > Number(animal.user.balance ?? 0) &&
                <div className='w-full'>
                    <div className='p-1 px-4 tracking-tight bg-amber-50'>
                        Author of this post has insufficient balance to exchange his phone number. Please wait until he recharge and get coins to his account. You can still use the "Request Number" button to notify him that you are interested in his animal.
                    </div>
                </div>
            }

            {leads.length > 0 && <div className='w-full mt-2'>
                <div className='text-xs'>Your requests:</div>
                <table className='w-full text-xs my-2'>
                    <thead>
                        <tr>
                            <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-x text-center'>Male</td>
                            <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-x text-center'>Female</td>
                            <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l border-r'>Amount</td>
                            <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Deliver to</td>
                            <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l '>Status</td>
                            <td className='p-1 bg-zinc-100 border-zinc-200 border-t border-l border-r text-center'>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leads && leads !== null && leads.map((lead: any, index: number) => {
                                return (
                                    <tr key={`${lead}-${index + 1}`} className={`${lead.status === "cancelled" ? "line-trough" : ""}`}>
                                        <td className="p-1 border-zinc-200 border-b border-x text-center">{lead.maleQuantityAvailable ?? 0}</td>
                                        <td className="p-1 border-zinc-200 border-b border-x text-center">{lead.femaleQuantityAvailable ?? 0}</td>
                                        <td className="p-1 border-zinc-200 border-b border-l border-r">{formatCurrency(calculatePricing({ ...props.animal, ...lead, price: lead.amount }).price)}</td>
                                        <td className="p-1 border-zinc-200 border-b border-l">{lead.city && String(lead.city ?? '').length > 0 ? `${formalizeText(lead.city)}, ${formalizeText(lead.province)}` : `${formalizeText(lead.user.city)}, ${formalizeText(lead.user.province)}`}</td>
                                        <td className="p-1 border-zinc-200 border-b border-l">{formalizeText(lead.status)}</td>
                                        <td className="p-1 border-zinc-200 border-b border-l border-r"> <XIcon size={16} onClick={() => handleConfirmRemoveLead(lead.id)} className='mx-auto cursor-pointer' /> </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>}
            <PostBiddingOptions directCTO directCTOAction={handleCreateLead} postBiddingOptions={postBiddingOptions} setPostBiddingOptions={setPostBiddingOptions} animal={{ ...props.animal, price: fixedAmount && fixedAmount > 0 ? fixedAmount : props.animal.price }} user={user}>
                <Button disabled={isChecking || isCreating} className='w-full mt-2'>{isCreating ? "..." : `${leads && leads.length > 0 ? "Request More" : "Create Request"}`}</Button>
            </PostBiddingOptions>
        </div>
    )
}

export default CreateLeadButton

const CreateLeadConfirmationDialog = (props: { text: string, onYes?: () => void }) => {
    const dialog = useDialog()

    return (
        <div className='px-4'>
            <div className='mb-4'>{props.text}</div>
            <div className='w-full gap-2 flex items-center'>
                <Button onClick={() => dialog.closeDialog()} className='w-full' variant='btn-secondary' >No</Button>
                <Button onClick={props.onYes} className='w-full'>Yes</Button>
            </div>
        </div>
    )
}
const RemoveLeadRequest = (props: { onYes?: () => void }) => {
    const dialog = useDialog()

    return (
        <div className='px-4'>
            <div className='mb-4'>Are you sure to remove this request?</div>
            <div className='w-full gap-2 flex items-center'>
                <Button onClick={() => dialog.closeDialog()} className='w-full' variant='btn-secondary' >No</Button>
                <Button onClick={props.onYes} className='w-full'>Yes</Button>
            </div>
        </div>
    )
}

