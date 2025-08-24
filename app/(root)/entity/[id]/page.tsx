import { actions } from '@/actions/serverActions/actions'
import BackNavigator from '@/components/controls/BackNavigator'
import DeleteProductWrapper from '@/components/controls/DeleteProductWrapper'
import MediaViewer from '@/components/controls/MediaViewer'
import Button from '@/components/ui/Button'
import { formalizeText, formatCurrency, } from '@/lib/utils'
import { ArrowLeftCircleIcon, CandlestickChartIcon, HeartIcon, MenuIcon, PhoneIcon, ShareIcon, SquareUserIcon, Trash2Icon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import prisma from '@/lib/prisma'
import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import { images } from '@/consts/images'
import BidProtection from './_components/BidProtection'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import ProductGallery from '@/components/ui/ProductGallery'
import ProductMenu from './_components/ProductMenu'
import Marquee from 'react-fast-marquee'
import DirectCTOButton from './_components/DirectCTOButton'
import ElapsedTimeControl from '@/components/controls/ElapsedTimeControl'
import SoldOverlay from '@/components/ui/SoldOverlay'
import OnSoldProtection from './_components/OnSoldProtection'
import SidebarButtons from './_components/SidebarButtons'
import DeliveryIcon from '@/components/Animals/DeliveryIcon'
import Link from 'next/link'
import CreateLeadButton from './_components/CreateLeadButton'
import ByYouTag from './_components/ByYouTag'
import YoutubeVideoPlayer from '@/components/ui/YoutubeVideoPlayer'

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    const ids = await prisma.animal.findMany({ select: { id: true } })
    return ids.map(({ id }) => ({ id }))
}

const page = async (props: Props) => {
    const timestamp = Date.now(); // Unique key
    const { params } = props
    const { id } = await params
    const response = await actions.server.post.list(id, 'id');
    if (response.status !== 200) {

        return (
            <div className='w-full min-h-[100dvh] flex justify-center items-center text-center'>
                <div className='w-full'>
                    <h1 className='text-2xl font-semibold w-full'>Animal not found</h1>
                    <Link href={'/home'} className='underline underline-offset-2 cursor-pointer'>Go back to homepage</Link>
                </div>
            </div>
        )
    }
    const animal = response.data as any
    const breedObj = images[animal?.type].breeds.find((b: any) => b.name.toLowerCase() === animal.breed);
    const info = breedObj?.info;
    return (
        animal && <div className='w-full h-full relative' key={timestamp}>
            <OnSoldProtection animal={animal} />
            <section className='relative w-full min-h-[100vh] hidden md:block'>
                <div className='p-4 flex gap-2 items-start'>
                    <div>
                        <ProductGallery images={animal.images} />
                        <div className=''>
                            <h1 className='text-lg text-start font-bold text-gray-800 mt-4'>{formalizeText(animal?.breed ?? "")} {formalizeText(animal?.type ?? "")}</h1>
                            <div className='max-w-[620px]'>
                                <p className='text-sm text-gray-600'>{info ?? ''}</p>
                            </div>
                        </div>
                    </div>
                    <section>
                        <p className='text-lg text-gray-600 tracking-tight'>'{animal.description}'</p>
                        <ElapsedTimeControl date={animal.createdAt} />
                        <SoldOverlay animal={animal}>
                            <CalculatedDescription animal={animal} />
                        </SoldOverlay>
                        <div className='flex justify-start items-start gap-4 my-4 w-full'>{
                            animal.deliveryOptions.map((option: any, index: number) => {
                                const Icon = String(option).toLocaleLowerCase() === "self_pickup" ? SquareUserIcon : TruckIcon
                                return (
                                    <div key={`${option}-${index}`} className='flex gap-1 items-center'><Icon size={20} className='text-emerald-700' /> {String(option).toLocaleLowerCase() === "self_pickup" ? "Self Pickup" : "Cargo delivery"}</div>
                                )
                            })
                        }</div>
                    </section>
                </div>
                <GeneralFooter />
            </section>
            <section className='relative w-full min-h-[100vh] md:hidden' data-value="Phone">
                <BackNavigator className='absolute top-3 left-3 z-10 bg-black/20 rounded-full p-1'>
                    <ArrowLeftCircleIcon width={32} height={32} className='text-white' />
                </BackNavigator>
                <div className='absolute top-3 right-3 z-10'>
                    <ProductMenu animal={animal} >
                        <MenuIcon size={32} className='text-black p-1 rounded bg-white' />
                    </ProductMenu>
                </div>
                <div className='relative'>
                    <Image
                        src={animal.images.length > 0 ? animal.images[0].image ? animal.images[0].image : images.chickens.images[1] : images.chickens.images[1]}
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

                    <div className='bg-emerald-50 p-4 rounded-lg mx-4 absolute -mt-20 z-[1]' style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <h1 className='text-3xl text-center font-bold text-gray-800 mt-4'>{formalizeText(animal?.breed ?? "")} {formalizeText(animal?.type ?? "")}</h1>
                        <div className='px-4 py-2'>
                            <p className='text-sm text-gray-600'>{info ?? ''}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-40 p-4'>
                    {animal.allowBidding && !animal.sold && <Marquee className='mb-4 border-y-2 pointer-events-none border-amber-500 bg-amber-50 w-full'>
                        <div className='font-semibold p-1 tracking-widest italic text-amber-700 scale-75 -mb-2 origin-top-left'>Bidding is active for this animal.</div>
                    </Marquee>}
                    <div className='relative'>
                        <div className='text-black px-4 font-semibold bg-zinc-100 p-1 text-sm absolute rounded-r pointer-events-none select-none top-4 -left-0 z-[1]'>Janwar Markaz</div>
                        <YoutubeVideoPlayer className='mb-4' src='https://www.youtube.com/watch?v=H3Uk9WAOI08' autoPlay muted loop />
                    </div>
                    <ByYouTag animal={animal} />
                    <h2 className='text-2xl mb-1 font-bold text-gray-800'>{animal.title}</h2>
                    <p className='text-sm p-1 text-zinc-800 tracking-tight bg-amber-50 h-auto min-h-[100px]'>'{animal.description}'</p>
                    <ElapsedTimeControl date={animal.createdAt} />
                    <div className='border-t-2 border-zinc-300 my-2 p-1 w-full flex justify-end items-center'>
                        <div className='text-xs font-bold tracking-wide'>{formalizeText(animal.city)}, {formalizeText(animal.province)}</div>
                    </div>
                    <SoldOverlay animal={animal}>
                        <CalculatedDescription animal={animal} />
                    </SoldOverlay>
                    {/* <BidTradeView animalId={animal.id} /> */}
                </div>
                <div className='px-4 flex flex-col gap-4'>
                    <div className='flex flex-wrap justify-start items-start gap-2'>
                        {animal.images.map((item: any, index: number) => {
                            return (
                                <MediaViewer key={`${item.name}-${index}`} image={item.image}>
                                    <Image src={item.image ? item.image : images.chickens.images[1]} alt='hen' width={100} height={100} quality={60} loading='lazy' layout='fixed' className='w-24 h-14 object-cover object-left-center rounded-xl cursor-pointer' />
                                </MediaViewer>
                            )
                        })}
                    </div>
                    <div className='my-4 border-l-4 pl-4 border-zinc-200'>
                        <div className='font-bold mb-2 text-xl'>Mode of Delivery</div>
                        <div className='flex flex-col justify-start gap-2 items-start w-full'>{
                            animal.deliveryOptions.map((option: any, index: number) => {
                                const Icon = String(option).toLocaleLowerCase() === "self_pickup" ? SquareUserIcon : TruckIcon
                                return (
                                    // <div key={`${option}-${index}`} className='flex gap-1 items-center'><Icon size={20} className='text-emerald-700' /> {String(option).toLocaleLowerCase() === "self_pickup" ? "Self Pickup" : "Cargo delivery"}</div>
                                    <DeliveryIcon icon={option} key={`${option}-${index}`} size={25} animal={animal} description />
                                )
                            })
                        }</div>
                        {Number(animal.cargoPrice) > 0 && <div className='mt-2 text-lg font-semibold tracking-wider'>Cargo charges: {formatCurrency(animal.cargoPrice)}</div>}
                    </div>
                </div>
                <div className='px-4 my-2 flex flex-col gap-1 justify-end items-end'>
                    {/* <div className='select-none p-1 bg-green-100 rounded-md scale-75 origin-top-right border border-green-300 w-fit font-bold tracking-wider text-green-800'>
                    {animal.priceUnit && <span className='text-base uppercase '>{`${animal.priceUnit === "per Set" ? "Whole set" : animal.priceUnit}`}</span>}
                </div> */}
                </div>
                {
                    !animal?.sold && Number(animal.user.balance ?? 0) < 1 && <div className='mb-2 px-4 flex flex-col gap-2 justify-center items-center w-full'>
                        {animal.allowBidding &&
                            <BidProtection animal={animal}>
                                <Button className='w-full flex gap-2 items-center justify-center'> <CandlestickChartIcon size={20} /> Bargain</Button>
                            </BidProtection>
                        }
                        {/* <DirectCTOButton animal={animal}>
                        <Button variant={'btn-secondary'} className='w-full flex justify-center items-center gap-2'>
                            <Image src={images.site.coins.gold.shine} alt='coin-logo' width={100} height={100} className='w-6 h-6 object-contain pointer-events-none select-none' /> Show Number
                        </Button>
                    </DirectCTOButton> */}
                    </div>
                }
                {
                    <CreateLeadButton animal={animal} />
                }
                <SidebarButtons animal={animal} />
                <GeneralFooter />
            </section >
        </div >
    )
}

export default page