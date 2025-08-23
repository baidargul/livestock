import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { formalizeText } from '@/lib/utils'
import React from 'react'

type Props = {
    lead: any
}

const LeadRow = (props: Props) => {
    return (
        <div className='bg-white border border-zinc-200 p-2 rounded h-full'>
            <div className='font-bold'>{props.lead.user.name}</div>
            <div className='text-zinc-600 text-xs'>{formalizeText(props.lead.user.city)}, {formalizeText(props.lead.user.province)}</div>
            <ElapsedTimeControl date={props.lead.createdAt} />
        </div>
    )
}

export default LeadRow