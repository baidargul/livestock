import { actions } from '@/actions/serverActions/actions'
import Button from '@/components/ui/Button'
import { useLoader } from '@/hooks/useLoader'
import { useSession } from '@/hooks/useSession'
import { constructBase64Image, ImagePayload } from '@/lib/image'
import { formalizeText, formatCurrency } from '@/lib/utils'
import axios from 'axios'
import { Calendar1Icon, CalendarIcon, ClipboardCheckIcon, WeightIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
    user: any
}

const PostPreview = (props: Props) => {
    const router = useRouter()
    const logoutUser = useSession((state: any) => state.logoutUser)
    const [isPosting, setIsPosting] = useState(false)
    const setLoading = useLoader((state: any) => state.setLoading)

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
        }
        delete data?.composing
        const response: any = await actions.client.posts.createPost(data)
        if (response.status === 200) {
            localStorage.removeItem('post')
            router.push(`/home`)
        } else if (response.status === 401) {
            await logoutUser()
            alert("Invalid user, please login again")
            router.push('/home')
        } else if (response.status === 402) {
            await logoutUser()
            alert("Session expired, please login again")
            router.push('/home')
        }
        else {
            alert(response.message)
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
        <div className='w-full min-h-[100dvh] flex flex-col items-center gap-4 justify-between p-4'>
            <h1 className='text-2xl font-bold mb-10'>Demand Preview</h1>
            <div className='w-full'>
                <div className='flex flex-col gap-4 leading-tight tracking-tight text-start'>
                    <div className='p-4 rounded-lg bg-white drop-shadow-sm'>
                        {
                            Number(totalQuantity) < 1 && <div className=''>
                                {props.animal.maleQuantityAvailable && props.animal.maleQuantityAvailable > 0 && <label className=''>{props.animal.maleQuantityAvailable} Male</label>}
                                {props.animal.femaleQuantityAvailable && props.animal.femaleQuantityAvailable > 0 && <label className=''>{props.animal.femaleQuantityAvailable} Female</label>}
                                <label> {props.animal.breed} {props.animal.type}.</label>
                            </div>
                        }
                        {Number(totalQuantity) > 0 && <div className='text-lg'>
                            {props.animal.maleQuantityAvailable && props.animal.maleQuantityAvailable > 0 && <label className=''>{props.animal.maleQuantityAvailable} Male</label>}
                            {props.animal.maleQuantityAvailable && props.animal.femaleQuantityAvailable && props.animal.maleQuantityAvailable > 0 && props.animal.femaleQuantityAvailable > 0 && <label> and </label>} {props.animal.femaleQuantityAvailable && props.animal.femaleQuantityAvailable > 0 && <label className='text-black/80 text-base'>{props.animal.femaleQuantityAvailable} Female</label>}
                            <label> {props.animal.breed} {props.animal.type}.</label>
                            {totalQuantity > 1 && <div><label className='font-medium text-xl text-emerald-700'>{totalQuantity} {props.animal.type}</label> in total.</div>}
                            <div className='flex gap-1 items-center'><WeightIcon size={20} className='text-emerald-700' />Average weight: <label className='font-medium text-xl text-emerald-700'>{props.animal.averageWeight} {props.animal.weightUnit}</label></div>
                            <div className='flex gap-1 items-center'><CalendarIcon size={20} className='text-emerald-700' />Average age: <label className='font-medium text-xl text-emerald-700'>{props.animal.averageAge} {props.animal.ageUnit}</label></div>
                        </div>}
                    </div>
                </div>

            </div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary' disabled={isPosting || !props.user.id}>Go Back</Button>
                <Button onClick={handleHitApi} className='w-full' disabled={isPosting}>Yes Create Demand</Button>
            </div>
        </div>
    )
}

export default PostPreview