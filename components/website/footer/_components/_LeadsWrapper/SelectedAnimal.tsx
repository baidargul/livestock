'use client'
import { actions } from '@/actions/serverActions/actions'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'
import LeadRow from './LeadRow'

type Props = {
    selectedAnimal: any
    setIsFetching?: (val: boolean) => void
    mode: "buying" | "selling"
}

const SelectedAnimal = (props: Props) => {
    const user = useUser()
    const [leads, setLeads] = useState([])

    useEffect(() => {
        setLeads([])
    }, [])

    useEffect(() => {
        if (user && props.selectedAnimal && props.mode) {
            fetchLeadsForAnimal()
        } else {
            setLeads([])
        }
    }, [user, props.selectedAnimal, props.mode])

    const fetchLeadsForAnimal = async () => {
        setLeads([])
        if (!props.selectedAnimal) return
        if (!user) return
        props.setIsFetching && props.setIsFetching(true)
        let response
        if (props.mode === "buying") {
            response = await actions.client.leads.ImBuying(user.id)
        } else {
            response = await actions.client.leads.ImSelling(user.id)
        }
        if (response.status === 200) {
            setLeads(response.data)
        } else {
            setLeads([])
        }
        props.setIsFetching && props.setIsFetching(false)
    }


    leads.length === 0 && <div className='w-full h-full flex items-center justify-center'>No requests yet for this animal.</div>

    return (
        leads && leads.length > 0 && <div className='grid grid-cols-1 gap-2 pr-2 w-full h-full overflow-y-auto'>
            {
                leads.map((lead: any, index: number) => {
                    return (
                        <LeadRow key={`${lead.id}-${index}`} index={index + 1} lead={lead} fetchLeads={fetchLeadsForAnimal} />
                    )
                })
            }
        </div>
    )
}

export default SelectedAnimal