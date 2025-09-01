import { actions } from '@/actions/serverActions/actions'
import { useLoader } from '@/hooks/useLoader'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
}

const BiddingToFixedToggleButton = (props: Props) => {
    const [isToggled, setIsToggled] = useState(true)
    const router = useRouter()
    const setLoading = useLoader((state: any) => state.setLoading)

    const stopLoading = () => {
        setLoading(false)
    }

    const changeBiddingStatus = async (val: boolean) => {
        setLoading(true, val === true ? 'Enabling bidding' : 'Disabling bidding')
        setIsToggled(val)
        const response: any = await actions.client.posts.changeBiddingStatus(props.animal.id, val)
        if (response.status === 200) {
            router.refresh()
            stopLoading()
        }
    }

    const handleToggle = (val: boolean) => {

    }

    useEffect(() => {
        setIsToggled(props.animal.allowBidding)
    }, [props.animal])

    return (
        <div className='flex gap-2 items-center'>
            <div className='tracking-tight font-semibold'>{isToggled ? "Disable Bargaining" : "Allow Bargaining"}</div>
            <div onClick={() => changeBiddingStatus(!isToggled)} className={`relative group flex items-center overflow-hidden cursor-pointer rounded p-3 px-8 ${isToggled ? "bg-gradient-to-t from-emerald-700 to-emerald-800" : "bg-gradient-to-b from-zinc-200 to-zinc-200"} transition duration-300 ease-in-out border border-zinc-300`}>
                <div className={`w-[50%] h-[80%] absolute left-0 bg-white rounded border border-zinc-300 transition duration-300 ease-in-out ${isToggled ? "translate-x-[90%]" : "translate-x-[10%] "}`}></div>
            </div>
        </div>
    )
}

export default BiddingToFixedToggleButton