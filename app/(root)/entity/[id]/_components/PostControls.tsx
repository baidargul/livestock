'use client'
import { actions } from '@/actions/serverActions/actions'
import DeleteProductWrapper from '@/components/controls/DeleteProductWrapper'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import { useLoader } from '@/hooks/useLoader'
import { formalizeText } from '@/lib/utils'
import { useUser } from '@/socket-client/SocketWrapper'
import { CalculatorIcon, CandlestickChartIcon, DecimalsArrowRightIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
}

const PostControls = (props: Props) => {
    const user = useUser()
    const setLoading = useLoader((state: any) => state.setLoading)
    const router = useRouter()
    if (user && user.id !== props.animal.userId) return null
    const dialog = useDialog()

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

    const handleAdjustQuantites = () => {
        const handleOnYes = async (quantities: { male: number, female: number }) => {
            const response = await actions.client.posts.adjustQuantity(props.animal.id, props.animal.userId, quantities)
            if (response.status === 200) {
                dialog.closeDialog()
                router.refresh()
            } else {
                dialog.showDialog(`Unable to adjust quantities`, null, `Error: ${response.message}`)
            }
        }
        const handleOnNo = () => {
            dialog.closeDialog()
        }
        dialog.showDialog('Adjust Quantities', <AdjustQuantityDialog animal={props.animal} onYes={handleOnYes} onNo={handleOnNo} />)
    }

    return (
        <div className='px-4 mt-10'>
            <div className='flex flex-wrap gap-2'>
                {props.animal.allowBidding === false && <Button onClick={() => changeBiddingStatus(true)} className='w-full flex gap-2 items-center justify-center text-center'><CandlestickChartIcon /> Allow Bargaining</Button>}
                {props.animal.allowBidding === true && <Button onClick={() => changeBiddingStatus(false)} className='w-full flex gap-2 items-center justify-center text-center'><DecimalsArrowRightIcon /> Disable Bargaining</Button>}
                <div onClick={handleAdjustQuantites} className='cursor-pointer w-full text-center flex justify-center items-center gap-2 border-2 border-zinc-700 p-2'> <CalculatorIcon /> Adjust Quantity</div>
                <DeleteProductWrapper id={props.animal.id} animal={props.animal}>
                    <div className='w-full cursor-pointer text-center flex justify-center items-center gap-2 border-2 border-zinc-700 p-2'> <TrashIcon /> Remove Post</div>
                </DeleteProductWrapper>
            </div>
        </div>
    )
}

export default PostControls

const AdjustQuantityDialog = (props: { animal: any, onYes: (quantities: { male: number, female: number }) => Promise<void>, onNo: () => void }) => {
    const [isAdjusting, setIsAdjusting] = useState(false)
    const [quantities, setQuantites] = useState({ male: 0, female: 0 })

    const handleQuantityChange = (val: string | number, key: string) => {
        setQuantites((prev: any) => ({ ...prev, [key]: String(val).length > 0 ? Number(val) : null }))
    }

    useEffect(() => {
        setQuantites({ male: props.animal.maleQuantityAvailable ?? 0, female: props.animal.femaleQuantityAvailable ?? 0 })
    }, [])

    const handleAdjust = async () => {
        setIsAdjusting(true)
        await props.onYes(quantities)
        setIsAdjusting(false)
    }


    return (
        <div className='px-4 font-normal'>
            <div className='font-bold text-lg'>{formalizeText(props.animal.breed)} {formalizeText(props.animal.type)}</div>
            <div>
                <div>Before</div>
                <table className='w-full text-xs my-2'>
                    <thead>
                        <tr className='border border-zinc-700'>
                            <td className='bg-zinc-700 text-white border-x p-1 text-center border-zinc-700'>Male</td>
                            <td className='bg-zinc-700 text-white border-x p-1 text-center border-zinc-700'>Female</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='border border-zinc-700'>
                            <td className='border-x p-1 text-center border-zinc-700'>{props.animal.maleQuantityAvailable ?? 0}</td>
                            <td className='border-x p-1 text-center border-zinc-700'>{props.animal.femaleQuantityAvailable ?? 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='p-4 bg-white shadow-sm'>
                <div className='text-emerald-700 font-bold'>Enter new quantities to adjust</div>
                <div className='flex justify-between items-center gap-4'>
                    <Textbox disabled={isAdjusting} type='number' label='Male:' value={quantities.male} onChange={(val: string) => handleQuantityChange(val, 'male')} />
                    <Textbox disabled={isAdjusting} type='number' label='Female: ' value={quantities.female} onChange={(val: string) => handleQuantityChange(val, 'female')} />
                </div>
            </div>
            <div className='mt-4 flex justify-between items-center gap-4'>
                <Button disabled={isAdjusting} onClick={handleAdjust} className='w-full'>Adjust</Button>
                <Button variant='btn-secondary' onClick={() => props.onNo()} className='w-full'>Cancel</Button>
            </div>
        </div>
    )

}