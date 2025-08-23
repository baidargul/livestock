'use client'
import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import { useDialog } from '@/hooks/useDialog'
import { formatCurrency } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
}

const CreateLeadButton = (props: Props) => {
    const [isChecking, setIsChecking] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const [fetchingHandshake, setFetchingHandshake] = useState(false)
    const [HandShakeCost, setHandshakeCost] = useState({
        buyer: 0,
        seller: 0
    })
    const [lead, setLead] = useState<any>(null)
    const { animal } = props
    const dialog = useDialog()
    const user = useUser()

    useEffect(() => {
        if (user) {
            fetchHandshakes()
        }
    }, [user])

    const fetchHandshakes = async () => {
        setFetchingHandshake(true)
        const [buyer, seller] = await Promise.all([
            actions.client.protocols.BusinessProtocols.list("BuyerHandShakeCost"),
            actions.client.protocols.BusinessProtocols.list("SellerHandShakeCost")
        ])
        const temp = { ...HandShakeCost, buyer: Number(buyer.data?.value ?? 0), seller: Number(seller.data?.value ?? 0) }
        setHandshakeCost(temp)
        hasLead()
        setFetchingHandshake(false)
    }

    const hasLead = async () => {
        if (!user) return;
        setIsChecking(true)
        const response: any = await actions.client.leads.hasLead(animal.id, user.id)
        if (response) {
            if (response.status === 200) {
                setLead(response.data)
            } else {
                setLead(null)
            }
        }
        setIsChecking(false)
    }

    const continueLead = async () => {
        setIsCreating(true)
        const response: any = await actions.client.leads.create(animal.id, user.id)
        if (response) {
            if (response.status === 200) {
                const data = response.data
                setLead(data)
                if (data.user.balance < 1) {
                    dialog.showDialog('Low Balance', null, "Your lead has been created and the author has been notified. However, your balance is low. Please recharge your account so that author can see your contact details when they check their leads.")
                }
            } else {
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

    const handleRemoveLead = async () => {
        if (!user || !lead) return;
        setIsCreating(true)
        const response: any = await actions.client.leads.remove(lead.id)
        if (response) {
            if (response.status === 200) {
                dialog.showDialog('Success', null, "You have removed your lead. The author will no longer see your contact details.")
                setLead(null)
            } else {
                dialog.showDialog('Error', null, response.message)
            }
        }
        setIsCreating(false)
    }

    return (
        user && user?.id !== animal.user.id && <div inert={fetchingHandshake} className={`w-full px-2 ${fetchingHandshake ? "opacity-50 pointer-events-none grayscale-100" : ""}`}>
            {
                Number(HandShakeCost.seller) > Number(animal.user.balance ?? 0) &&
                <div className='w-full'>
                    <div className='p-1 px-4 tracking-tight bg-amber-50'>
                        Author of this post has insufficient balance to exchange his phone number. Please wait until he recharge and get coins to his account. You can still use the "I'm interested" button to notify him that you are interested in his animal.
                    </div>
                </div>
            }
            {!lead && <Button onClick={handleCreateLead} className='w-full mt-2'>{isCreating ? "..." : "I'm interested"}</Button>}
            {lead !== null && <Button variant='btn-secondary' onClick={handleRemoveLead} className='w-full mt-2'>{isRemoving ? "..." : "Not interested Anymore"}</Button>}
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
                <Button className='w-full'>Yes</Button>
            </div>
        </div>
    )
}