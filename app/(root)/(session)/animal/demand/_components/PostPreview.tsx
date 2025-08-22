import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import { images } from '@/consts/images'
import { useDialog } from '@/hooks/useDialog'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { constructBase64Image, ImagePayload } from '@/lib/image'
import { formalizeText, formatCurrency } from '@/lib/utils'
import axios from 'axios'
import { ActivityIcon, Calendar1Icon, CalendarIcon, ClipboardCheckIcon, Trash2Icon, WeightIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
    user: any
    deletePost: () => void
}

const PostPreview = (props: Props) => {
    const router = useRouter()
    const logoutUser = useSession((state: any) => state.logoutUser)
    const [isPosting, setIsPosting] = useState(false)
    const setLoading = useLoader((state: any) => state.setLoading)
    const dialog = useDialog((state: any) => state)

    const handleHitApi = async () => {
        if (!props.user.id) {
            alert("Please login to create a post")
            router.push('/home')
            return
        }
        setIsPosting(true)
        setLoading(true)
        const data = {
            ...props.animal,
            user: props.user,
            userId: props.user.id
        }
        delete data?.composing
        delete data?.user
        const response: any = await actions.client.demand.createDemand(data)
        if (response.status === 200) {
            localStorage.removeItem('demand')
            router.push(`/home`)
        } else if (response.status === 401) {
            await logoutUser()
            dialog.showDialog(`Invalid user`, null, `Error: Please login again`)
            router.push('/home')
        } else if (response.status === 402) {
            await logoutUser()
            dialog.showDialog(`Session expired`, null, `Session expired, Please login again`)
            router.push('/home')
        }
        else {
            dialog.showDialog(`Session expired`, null, `Error: ${response.message}`)
            setIsPosting(false)
        }
        setLoading(false)
    }

    const checkQuantity = () => {
        const totalQuantity = Number(props.animal.maleQuantityAvailable || 0) + Number(props.animal.femaleQuantityAvailable || 0)
        return totalQuantity
    }

    const totalQuantity = checkQuantity()
    return (
        <div className='w-full min-h-[95dvh] flex flex-col items-center gap-4 p-4'>
            <div className='w-full'>
                <h1 className='text-2xl font-bold mb-10'>Demand Preview</h1>
                <div className='w-full'>
                    <div className='grid grid-cols-1 sm:grid-cols-[auto_auto] gap-2 text-base w-full max-w-[400px] items-center leading-tight tracking-tight text-start p-4 rounded-lg bg-white drop-shadow-sm'>
                        <Image src={images[props.animal.type].images[1]} alt={props.animal.type} width={100} height={100} className='w-full h-full object-cover' />
                        <div className='text-base'>
                            <div className=''>
                                {
                                    Number(totalQuantity) < 1 && <div className=''>
                                        {props.animal.maleQuantityAvailable && props.animal.maleQuantityAvailable > 0 && <label className='font-bold sm:font-normal'>{props.animal.maleQuantityAvailable} Male</label>}
                                        {props.animal.femaleQuantityAvailable && props.animal.femaleQuantityAvailable > 0 && <label className='font-bold sm:font-normal'>{props.animal.femaleQuantityAvailable} Female</label>}
                                        <label className='font-bold sm:font-normal'> {props.animal.breed} {props.animal.type}.</label>
                                    </div>
                                }
                            </div>
                            {Number(totalQuantity) > 0 && <div className='text-base'>
                                {props.animal.maleQuantityAvailable && props.animal.maleQuantityAvailable > 0 && <label className=''>{props.animal.maleQuantityAvailable} Male</label>}
                                {props.animal.maleQuantityAvailable && props.animal.femaleQuantityAvailable && props.animal.maleQuantityAvailable > 0 && props.animal.femaleQuantityAvailable > 0 && <label> and </label>} {props.animal.femaleQuantityAvailable && props.animal.femaleQuantityAvailable > 0 && <label className='text-black/80 text-base'>{props.animal.femaleQuantityAvailable} Female</label>}
                                <label> {props.animal.breed} {props.animal.type}.</label>
                                {totalQuantity > 1 && <div><label className='font-medium text-xl text-emerald-700'>{totalQuantity} {props.animal.type}</label> in total.</div>}
                                <div className='flex gap-1 items-center'><WeightIcon size={20} className='text-emerald-700' />Average weight: <label className='font-medium text-base text-emerald-700'>{props.animal.averageWeight < 1 ? `any` : props.animal.averageWeight} {props.animal.weightUnit}</label></div>
                                <div className='flex gap-1 items-center'><CalendarIcon size={20} className='text-emerald-700' />Average age: <label className='font-medium text-base text-emerald-700'>{props.animal.averageAge < 1 ? `any` : props.animal.averageAge} {props.animal.ageUnit}</label></div>
                            </div>}
                            <div>
                                <div className='font-bold text-base'>
                                    Between
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <div>{formatCurrency(props.animal.minPrice ?? 0)}</div>
                                    <ActivityIcon size={20} />
                                    <div>{formatCurrency(props.animal.maxPrice ?? 0)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='w-full mt-auto p-4'>
                {props.animal && <div className='my-4 cursor-pointer flex gap-1 items-center' onClick={props.deletePost}><Trash2Icon size={20} /> Clear Post</div>}
                <div className='flex items-center justify-between gap-4 w-full'>
                    <Button onClick={props.moveBack} className='w-full' variant='btn-secondary' disabled={isPosting || !props.user.id}>Go Back</Button>
                    <Button onClick={handleHitApi} className='w-full text-nowrap' disabled={isPosting}>Create Demand</Button>
                </div>
            </div>
        </div>
    )
}

export default PostPreview