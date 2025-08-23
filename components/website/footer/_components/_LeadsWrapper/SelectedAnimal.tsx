'use client'
import { actions } from '@/actions/serverActions/actions'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import { formalizeText } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'
import LeadRow from './LeadRow'

type Props = {
    selectedAnimal: any
}

const SelectedAnimal = (props: Props) => {
    const user = useUser()
    const [leads, setLeads] = useState([])

    useEffect(() => {
        if (user) {
            fetchLeads()
        } else {
            setLeads([])
        }
    }, [user, props.selectedAnimal])

    const fetchLeads = async () => {
        if (!props.selectedAnimal) return
        const response = await actions.client.leads.forAnimal(props.selectedAnimal.id)
        if (response.status === 200) {
            setLeads(response.data)
        } else {
            setLeads([])
        }
    }


    leads.length === 0 && <div className='w-full h-full flex items-center justify-center'>No leads yet for this animal.</div>

    return (
        leads && leads.length > 0 && <div className='grid grid-cols-1 gap-2 pr-2 w-full h-full overflow-y-auto'>
            {
                [...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads, ...leads].map((lead: any, index: number) => {
                    return (
                        <LeadRow key={`${lead.id}-${index}`} lead={lead} />
                    )
                })
            }
        </div>
    )
}

export default SelectedAnimal