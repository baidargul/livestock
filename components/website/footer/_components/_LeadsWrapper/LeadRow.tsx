'use client'
import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import ExpiryTimeControl from '@/components/controls/ExpiryTimeControl'
import RechargeDialog from '@/components/Recharge/RechargeDialog'
import Button from '@/components/ui/Button'
import { useContacts } from '@/hooks/useContacts'
import { useDialog } from '@/hooks/useDialog'
import { useSession } from '@/hooks/useSession'
import { formalizeText } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'

type Props = {
    lead: any
    fetchLeads: () => void
}

const LeadRow = (props: Props) => {
    const user = useUser()
    const contacts = useContacts()
    const session: any = useSession()
    const dialog = useDialog()


    const fetchUserDetails = async () => {
        if (!user || !session) return
        const response = await actions.client.leads.convertToSale(user.id, props.lead.id)
        if (response.status === 200) {
            session.fetchBalance()
            props.fetchLeads && props.fetchLeads()
            contacts.addToContact(response.data.contact)
            dialog.showDialog('Lead converted', null, 'The lead has been converted to a sale. You can now contact the buyer via your contacts.')
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

    return (
        <div className='bg-white border border-zinc-200 p-2 rounded h-full'>
            <div className='font-bold'>{props.lead.user.name}</div>
            <div className='text-zinc-600 text-xs'>{formalizeText(props.lead.user.city)}, {formalizeText(props.lead.user.province)}</div>
            <ElapsedTimeControl date={props.lead.createdAt} />
            <div className='flex gap-1 text-xs items-center mb-4'>
                <div>
                    Expire in:
                </div>
                <div>
                    <ExpiryTimeControl date={props.lead.createdAt} period='1day' />
                </div>
            </div>
            <div>
                <Button onClick={handleFetchNumber} className='w-full'>Show Number</Button>
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
    if (!userSession) return null;

    useEffect(() => {
        fetchHandShakeProtocol()
    }, [])

    const fetchHandShakeProtocol = async () => {
        setIsLoading(true)
        const response = await actions.client.protocols.BusinessProtocols.list('SellerHandShakeCost')
        if (response.status === 200) {
            setCost(response.data.value)
        } else {
            setCost(0)
        }
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