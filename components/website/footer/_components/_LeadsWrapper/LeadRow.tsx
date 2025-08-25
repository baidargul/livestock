'use client'
import { actions } from '@/actions/serverActions/actions'
import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import ExpiryTimeControl from '@/components/controls/ExpiryTimeControl'
import RechargeDialog from '@/components/Recharge/RechargeDialog'
import Button from '@/components/ui/Button'
import { useContacts } from '@/hooks/useContacts'
import { useDialog } from '@/hooks/useDialog'
import { useProtocols } from '@/hooks/useProtocols'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { number } from 'framer-motion'
import React, { use, useEffect, useState } from 'react'
import { PiExclamationMark } from 'react-icons/pi'

type Props = {
    lead: any
    fetchLeads: () => void
}

const LeadRow = (props: Props) => {
    const [buyerCost, setBuyerCost] = useState(0)
    const [sellerCost, setSellerCost] = useState(0)
    const user = useUser()
    const contacts = useContacts()
    const session: any = useSession()
    const dialog = useDialog()
    const protocols = useProtocols()

    useEffect(() => {
        if (protocols.protocols) {
            setBuyerCost(protocols.get(`BuyerHandShakeCost`) ?? 0)
            setSellerCost(protocols.get(`SellerHandShakeCost`) ?? 0)
        }
    }, [protocols])


    const fetchUserDetails = async () => {
        if (!user || !session) return
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
    }

    const handleFetchNumber = async () => {
        if (!user) return
        dialog.showDialog('Charges', <CostConfirmationDialog onContinue={fetchUserDetails} />)
    }


    const animal = {
        ...props.lead.animal, ...props.lead
    }
    console.log(`animal`)
    console.log(animal)

    delete animal?.user
    delete animal?.animal

    return (
        <div className='bg-white border border-zinc-200 p-2 rounded flex flex-col h-full'>
            <div className='font-bold flex gap-1 items-center'>{formalizeText(props.lead.user.name)}</div>
            {Number(props.lead.user.balance) < Number(buyerCost) && <div className='flex items-center gap-2'><PiExclamationMark className='text-amber-700 bg-amber-100 border border-amber-700 rounded-full' /> <div className='font-normal text-xs text-amber-700'>on Low balance</div></div>}
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
                <div className='flex gap-1 text-xs items-center mb-4'>
                    <div>
                        Expire in:
                    </div>
                    <div>
                        <ExpiryTimeControl date={props.lead.createdAt} period='1day' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                {
                    props.lead.deliveryOptions.map((method: any, index: number) => {

                        return (
                            <div key={`${method}-${index}`} className='flex gap-1 items-center text-nowrap text-xs'>
                                <DeliveryIcon icon={method} /> - {method === "SELF_PICKUP" ? "I'll Self Pickup." : "Cargo/Delivery me."}
                            </div>
                        )
                    })
                }
            </div>
            <div className='mt-auto'>
                <Button onClick={handleFetchNumber} className='w-full'>View Number</Button>
            </div>
        </div>
    )
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