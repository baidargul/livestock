import { images } from '@/consts/images'
import Image from 'next/image'
import React from 'react'
import FollowButton from '@/components/ui/FollowButton'
import RatingBar from '@/components/website/ratings/RatingBar'
import { ArrowLeftCircleIcon, CircleSmallIcon, StickyNoteIcon, TicketCheckIcon, TicketMinusIcon, TicketPlusIcon } from 'lucide-react'
import prisma from '@/lib/prisma'
import { actions } from '@/actions/serverActions/actions'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import BackNavigator from '@/components/controls/BackNavigator'
import ProfileImageChangeWrapper from '@/components/website/profile/_components/ProfileImageChangeWrapper'
import ProfileImage from './_components/ProfileImage'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    const ids = await prisma.user.findMany({ select: { id: true } })
    return ids.map(({ id }) => ({ id }))
}

const page = async (props: Props) => {
    const { params } = props
    const { id } = await params

    let response: any = await actions.server.user.list(id, 'id')
    const user = response.data as any
    response = await actions.server.post.listAll(id, 'userId')
    const animals = response.data as any[]

    return (
        <div className='relative w-full min-h-[100vh] select-none'>
            <div className='relative w-full h-[200px] mb-24'>
                <BackNavigator className='absolute top-3 left-3 z-10 bg-black/20 rounded-full p-1'>
                    <ArrowLeftCircleIcon width={32} height={32} className='text-white' />
                </BackNavigator>
                <Image src={images.chickens.covers[3]} draggable={false} width={100} height={100} quality={100} className='w-full h-[200px] pointer-events-none select-none object-cover' alt='janwarmarkaz' />
                <div className='flex justify-between w-full px-4 items-center absolute z-10 bottom-[-75px]'>
                    <ProfileImage user={user} />
                    <div className='font-normal tracking-tight text-sm flex flex-col justify-end items-end gap-1'>
                        <FollowButton targetUserId={user?.id} targetFollowingList={user?.following} />
                        <div className='flex gap-1 items-center'><span className='tracking-wide'>{user?.animals.length ?? 0} </span>post{user?.animals.length > 1 ? 's' : ''} <CircleSmallIcon size={10} className='text-zinc-400' /><span className='tracking-wide'>{user?.followers.length ?? 0} </span>follower{user?.followers.length > 1 ? 's' : ''}</div>
                    </div>
                </div>
                <div className='absolute bottom-0 left-0 bg-gradient-to-t from-white to-transparent w-full h-[100px] select-none'></div>
            </div>
            <div className='px-4 flex flex-col gap-4'>
                <div className=''>
                    <div className='text-2xl font-semibold'>{user?.name}</div>
                    <div className='text-sm font-medium text-zinc-600'>{user?.email}</div>
                </div>
                <div>
                    <RatingBar readonly defaultRating={4.5} />
                </div>
                <div className='grid grid-cols-3 gap-2 w-full tracking-tight'>
                    <div className='text-center mr-auto flex flex-col justify-center items-center'>
                        <label className='text-zinc-800 text-2xl font-bold'>{user?.animals.length ?? 0}</label>
                        <TicketCheckIcon className='w-6 h-6 text-emerald-700' />
                        <span className='text-sm font-normal'>Deals closed</span>
                    </div>
                    <div className='text-center flex flex-col justify-center items-center'>
                        <label className='text-zinc-800 text-2xl font-bold'>{user?.animals.length ?? 0}</label>
                        <TicketMinusIcon className='w-6 h-6 text-purple-500' />
                        <span className='text-sm font-normal'>Bids closed</span>
                    </div>
                    <div className='text-center ml-auto flex flex-col justify-center items-center'>
                        <label className='text-zinc-800 text-2xl font-bold'>{user?.animals.length ?? 0}</label>
                        <TicketPlusIcon className='w-6 h-6 text-zinc-700' />
                        <span className='text-sm font-normal'>Animals listed</span>
                    </div>
                </div>
                <div className='border-t border-zinc-200 pt-2 mb-4'>
                    <div className='text-xl tracking-tight py-2 mb-2 flex gap-2 items-center'> <TicketPlusIcon className='w-5 h-5 mt-1 text-zinc-700' /> Listings</div>
                    <div className=''>
                        {
                            animals.length > 0 ? (
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                    {
                                        animals.slice(0, 4).map((animal: any) => (
                                            <Link href={`/entity/${animal.id}`} key={animal.id} className='p-2 bg-white shadow-sm cursor-pointer'>
                                                <div >
                                                    <Image src={animal.images[0]?.image || images.chickens.covers[0]} width={300} height={300} alt={animal.title} layout='fixed' quality={70} className='w-full h-[200px] object-cover rounded-lg' />
                                                    <div className='text-lg font-semibold'>{animal.title}</div>
                                                    <div className='text -mt-1 tracking-tight'>{animal.description}</div>
                                                    <div className='text-2xl font-semibold tracking-widest -mt-1 text-right text-emerald-600'>{formatCurrency(animal.price)}</div>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                            ) : (
                                <div className='text-sm text-zinc-600'>No listings found</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default page