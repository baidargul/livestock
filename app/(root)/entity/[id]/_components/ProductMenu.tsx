'use client'
import { actions } from '@/actions/serverActions/actions'
import DeleteProductWrapper from '@/components/controls/DeleteProductWrapper'
import { useLoader } from '@/hooks/useLoader'
import { useUser } from '@/socket-client/SocketWrapper'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
type Props = {
    children: React.ReactNode
    className?: string
    animal: any
}

const ProductMenu = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const setLoading = useLoader((state: any) => state.setLoading)
    const user = useUser()
    const router = useRouter()

    useEffect(() => {
        setLoading(false)
    }, [])

    if (user?.id !== props.animal.userId) {
        return null
    }

    const handleToggle = (val: boolean) => {
        setIsOpen(val)
    }

    const stopLoading = () => {
        setLoading(false)
    }

    const changeBiddingStatus = async (val: boolean) => {
        setLoading(true, val === true ? 'Enabling bidding' : 'Disabling bidding')
        setIsOpen(false)
        const response: any = await actions.client.posts.changeBiddingStatus(props.animal.id, val)
        if (response.status === 200) {
            router.refresh()
            stopLoading()
        }
    }

    return (
        <div className={`relative select-none flex flex-col justify-end  ${props.className}`}>
            <div onClick={() => handleToggle(!isOpen)} className={`w-fit cursor-pointer`}>{props.children}</div>
            {
                isOpen && (
                    <div className='absolute top-9 right-0 z-10'>
                        <ul className='p-2 w-full min-w-[200px] rounded bg-white shadow-lg'>
                            <li onClick={() => setIsOpen(false)} className='p-2 hover:bg-gray-100 cursor-pointer'>
                                <DeleteProductWrapper id={props.animal.id} animal={props.animal}>
                                    Remove
                                </DeleteProductWrapper>
                            </li>
                            {props.animal.allowBidding && <li onClick={() => changeBiddingStatus(false)} className='p-2 hover:bg-gray-100 cursor-pointer'>Deactivate Bidding</li>}
                            {!props.animal.allowBidding && <li onClick={() => changeBiddingStatus(true)} className='p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1'>Activate Bidding</li>}
                        </ul>
                    </div>
                )
            }
        </div >
    )
}

export default ProductMenu