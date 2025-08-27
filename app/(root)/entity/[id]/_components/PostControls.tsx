'use client'
import { actions } from '@/actions/serverActions/actions'
import DeleteProductWrapper from '@/components/controls/DeleteProductWrapper'
import Button from '@/components/ui/Button'
import { useLoader } from '@/hooks/useLoader'
import { useUser } from '@/socket-client/SocketWrapper'
import { CalculatorIcon, CandlestickChartIcon, DecimalsArrowRightIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    animal: any
}

const PostControls = (props: Props) => {
    const user = useUser()
    const setLoading = useLoader((state: any) => state.setLoading)
    const router = useRouter()
    if (user && user.id !== props.animal.userId) return null

    const stopLoading = () => {
        setLoading(false)
    }

    const changeBiddingStatus = async (val: boolean) => {
        setLoading(true, val === true ? 'Enabling bidding' : 'Disabling bidding')
        const response: any = await actions.client.posts.changeBiddingStatus(props.animal.id, val)
        if (response.status === 200) {
            router.refresh()
            stopLoading()
        }
    }

    return (
        <div className='px-4 mt-10'>
            <div className='flex flex-wrap gap-2'>
                {props.animal.allowBidding === false && <Button onClick={() => changeBiddingStatus(true)} className='w-full flex gap-2 items-center justify-center text-center'><CandlestickChartIcon /> Allow Bargaining</Button>}
                {props.animal.allowBidding === true && <Button onClick={() => changeBiddingStatus(false)} className='w-full flex gap-2 items-center justify-center text-center'><DecimalsArrowRightIcon /> Disable Bargaining</Button>}
                <div className='w-full text-center flex justify-center items-center gap-2 border-2 border-zinc-700 p-2'> <CalculatorIcon /> Adjust Quantity</div>
                <DeleteProductWrapper id={props.animal.id} animal={props.animal}>
                    <div className='w-full text-center flex justify-center items-center gap-2 border-2 border-zinc-700 p-2'> <TrashIcon /> Remove Post</div>
                </DeleteProductWrapper>
            </div>
        </div>
    )
}

export default PostControls