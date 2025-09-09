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
import { CandlestickChartIcon, PhoneCallIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContacts } from '@/hooks/useContacts'
import Link from 'next/link'
import BidProtection from './BidProtection'
import { useRooms } from '@/hooks/useRooms'
import BidWindow from './BidWindow'
import BiddingWrapper from '@/components/controls/Bidding/BiddingWrapper'

type Props = {
    animal: any
}

const CreateLeadButton = (props: Props) => {
    const [ownerContact, setOwnerContact] = useState<any>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [fixedAmount, setFixedAmount] = useState(0)
    const router = useRouter()
    const protocols = useProtocols()
    const addToContact = useContacts((state: any) => state.addToContact)
    const find = useContacts((state: any) => state.find)
    const contacts = useContacts((state: any) => state.contacts)
    const FreeMode = protocols.protocols && protocols.get("FreeMode")
    const [fetchingHandshake, setFetchingHandshake] = useState(false)
    const session: any = useSession()
    const user = useUser()
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

    useEffect(() => {
        const contact = find(animal.userId)
        setOwnerContact(contact)
    }, [contacts])

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
                if (data.user.balance < 1 && FreeMode !== 1) {
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
        if (Number(HandShakeCost.buyer && FreeMode !== 1) > 0) {
            dialog.showDialog('Creating Lead', <CreateLeadConfirmationDialog onYes={continueLead} text={`You are about to create a lead for this animal. This will cost you ${formatCurrency(HandShakeCost.buyer)}. Do you want to continue?`} />)
        } else {
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

    const handleGetDirectNumber = async () => {
        setIsChecking(true)
        const response = await actions.client.posts.getDirectNumber(user.id, animal.id)
        if (response.status === 200) {
            addToContact(response.data)
        } else {
            dialog.showDialog('Error', null, response.message)
        }
        setIsChecking(false)
    }

    // NO SESSION
    if (!user) {
        return (
            <div className='w-full flex justify-center items-center text-center px-4'>
                <Button onClick={() => dialog.showDialog("Login", null, "You need an account to view the number.")} className='w-full'>View Number</Button>
            </div>
        )
    }

    //AUTHOR OF THIS ANIMAL
    if (user && user.id === props.animal.userId && props.animal.allowBidding) {
        return (
            <BiddingWrapper animal={animal}>
                <></>
            </BiddingWrapper>
        )
    }


    //BUYER OF THIS ANIMAL
    if (user && user.id !== animal.user.id && !user.broker) {
        return (
            <div className='px-2'>
                {!ownerContact ? <div className='w-full'>
                    <Button onClick={handleGetDirectNumber} disabled={isChecking || isCreating} className='w-full mt-2'>{isCreating ? "..." : `View Number`}</Button>
                </div> :
                    <Link href={`tel:${ownerContact.user.phone}`} className='w-full p-2 text-emerald-700 border-2 border-dashed border-emerald-700 rounded text-center flex flex-col justify-center items-center'>
                        <div className='text-xl flex items-center gap-2 font-bold'><PhoneCallIcon /> {ownerContact.user.phone}</div>
                        <div className='tracking-tight'>{ownerContact.user.name}</div>
                    </Link>}

            </div>
        )
    } else {
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
                                            <td className="p-1 border-zinc-200 border-b border-l border-r">{formatCurrency(lead.amount * (lead.maleQuantityAvailable + lead.femaleQuantityAvailable))}</td>
                                            {lead.deliveryOptions.includes("SELF_PICKUP") && <td className="p-1 border-zinc-200 border-b border-l">Self Pickup</td>}
                                            {lead.deliveryOptions.includes("SELLER_DELIVERY") && <td className="p-1 border-zinc-200 border-b border-l">{lead.city && String(lead.city ?? '').length > 0 ? `${formalizeText(lead.city)}, ${formalizeText(lead.province)}` : `${formalizeText(lead.user.city)}, ${formalizeText(lead.user.province)}`}</td>}
                                            <td className="p-1 border-zinc-200 border-b border-l">{formalizeText(lead.status)}</td>
                                            <td className="p-1 border-zinc-200 border-b border-l border-r"> <XIcon size={16} onClick={() => handleConfirmRemoveLead(lead.id)} className='mx-auto cursor-pointer' /> </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>}
                {(leads.length === 0 && isChecking === false) &&
                    <BidProtection animal={animal}>
                        <Button className='w-full mt-2 flex gap-2 items-center justify-center'> <CandlestickChartIcon size={20} /> Bargain</Button>
                    </BidProtection>
                }
                {(leads.length > 0 || !props.animal.allowBidding) && <PostBiddingOptions directCTO directCTOAction={handleCreateLead} postBiddingOptions={postBiddingOptions} setPostBiddingOptions={setPostBiddingOptions} animal={{ ...props.animal, price: fixedAmount && fixedAmount > 0 ? fixedAmount : props.animal.price }} user={user}>
                    <Button disabled={isChecking || isCreating} className='w-full mt-2'>{isCreating ? "..." : `${leads && leads.length > 0 ? "Request More" : "Create Request"}`}</Button>
                </PostBiddingOptions>}
            </div>
        )
    }
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

