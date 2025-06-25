import { actions } from '@/actions/serverActions/actions'
import BackNavigator from '@/components/controls/BackNavigator'
import { formalizeText, formatDate, } from '@/lib/utils'
import { ArrowLeftCircleIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import prisma from '@/lib/prisma'
import { images } from '@/consts/images'
import PhoneFooter from '@/components/website/footer/Phone'
import DeleteDemandWrapper from '@/components/controls/DeleteDemandWrapper'
import Button from '@/components/ui/Button'
import FullfilmentWrapper from '@/components/controls/Fullfilment/FullfilmentWrapper'
import FulFilmentUserProtection from './_components/FulFilmentUserProtection'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    const ids = await prisma.demands.findMany({ select: { id: true } })
    return ids.map(({ id }) => ({ id }))
}

const page = async (props: Props) => {
    const { params } = props
    const { id } = await params
    const response = await actions.server.demand.list(id, 'id');
    const demand = response.data as any
    const totalQuantity = Number(demand.maleQuantityAvailable ?? 0) + Number(demand.femaleQuantityAvailable ?? 0)

    return (
        demand && <div className='relative w-full min-h-[100vh] flex flex-col justify-between'>
            <BackNavigator className='absolute top-3 left-3 z-10 bg-black/20 rounded-full p-1'>
                <ArrowLeftCircleIcon width={32} height={32} className='text-white' />
            </BackNavigator>
            <DeleteDemandWrapper id={demand.id}>
                <Trash2Icon size={32} className='absolute top-3 right-0 z-10 text-red-500 rounded-l-full w-14 bg-white p-1' />
            </DeleteDemandWrapper>
            <div className='relative'>
                <Image
                    src={images[demand.type].images[1]}
                    draggable={false}
                    priority
                    layout="fixed"
                    quality={50}
                    alt="hen"
                    width={100}
                    height={100}
                    style={{ height: "250px" }}
                    className="w-full h-[250px] z-0 select-none origin-top-left object-left-top object-cover"
                />
                <div className='bg-emerald-50 p-4 rounded-lg mx-4 absolute -mt-20 z-10' style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <h1 className='text-3xl text-center font-bold text-gray-800 mt-4'>{formalizeText(demand?.breed ?? "")} {formalizeText(demand?.type ?? "")}</h1>
                    <div className='px-4 py-2'>
                        <p className='text-sm text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
                    </div>
                </div>
            </div>
            <div className='mt-20 p-4'>
                <h2 className='text-2xl font-bold text-gray-800'>{totalQuantity} {formalizeText(demand.breed)} {demand.type}</h2>
                <div className='flex gap-1 items-center'>
                    <div className='text-lg text-gray-600 flex gap-1 items-center'>
                        {demand.maleQuantityAvailable && demand.maleQuantityAvailable > 0 && <div>
                            <span className="font-semibold">{demand.maleQuantityAvailable}</span> Male
                        </div>}
                        {demand.femaleQuantityAvailable && demand.femaleQuantityAvailable > 0 && <div>
                            <span className="font-semibold">{demand.femaleQuantityAvailable}</span> Male
                        </div>}
                    </div>
                    <div>required in {demand.city}, {demand.province}.</div>
                </div>
                <div>Posted: {formatDate(demand.createdAt)}</div>
                <div className='flex gap-2 items-center mt-2'>
                    {demand.averageAge > 0 && (
                        <span>Age should be minimum {demand.averageAge} {demand.ageUnit}</span>
                    )}
                    {demand.averageWeight > 0 && (
                        <span>Weight should be minimum {demand.averageWeight} {demand.weightUnit}</span>
                    )}
                </div>
                <div className='w-full mt-4'>
                    <FulFilmentUserProtection demand={demand}>
                        <FullfilmentWrapper demand={demand}>
                            <Button className='w-full'>Fullfill this demand</Button>
                        </FullfilmentWrapper>
                    </FulFilmentUserProtection>
                </div>
            </div>
            <PhoneFooter />
        </div >
    )
}

export default page