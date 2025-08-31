'use client'
import { actions } from '@/actions/serverActions/actions'
import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import ExpiryTimeControl from '@/components/controls/ExpiryTimeControl'
import RechargeDialog from '@/components/Recharge/RechargeDialog'
import Button from '@/components/ui/Button'
import SoldOverlay from '@/components/ui/SoldOverlay'
import { useContacts } from '@/hooks/useContacts'
import { useDialog } from '@/hooks/useDialog'
import { useProtocols } from '@/hooks/useProtocols'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { number } from 'framer-motion'
import React, { use, useEffect, useState } from 'react'
import { PiExclamationMark } from 'react-icons/pi'
import StatusWindow from './StatusWindow'
import Link from 'next/link'
import { ArrowRightSquareIcon, ChevronDown, ChevronDownIcon, PencilIcon, PhoneIcon } from 'lucide-react'

type Props = {
    lead: any
    index?: number
    fetchLeads: () => void
    FreeMode?: boolean
}

const LeadRow = (props: Props) => {
    const [buyerCost, setBuyerCost] = useState(0)
    const [sellerCost, setSellerCost] = useState(0)
    const user = useUser()
    const contacts = useContacts()
    const session: any = useSession()
    const dialog = useDialog()
    const protocols = useProtocols()
    const [isWorking, setIsWorking] = useState(false)
    const [toggled, setToggled] = useState(false)

    const handleToggled = (val: boolean) => {
        setToggled(val)
    }

    useEffect(() => {
        if (protocols.protocols) {
            setBuyerCost(protocols.get(`BuyerHandShakeCost`) ?? 0)
            setSellerCost(protocols.get(`SellerHandShakeCost`) ?? 0)
        }
    }, [protocols])


    const fetchUserDetails = async () => {
        if (!user || !session) return
        setIsWorking(true)
        const response = await actions.client.leads.convertToSale(user.id, props.lead.id)
        if (response.status === 200) {
            session.fetchBalance()
            props.fetchLeads && props.fetchLeads()
            contacts.addToContact(response.data.contact)
            dialog.showDialog('Request converted to sale', null, 'Sale order of this animal has been created.')
        } else if (response.status === 305) {
            dialog.showDialog('Insufficient balance', <RechargeDialog />)
        } else if (response.status === 306) {
            dialog.showDialog('Buyer on low balance', null, response.message)
        }
        else {
            alert("Error: " + response.message)
        }
        setIsWorking(false)
    }

    const continueRemoveLead = async () => {
        const response: any = await actions.client.leads.remove(props.lead.id)
        if (response) {
            if (response.status === 200) {
                props.fetchLeads && props.fetchLeads()
                dialog.closeDialog()
            } else {
                dialog.showDialog(`Error`, null, response.message)
            }
        }
    }

    const handleRemoveLead = async () => {
        if (!user || !props.lead) return;
        dialog.showDialog("Remove Lead", <RemoveLeadConfirmationDialog onYes={continueRemoveLead} />)
    }

    const handleFetchNumber = async () => {
        if (!user) return
        if (!props.FreeMode) {
            dialog.showDialog('Charges', <CostConfirmationDialog onContinue={fetchUserDetails} />)
        } else {
            fetchUserDetails()
        }
    }


    const animal = {
        ...props.lead.animal, ...props.lead
    }
    delete animal?.user
    delete animal?.animal


    const isForBuyer = user && user.id === props.lead.userId

    if (isForBuyer) {

        const response = props.lead.sold && props.lead.status === "pending" ? "Request accepted" : props.lead.status === "cancelled" ? "Request cancelled" : props.lead.status === "dispatched" ? "Animal dispatched" : "Request accepted"

        return (
            <div className={`bg-white border border-zinc-200 p-2 rounded flex flex-col ${toggled ? "h-[30px] overflow-hidden" : "h-full"}`}>
                <div onClick={() => handleToggled(!toggled)} className='mb-2 w-full flex gap-2 items-center'>
                    <ChevronDownIcon size={16} className={`${toggled ? "-rotate-90" : ""} transition duration-300 ease-in-out `} /> {props.index && <div className='text-xs text-zinc-500'>{props.index} -</div>}  <div className='text-xs line-clamp-1'>{Number(props.lead.maleQuantityAvailable ?? 0) + Number(props.lead.femaleQuantityAvailable ?? 0)} x {formalizeText(props.lead.animal.breed)} {props.lead.animal.type}</div>
                </div>
                {
                    props.lead.sold && <div className={` ${props.lead.status === "pending" ? "bg-lime-500/10 text-lime-700" : props.lead.status === "cancelled" ? "bg-amber-500/10 text-amber-700" : props.lead.status === "dispatched" ? "bg-sky-500/10 text-sky-700" : "bg-emerald-500/10 text-emerald-700"} mb-2 text-xs p-1 text-center`}>
                        {response}
                    </div>
                }
                {/* <div className='font-bold flex gap-1 items-center'>{formalizeText(props.lead.animal.user.name)}</div> */}
                {Number(props.lead.user.balance) < Number(buyerCost) && !props.FreeMode && <div className='flex items-center gap-2'><PiExclamationMark className='text-amber-700 bg-amber-100 border border-amber-700 rounded-full' /> <div className='font-normal text-xs text-amber-700'>on Low balance</div></div>}
                <div className='flex justify-between items-center gap-2 text-xs'>
                    <div>
                        <div className='font-bold'>From:</div>
                        <div>{formalizeText(props.lead.animal.city)}, {formalizeText(props.lead.animal.province)}</div>
                    </div>
                    <ArrowRightSquareIcon className='mx-auto' />
                    <div>
                        <div className='font-bold'>To:</div>
                        {props.lead.deliveryOptions.includes("SELLER_DELIVERY") && <div className='text-emerald-700 font-bold'>{formalizeText(props.lead.city)}, {formalizeText(props.lead.province)}</div>}
                        {props.lead.deliveryOptions.includes("SELF_PICKUP") && <div className='text-emerald-700 font-bold'>Self Pickup</div>}
                    </div>
                </div>
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
                <div className='text-xs p-1 bg-amber-50'>'{Number(props.lead.maleQuantityAvailable ?? 0) + Number(props.lead.femaleQuantityAvailable ?? 0)} {props.lead.animal.breed} {props.lead.animal.type}'</div>
                <div className='mb-2'>
                    <div>
                        Delivery mode:
                    </div>
                    <div className='flex flex-col'>
                        {
                            props.lead.deliveryOptions.map((method: any, index: number) => {

                                return (
                                    <div key={`${method}-${index}`} className='flex gap-1 items-center text-nowrap text-xs'>
                                        <DeliveryIcon icon={method} /> - {method === "SELF_PICKUP" ? "I'll Self Pickup." : "Cargo/Deliver me."}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex flex-col items-end justify-end'>
                    <ElapsedTimeControl date={props.lead.createdAt} />
                    {!props.lead.sold && <div className='flex gap-1 text-xs items-center mb-4'>
                        <div>
                            Expire in:
                        </div>
                        <div>
                            <ExpiryTimeControl date={props.lead.createdAt} period='1day' />
                        </div>
                    </div>}
                </div>
                <div className=''>
                    {!props.lead.sold && <div>
                        <div className='tracking-tight mb-1'>Seller response:</div>
                        <div className='w-full border border-dashed p-2 text-center'>{formalizeText(props.lead.status)}</div>
                    </div>}
                    {props.lead.sold &&
                        <>
                            <div className='border-t border-zinc-200 pt-4'>
                                <div className='tracking-tight'>
                                    <div>Phone:</div>
                                    {String(props.lead.animal.user.phone ?? '').length > 0 && <Link href={`tel:${props.lead.animal.user.phone}`} className='cursor-pointer'>
                                        <>
                                            <div className='w-full p-2 px-4 text-emerald-800 border border-dashed border-emerald-800 rounded flex items-center gap-2 justify-center text-center'> <PhoneIcon size={16} /> {props.lead.animal.user.phone}</div>
                                            <div className='text-xs text-center mt-1'>{props.lead.animal.user.name}</div>
                                        </>
                                    </Link>}
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className='mt-auto'>
                    {props.lead.sold && <div>
                        <div className='tracking-tight mb-1'>Request status:</div>
                        <div className='w-full border border-dashed p-2 text-center'>{formalizeText(props.lead.status)}</div>
                    </div>}
                    <Button onClick={handleRemoveLead} className='w-full mt-1' variant='btn-secondary'>Remove</Button>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`bg-white border border-zinc-200 p-2 rounded flex flex-col ${toggled ? "h-[30px] overflow-hidden" : "h-full"}`}>
                <div onClick={() => handleToggled(!toggled)} className='mb-2 w-full flex gap-2 items-center'>
                    <ChevronDownIcon size={16} className={`${toggled ? "-rotate-90" : ""} transition duration-300 ease-in-out `} /> {props.index && <div className='text-xs text-zinc-500'>{props.index} -</div>}  <div className='text-xs line-clamp-1'>{Number(props.lead.maleQuantityAvailable ?? 0) + Number(props.lead.femaleQuantityAvailable ?? 0)} x {formalizeText(props.lead.animal.breed)} {props.lead.animal.type}</div>
                </div>
                <div className='font-bold flex gap-1 items-center'>{formalizeText(props.lead.user.name)}</div>
                {Number(props.lead.user.balance) < Number(buyerCost) && !props.FreeMode && <div className='flex items-center gap-2'><PiExclamationMark className='text-amber-700 bg-amber-100 border border-amber-700 rounded-full' /> <div className='font-normal text-xs text-amber-700'>on Low balance</div></div>}
                {String(props.lead.city).length > 0 && String(props.lead.province).length > 0 && props.lead.deliveryOptions.includes("SELLER_DELIVERY") && <div className='text-zinc-600 text-xs'>Delivery location: <span className='font-bold'>{formalizeText(props.lead.city)}, {formalizeText(props.lead.province)}</span></div>}
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
                    {!props.lead.sold && <div className='flex gap-1 text-xs items-center mb-4'>
                        <div>
                            Expire in:
                        </div>
                        <div>
                            <ExpiryTimeControl date={props.lead.createdAt} period='1day' />
                        </div>
                    </div>}
                </div>
                <div className='mb-2'>
                    <div>
                        Delivery mode:
                    </div>
                    <div className='flex flex-col'>
                        {
                            props.lead.deliveryOptions.map((method: any, index: number) => {

                                return (
                                    <div key={`${method}-${index}`} className='flex gap-1 items-center text-nowrap text-xs'>
                                        <DeliveryIcon icon={method} /> - {method === "SELF_PICKUP" ? "I'll Self Pickup." : "Cargo/Deliver me."}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='mt-auto'>
                    {!props.lead.sold && <Button disabled={isWorking} onClick={handleFetchNumber} className='w-full'>View Number</Button>}
                    {props.lead.sold &&
                        <div className='border-t border-zinc-200 pt-4'>
                            <div className='tracking-tight'>
                                <div>Phone:</div>
                                {String(props.lead.user.phone ?? '').length > 0 && <Link href={`tel:${props.lead.user.phone}`} className='cursor-pointer'>
                                    <div className='w-full p-2 px-4 text-emerald-800 border border-dashed border-emerald-800 rounded flex items-center gap-2 justify-center text-center'> <PhoneIcon size={16} /> {props.lead.user.phone}</div>
                                </Link>}
                            </div>
                            <div className='mt-4'>
                                <div>
                                    Status:
                                </div>
                                <div></div>
                            </div>
                            <div className='w-full flex flex-col gap-2'>
                                <StatusWindow lead={props.lead} fetchLeads={props.fetchLeads}>
                                    <Button className={`w-full ${props.lead.status === "dispatched" && "pointer-events-none grayscale-100"} flex gap-2 justify-center items-center text-center`}> {props.lead.status !== "dispatched" && <PencilIcon size={16} />} {formalizeText(props.lead.status)}</Button>
                                </StatusWindow>
                            </div>
                        </div>
                    }
                    <Button onClick={handleRemoveLead} className='w-full mt-1' variant='btn-secondary'>Remove</Button>
                </div>
            </div>
        )
    }

}

export default LeadRow


const CostConfirmationDialog = (props: { onContinue: () => void }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [cost, setCost] = useState<number | null>(null)
    const userSession: any = useSession()
    const dialog = useDialog()
    const protocols = useProtocols()
    if (!userSession) return null;

    useEffect(() => {
        if (protocols.protocols) {
            fetchHandShakeProtocol()
        }
    }, [protocols])

    const fetchHandShakeProtocol = async () => {
        setIsLoading(true)
        setCost(protocols.get('SellerHandShakeCost') ?? 0)
        setIsLoading(false)
    }

    const handleClose = () => {
        dialog.closeDialog()
    }

    const handleContinue = async () => {
        props.onContinue && props.onContinue()
        dialog.closeDialog()
    }

    if (cost) {
        if (cost > userSession.balance) {
            return <RechargeDialog />
        }
    }

    return (
        <div className={`px-4 ${isLoading && "pointer-events-none select-none"}`}>
            This action will cost you <span className={`p-1 bg-amber-50 border border-amber-200 rounded transition duration-700 ease-in-out ${isLoading && "blur-[2px]"}`}>{cost && cost > 1 ? `${cost ?? 0} coins` : `${cost ?? 0} coin`}</span> You have <span className='font-bold'>{userSession.balance} coins</span> available.
            <div className='mt-4 flex gap-2 items-center w-full'>
                <Button onClick={handleClose} variant='btn-secondary' className='w-full'>Cancel</Button>
                <Button disabled={isLoading} onClick={handleContinue} className='w-full'>Continue</Button>
            </div>
        </div>
    )
}

const RemoveLeadConfirmationDialog = (props: { onYes: () => void }) => {
    const dialog = useDialog()

    return (
        <div className='px-4 flex flex-col gap-2'>
            <div className='font-bold'>Are you sure to remove this lead</div>
            <div className='flex gap-2 w-full'>
                <Button onClick={props.onYes} variant={`btn-secondary`} className='w-full'>Yes</Button>
                <Button onClick={() => dialog.closeDialog()} variant={`btn-secondary`} className='w-full'>No</Button>
            </div>
        </div>
    )
}