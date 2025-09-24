import BargainChatWrapper from '@/components/controls/Bargain/BargainChatWrapper'
import Button from '@/components/ui/Button'
import { Animal } from '@prisma/client'
import { CandlestickChartIcon } from 'lucide-react'
import React from 'react'
import PostBiddingOptions from '../PostBiddingOptions'

type Props = {
    animal: Animal
    leads: any[]
    isChecking: boolean
    isCreating: boolean
    handleCreateLead: () => void
    postBiddingOptions: any
    setPostBiddingOptions: (options: any) => void
    user: any
    fixedAmount?: number
}

const LeadCTOControls = (props: Props) => {
    return (
        props.user && <>
            {(props.leads.length === 0 && !props.animal.allowBidding && props.isChecking === false) &&
                <BargainChatWrapper animal={props.animal}>
                    <Button className='w-full mt-2 flex gap-2 items-center justify-center'> <CandlestickChartIcon size={20} /> Bargain</Button>
                </BargainChatWrapper>
            }
            {(props.leads.length > 0 || !props.animal.allowBidding) && <PostBiddingOptions directCTO directCTOAction={props.handleCreateLead} postBiddingOptions={props.postBiddingOptions} setPostBiddingOptions={props.setPostBiddingOptions} animal={{ ...props.animal, price: props.fixedAmount && props.fixedAmount > 0 ? props.fixedAmount : props.animal.price }} user={props.user}>
                <Button disabled={props.isChecking || props.isCreating} className='w-full mt-2'>{props.isCreating ? "..." : `${props.leads && props.leads.length > 0 ? "Request More" : "Create Request"}`}</Button>
            </PostBiddingOptions>}
        </>
    )
}

export default LeadCTOControls