'use client'
import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import ExpiryTimeControl from '@/components/controls/ExpiryTimeControl'
import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { useSession } from '@/hooks/useSession'
import { formalizeText } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React from 'react'

type Props = {
    lead: any
    fetchLeads: () => void
}

const LeadRow = (props: Props) => {
    const user = useUser()
    const session: any = useSession()
    const dialog = useDialog()


    const fetchUserDetails = async () => {
        if (!user || !session) return
        const response = await actions.client.leads.convertToSale(user.id, props.lead.id)
        if (response.status === 200) {
            session.fetchBalance()
            props.fetchLeads && props.fetchLeads()
            console.log(response.data)
            alert("Lead converted to sale! Check your orders.")
        } else {
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
    const userSession: any = useSession()
    const dialog = useDialog()

    if (!userSession) return null;

    const handleClose = () => {
        dialog.closeDialog()
    }

    const handleContinue = async () => {
        props.onContinue && props.onContinue()
        dialog.closeDialog()
    }

    return (
        <div className='px-4'>
            This action will cost you 1 coin. You have <span className='font-bold'>{userSession.balance} coins</span> available.
            <div className='mt-4 flex gap-2 items-center w-full'>
                <Button onClick={handleClose} variant='btn-secondary' className='w-full'>Cancel</Button>
                <Button onClick={handleContinue} className='w-full'>Continue</Button>
            </div>
        </div>
    )
}